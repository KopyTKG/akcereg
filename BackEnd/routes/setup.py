from fastapi import APIRouter
from lib.conn import session, vytvor_student, vytvor_vyucujici
from classes.server_utils import encode_id, kontrola_ticketu
from lib.HTTP_messages import unauthorized, internal_server_error, ok

router = APIRouter()


@router.get("/setup")
async def kontrola_s_db(ticket: str | None = None):
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), [info[1]]
    if "ST" not in role:
        message = vytvor_vyucujici(session, userid)
        if message != ok:
            return message
    else:
        message = vytvor_student(session, userid)
        if message == internal_server_error:
            return internal_server_error
    return info[0], role, userid

