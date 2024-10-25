from fastapi import APIRouter
from classes.server_utils import *
from classes.student import *


router = APIRouter()


@router.get("/predmety")
async def get_predmety(ticket: str | None = None):
    """ Vrátí všechny predmety"""

    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    vsechny_predmety = get_vsechny_predmety_obj(session)
    if vsechny_predmety == internal_server_error:
        return internal_server_error

#TODO: tohle musíme změnit na parametr, že je uživatel pod rolí katedry
    # dekan#_ujp což je náš ekvivalent Škvora
    if "KA" in info[1]:
        jmena_vsech_predmetu = get_predmet_id_jmeno_cisla(vsechny_predmety)
        return jmena_vsech_predmetu
    
    elif "ST" in role:
        predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, vsechny_predmety)
        if predmety_k_dispozici is None:
            return internal_server_error
        if predmety_k_dispozici == internal_server_error:
            return internal_server_error
        predmety = get_predmety_by_kody(session, predmety_k_dispozici)
        if predmety == internal_server_error:
            return internal_server_error
        jmena_predmetu_k_dispozici = get_predmet_id_jmeno_cisla(predmety)
        return jmena_predmetu_k_dispozici

    else: # možná přidáme ještě nějaké role
        predmety_vyucujiciho = get_predmety_by_vyucujici(session, userid)
        if predmety_vyucujiciho is None:
            return internal_server_error
        if predmety_vyucujiciho == internal_server_error:
            return internal_server_error

        jmena_predmetu_vyucujiciho = get_predmet_id_jmeno_cisla(predmety_vyucujiciho)
        return jmena_predmetu_vyucujiciho

   
