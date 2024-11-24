from fastapi import APIRouter
from lib.conn import session
from classes.server_utils import kontrola_ticketu, read_file, pridat_vyucujici_k_terminu
from lib.db_terminy import terminy_dopredu
from lib.HTTP_messages import internal_server_error, unauthorized
import os
from logging import ERROR, log


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
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error

    return None