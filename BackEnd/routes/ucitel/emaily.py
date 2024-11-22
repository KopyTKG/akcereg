from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, get_list_studentu
from lib.db_utils import get_katedra_predmet_by_idterminu
from lib.db_terminy import list_studenti_z_terminu
from lib.conn import session
from lib.HTTP_messages import unauthorized, internal_server_error, not_found


router = APIRouter()


@router.get("/ucitel/emaily") # prijima: katedra, zkratka_predmetu, id_terminu
async def get_ucitel_emaily(ticket: str, id_terminu: str): #ticket: str | None = None
    """ Vrátí json s emailama studentů přihlášených na daném termínu
    ve formátu: {osobniCislo: {jemno: , prijmeni:, email: }}"""
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    if list_studentu == internal_server_error:
        return internal_server_error

    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup is None:
        return not_found
    elif vystup == internal_server_error:
        return internal_server_error
    emaily_studentu = get_list_studentu(ticket, list_studentu, vystup)
    return emaily_studentu
        # vraci: {osobniCislo: , jemno: , prijmeni:, email: }
