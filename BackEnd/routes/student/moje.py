from fastapi import APIRouter
from classes.server_utils import encode_id, kontrola_ticketu, read_file, pridat_vyucujici_k_terminu
from lib.db_utils import subtract_lists, get_predmet_by_id
from lib.conn import session, historie_studenta, uspesne_dokoncene_terminy
from lib.HTTP_messages import unauthorized, internal_server_error, not_found

router = APIRouter()


@router.get("/student/moje")
async def get_student_moje(ticket: str | None = None):
    """ Vrátí cvičení, na kterých je student aktuálně zapsán

    Args:
        ticket (str): Uživatelský autentizační token.

    Returns:
        list_terminu (list): Seznam cvičení, na kterých je student aktuálně zapsán a nemá je splněné
    """

    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, _ = encode_id(info[0]), info[1]

    historie = historie_studenta(session, userid)
    if historie == not_found:
        return not_found
    elif historie == internal_server_error:
        return internal_server_error

    splnene = uspesne_dokoncene_terminy(session, userid)
    if splnene == internal_server_error:
        return internal_server_error
    if splnene == not_found:
        return not_found

    list_terminu = subtract_lists(historie, splnene)

    for termin in list_terminu:
        predmet = get_predmet_by_id(session, termin.kod_predmet)
        termin.predmet_terminu = predmet

    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu
