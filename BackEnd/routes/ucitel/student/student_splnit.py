from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id
from lib.HTTP_messages import unauthorized, internal_server_error
from lib.conn import session, uznat_termin


router = APIRouter()


@router.post("/ucitel/splnit")
async def post_ucitel_splnit_studentovi(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    # ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = id_stud.upper()
    id_stud = encode_id(id_stud)
    message = uznat_termin(session, id_terminu, id_stud)
    return message
