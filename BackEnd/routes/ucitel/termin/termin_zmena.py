from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, tTermin
from lib.HTTP_messages import unauthorized, internal_server_error
from lib.conn import session, upravit_termin
from lib.db_utils import get_list_emailu_pro_cviceni

router = APIRouter()


@router.patch("/ucitel/termin")
async def ucitel_zmena_terminu(
    ticket: str,
    id_terminu: str,
    termin: tTermin
    ):
    """ Učitel změní parametry v již vypsaném termínu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    if termin.datum_start > termin.datum_konec:
        promenna_na_prohazeni = termin.datum_start
        termin.datum_start = termin.datum_konec
        termin.datum_konec = promenna_na_prohazeni

    message = upravit_termin(session, id_terminu, newStartDatum=termin.datum_start,newKonecDatum=termin.datum_konec, newUcebna=termin.ucebna, newMax_kapacita=termin.max_kapacita, newJmeno=termin.jmeno, cislo_cviceni=termin.cislo_cviceni,newPopis=termin.popis)

    if termin.upozornit:
        list_emailu = get_list_emailu_pro_cviceni(session, termin.kod_predmetu, termin.cislo_cviceni, ticket=ticket)
        return list_emailu
    return message
