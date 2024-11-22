from fastapi import APIRouter
from lib.conn import session
from classes.vyucujici import get_vyucujici_predmety
from lib.db_utils import get_vsechny_predmety_obj
from lib.HTTP_messages import internal_server_error, unauthorized, ok
from classes.server_utils import kontrola_ticketu, encode_id
from lib.db_utils import get_vsechny_predmety, get_vsechny_predmety_obj, pridej_vyucujicimu_predmety_list

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
