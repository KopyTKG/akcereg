from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *
from typing import Optional

router = APIRouter()


@router.get("/admin/moje")
async def get_admin_board(ticket: str, probehle: Optional[bool] = False):
    """ Vrátí všechny vypsané cvičení """
    try:
        info = kontrola_ticketu(ticket, vyucujici=True)
        if info == unauthorized or info == internal_server_error:
            return info
        userid, role = encode_id(info[0]), info[1]

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

    except:
        return internal_server_error
