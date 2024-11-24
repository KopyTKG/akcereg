from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id
from lib.conn import session, odepsat_z_terminu, zapsat_se_na_termin
from lib.HTTP_messages import unauthorized, internal_server_error, bad_request

router = APIRouter()

@router.post("/student")
async def zmena_statusu_zapsani(ticket: str, typ: str, id_terminu: str):
    """ Zaregistruje, či se odhlásí z labu, na základě ukázky na hlavní straně
    Args:
        ticket (str): Uživatelský autentizační token.
        typ (str): Typ operace, buď 'zapsat' pro zapsání nebo 'odhlasit' pro odhlášení.
        id_terminu (str): Identifikační kód termínu, na který se má akce vztahovat.

    Returns:
        HTTP code(str): 200 - OK, 401 - Unauthorized, 400 - Bad Request, 409 - Conflict"""

    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, _ = encode_id(info[0]), info[1]

    if typ == "zapsat":
        message = zapsat_se_na_termin(session, userid, id_terminu)
        return message
    elif typ == "odhlasit":
        message = odepsat_z_terminu(session, userid, id_terminu)
        return message
    else:
        return bad_request
