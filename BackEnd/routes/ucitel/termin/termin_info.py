from fastapi import APIRouter
from lib.conn import session
from lib.HTTP_messages import internal_server_error, unauthorized, not_found
from classes.server_utils import kontrola_ticketu, get_list_studentu, pridej_datum_splneni_do_listu_studentu, get_katedra_predmet_by_idterminu, get_termin_info, get_vsechny_terminy
from lib.db_terminy import *


router = APIRouter()


@router.get("/ucitel/termin")
async def get_info_o_terminu(ticket: str, id_terminu: str):
    """ Vrácení všech studentů, a i kteří se zapsali na daný seminář a info o termínu"""
    #ticket = os.getenv('TICKET') # prozatimni reseni
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vsechny_terminy = get_vsechny_terminy(session)
    if vsechny_terminy == internal_server_error:
        return internal_server_error
    if id_terminu not in vsechny_terminy:
        return not_found

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    if list_studentu == internal_server_error:
        return internal_server_error
    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup == internal_server_error:
        return internal_server_error
    if vystup is None:
        return not_found
    
    studenti = get_list_studentu(ticket, list_studentu, vystup)
    if studenti == internal_server_error:
        return internal_server_error
    studenti = pridej_datum_splneni_do_listu_studentu(studenti, id_terminu)
    if studenti == internal_server_error:
        return internal_server_error
    termin_info = get_termin_info(session, id_terminu)
    if termin_info == internal_server_error:
        return internal_server_error
    return {"studenti": studenti, "termin": termin_info}
