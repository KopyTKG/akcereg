from fastapi import APIRouter
from classes.server_utils import *

router = APIRouter()

@router.get("/reset/ucitel")
async def nastavit_uciteli_jeho_predmety(ticket: str | None = None):
    """ Podle rozvrhu vyučujícího a předmětů z DB, vytvoří relace se všemi předměty, které vyučující vyučuje"""
    try:
        info = kontrola_ticketu(ticket, vyucujici=False)
        if info == unauthorized or info == internal_server_error:
            return info
        userid, role = encode_id(info[0]), info[1]

        if "KA" not in role:
            predmety_vyucujiciho = get_vyucujici_predmety(ticket, get_vsechny_predmety_obj(session))
            message = pridej_vyucujicimu_predmety_list(session, userid, predmety_vyucujiciho)
        else:
            message = pridej_vyucujicimu_predmety_list(session, userid, get_vsechny_predmety(session))
    
        if message != ok:
            return message
    except:
        return internal_server_error
    return ok