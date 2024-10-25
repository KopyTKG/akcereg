from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional
from urllib.parse import unquote

router = APIRouter()


@router.delete("/admin/predmet")
async def delete_predmet(ticket: str, kod_predmetu: str):
    """ Vymaže předmět podle kódu předmětu - admin akce """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    
    if "KA" not in info[1]:
        return unauthorized

    kod_predmetu = unquote(kod_predmetu)
    vystup = smazat_predmet(session, kod_predmetu)
    return vystup
