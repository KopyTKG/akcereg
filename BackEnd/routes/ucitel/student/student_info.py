from fastapi import APIRouter # type: ignore
from lib.conn import session, get_predmety_by_vyucujici, vytvor_student, get_student_predmety, get_student_info, pocet_cviceni_pro_predmet, vyhodnoceni_studenta
from lib.HTTP_messages import internal_server_error, unauthorized, not_found, ok
from classes.server_utils import kontrola_ticketu, encode_id
from lib.db_utils import get_vsechny_predmety_obj, get_student_by_id
from lib.db_terminy import *



router = APIRouter()


@router.get("/ucitel/student")
async def get_ucitel_studenta(ticket: str, id_stud: str):
    """ Vrátí informace o studentovi 
    Args:
        id_studenta: Jeho osobní číslo"""
    id_stud = id_stud.upper()
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    userid, _ = info[0], info[1]
    userid = encode_id(userid)
    predmety_ucitele = get_predmety_by_vyucujici(session, userid)
    if predmety_ucitele == internal_server_error:
        return internal_server_error
    
    kody_predmetu_ucitele = []
    for predmet in predmety_ucitele:
        kody_predmetu_ucitele.append(predmet.kod_predmetu)


    predmety_studenta = get_student_predmety(ticket, id_stud, get_vsechny_predmety_obj(session))
    if predmety_studenta is not_found:
        return not_found

    student_info = {"osCislo": id_stud}
    try:
        student_info["jmeno"], student_info["prijmeni"], student_info["email"]= get_student_info(ticket, id_stud)
    except:
        return not_found #spatne jmeno studenta
    

    id_stud = encode_id(id_stud)

    student_db = get_student_by_id(session, id_stud)
    if student_db is None or student_db == not_found:
        message = vytvor_student(session, id_stud)
        if message != ok:
            return message


    vyhodnoceni_vsech_predmetu = vyhodnoceni_studenta(session, id_stud, pocet_cviceni_pro_predmet(session))
    if vyhodnoceni_vsech_predmetu == internal_server_error:
            return internal_server_error
    vyhodnoceni = {}

    for predmet in predmety_studenta:
        if predmet in list(vyhodnoceni_vsech_predmetu.keys()) and predmet in kody_predmetu_ucitele:
            vyhodnoceni[predmet] = vyhodnoceni_vsech_predmetu[predmet]

    student_full = {"info": student_info, "profil": vyhodnoceni}

    return student_full
