from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *
from routes.predmety import get_predmety
from urllib.parse import unquote

router = APIRouter()


@router.get("/ucitel/board_by_predmet")
async def get_terminy_by_predmet(ticket: str , predmety: Optional[str] = None, probehle: Optional[bool] = False):
    """ Vrátí všechny vypsané termíny pro daný předmět """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    if predmety is not None:
        predmety = unquote(predmety)

    if predmety is None:
        pomocny_list = await get_predmety(ticket)

        if pomocny_list == internal_server_error:
            return internal_server_error
        predmety = ";".join(pomocny_list) # type: ignore
    list_predmetu = predmety.split(";") # type: ignore
    list_terminu = []
    vyucujici_list = read_file()
    for predmet in list_predmetu:
        if predmet == internal_server_error:
            return internal_server_error
        if probehle:
            list_terminu.extend(list_probehle_terminy_predmet(session, predmet))
        list_terminu.extend(list_planovane_terminy_predmet(session, predmet))
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu
