from fastapi import APIRouter
from lib.conn import session
from classes.server_utils import kontrola_ticketu, read_file, encode_id, pridat_vyucujici_k_terminu
from lib.HTTP_messages import internal_server_error, unauthorized
from lib.db_terminy import list_nadchazejici_terminy, list_probehle_terminy
from logging import ERROR, log
from typing import Optional
import os

router = APIRouter()


@router.get("/admin/moje")
async def get_admin_board(ticket: str, probehle: Optional[bool] = False):
    """ Vrátí všechny vypsané cvičení """
    try:
        info = kontrola_ticketu(ticket, vyucujici=True)
        if info == unauthorized or info == internal_server_error:
            return info
        _, role = encode_id(info[0]), info[1]

        if "KA" not in role:
            return unauthorized

        list_terminu = list_nadchazejici_terminy(session)
        if probehle:
            list_terminu += list_probehle_terminy(session)

        if list_terminu == internal_server_error:
            return internal_server_error
        vyucujici_list = read_file()
        list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

        return list_terminu

    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error
