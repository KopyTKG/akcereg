from fastapi import APIRouter
from classes.server_utils import *
from classes.student import *

router = APIRouter()


@router.get("/reset/student")
async def nastavit_studentovi_jeho_predmety(ticket:str | None = None):
    """ Podle zapsaných předmětů studenta a předmětu z DB vytvoří relace ZapsanePredmety"""
    try:
        info = kontrola_ticketu(ticket, vyucujici=False)
        if info == unauthorized or info == internal_server_error:
            return info
        userid, role = encode_id(info[0]), info[1]
        predmety_studenta = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety_obj(session))
        if predmety_studenta == internal_server_error:
            return internal_server_error
        return predmety_studenta
    except:
        return internal_server_error