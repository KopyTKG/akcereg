from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id, tTermin
from lib.conn import session, vypsat_termin
from classes.vyucujici import get_id_ucitele_by_jmeno_prijmeni
from lib.HTTP_messages import unauthorized, not_found, internal_server_error, ok
from lib.db_utils import get_list_emailu_pro_cviceni

router = APIRouter()


@router.post("/ucitel/termin")
async def ucitel_vytvor_termin(ticket: str, termin: tTermin):
    """ Učitel vytvoří termín do databáze """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    vypsal_id, role = encode_id(info[0]), info[1]
    if termin.kod_predmetu is None:
        return not_found
    if termin.vyucuje_prijmeni is not None and len(termin.vyucuje_prijmeni) > 2:
        vyucuje_id = get_id_ucitele_by_jmeno_prijmeni(ticket, str(termin.vyucuje_jmeno), str(termin.vyucuje_prijmeni))
        if vyucuje_id == not_found or vyucuje_id == []:
            return not_found
        vyucuje_id = encode_id(vyucuje_id) # type: ignore
    else:
        vyucuje_id = vypsal_id
        
    if termin.datum_start > termin.datum_konec:
        promenna_na_prohazeni = termin.datum_start
        termin.datum_start = termin.datum_konec
        termin.datum_konec = promenna_na_prohazeni
        
    message = vypsat_termin(session, termin.ucebna, termin.datum_start, termin.datum_konec, termin.max_kapacita, vypsal_id, vyucuje_id, termin.kod_predmetu, termin.jmeno, termin.cislo_cviceni, termin.popis) # type: ignore
    if message is not ok:
        return message

#TODO: upozornění na termíny     
    if termin.upozornit:
        list_emailu = get_list_emailu_pro_cviceni(session, termin.kod_predmetu, termin.cislo_cviceni, ticket=ticket, novy_termin=True)
        return list_emailu
    
    else:
        return ok

