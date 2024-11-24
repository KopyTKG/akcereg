from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id
from lib.HTTP_messages import unauthorized, internal_server_error, ok, not_found
from lib.conn import session, pridat_studenta, uznat_termin
from lib.db_utils import get_uznavaci_termin_by_kod
from urllib.parse import unquote

router = APIRouter()


@router.post("/ucitel/uznat")
async def post_ucitel_uznat_studentovi(ticket: str, id_stud: str, kod_predmetu: str):
    """ Uznat studentovi všechna cvičení dle zkratky předmětu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = id_stud.upper() 
    id_stud = encode_id(id_stud)
    kod_predmetu = unquote(kod_predmetu)
    id_terminu = get_uznavaci_termin_by_kod(session, kod_predmetu)
    if id_terminu == internal_server_error:
        return internal_server_error
    elif id_terminu is None:
        return not_found
    message = pridat_studenta(session, id_stud, id_terminu)
    if message != ok:
        return message
    session.commit()
    message = uznat_termin(session, id_terminu, id_stud)
    return message
