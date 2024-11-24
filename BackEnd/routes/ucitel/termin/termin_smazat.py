from fastapi import APIRouter
from lib.conn import session, smazat_termin
from lib.HTTP_messages import unauthorized, internal_server_error
from classes.server_utils import kontrola_ticketu


router = APIRouter()


@router.delete("/ucitel/termin")
async def ucitel_smazani_terminu(ticket: str, id_terminu: str):
    """ Učitel smáže vypsaný termín """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    res = smazat_termin(session, id_terminu)
    return res

