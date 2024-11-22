from fastapi import APIRouter
from lib.conn import session
from classes.server_utils import kontrola_ticketu, get_predmet_by_id
from lib.HTTP_messages import unauthorized, internal_server_error, not_found

router = APIRouter()


@router.get("/admin/predmet")
async def get_predmet(ticket: str, zkratka_predmetu:str, katedra:str):
    """ Vrátí info o předmětu - admin akce """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    if "KA" not in info[1]:
        return unauthorized
    
    kod_predmetu = katedra + "/" + zkratka_predmetu
    vystup = get_predmet_by_id(session, kod_predmetu)
    if vystup == internal_server_error:
        return internal_server_error
    elif vystup is None:
        return not_found
    return {"predmet": vystup}
