from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *


router = APIRouter()


@router.get("/admin")
async def get_admin_board_next_ones(ticket: str | None = None):
    """Vrátí všechny cvičení v času dopředu dle readme"""

    try:
        info = kontrola_ticketu(ticket, vyucujici=True)
        if info == unauthorized or info == internal_server_error:
            return info
        
        if "KA" not in info[1]:
            return unauthorized

        list_terminy_dopredu = terminy_dopredu(session)
        if list_terminy_dopredu == internal_server_error:
            return internal_server_error
        vyucujici_list = read_file()
        list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
        return list_terminu
    except:
        return internal_server_error