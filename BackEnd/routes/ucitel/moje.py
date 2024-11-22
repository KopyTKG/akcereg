from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id, read_file, pridat_vyucujici_k_terminu
from lib.conn import session
from lib.HTTP_messages import unauthorized, internal_server_error
from lib.db_terminy import list_terminy_vyucujici, terminy_dopredu_pro_vyucujiciho
from typing import Optional

router = APIRouter()


@router.get("/ucitel/moje")
async def get_ucitel_moje_vypsane(ticket: str, probehle: Optional[bool] = False):
    """ Vrátí všechny cvičení, které vypsal uživatel """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, _ = encode_id(info[0]), info[1]

    if not probehle:
        list_terminu = terminy_dopredu_pro_vyucujiciho(session, userid)
    else:
        list_terminu = list_terminy_vyucujici(session, userid)
    if list_terminu == internal_server_error:
        return internal_server_error
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu
