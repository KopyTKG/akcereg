from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()

@router.delete("/ucitel/splnit")
async def post_ucitel_splnit_studentovi(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Učitel se splnil, uznal to špatnému studentovi -> nemá splněný určitý termín cvičení """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = id_stud.upper()
    id_stud = encode_id(id_stud)
    message = neuznat_termin(session, id_terminu, id_stud)
    return message