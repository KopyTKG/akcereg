from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *


router = APIRouter()


@router.get("/ucitel/studenti")
async def get_vypis_studentu(ticket: str, id_terminu: str):
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    #ticket = os.getenv('TICKET') # prozatimni reseni
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    vsechny_terminy = get_vsechny_terminy(session)
    if vsechny_terminy == internal_server_error:
        return internal_server_error
    if id_terminu not in vsechny_terminy:
        return bad_request

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    if list_studentu == internal_server_error:
        return internal_server_error
    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup is None:
        return not_found
    elif vystup == internal_server_error:
        return internal_server_error

    jmena_studentu = get_list_studentu(ticket, list_studentu, vystup)
    return jmena_studentu
        # vraci list {osCislo: {jmeno: , prijmeni: , email: }}