from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id, read_file, pridat_vyucujici_k_terminu
from lib.db_terminy import terminy_dopredu_pro_vyucujiciho
from lib.HTTP_messages import unauthorized, internal_server_error
from lib.conn import session


router = APIRouter()


@router.get("/ucitel")
async def get_ucitel_board_future_ones(ticket: str | None = None):
    """Vrátí cvičení jednoho učitele v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, _ = encode_id(info[0]), info[1]

    list_terminy_dopredu = terminy_dopredu_pro_vyucujiciho(session, userid)
    if list_terminy_dopredu == internal_server_error:
        return internal_server_error
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
    return list_terminu
