import hashlib
from lib.HTTP_messages import *
from classes.stag import *
from lib.db_utils import *
import os, json
from pydantic import BaseModel # type: ignore
from datetime import datetime
from typing import Optional


class tTermin(BaseModel):
    model_config =  {
        "arbitrary_types_allowed": True
    }
    ucebna: str
    datum_start: datetime
    datum_konec: datetime
    max_kapacita: int
    kod_predmetu: str
    jmeno: str
    cislo_cviceni: int
    popis: str
    upozornit: Optional[bool] = False
    vyucuje_prijmeni: Optional[str] = None
    vyucuje_jmeno: Optional[str] = None

class tPredmet(BaseModel):
    model_config =  {
        "arbitrary_types_allowed": True
    }
    zkratka_predmetu: str
    katedra: str
    pocet_cviceni: int

def encode_id(id):
    """ Sha1 pro hashování osobních čísel / ucitIdnu """
    return hashlib.sha1(id.encode()).hexdigest()


def kontrola_ticketu(ticket, vyucujici = True):
    """ Provede se kontrola: pokud je uživatel na stagu, pokud má roli a userid správnou
    volitelný arg: vyucujici (bool) - defaultně True : kontrola, jestli není uživatel role ST (pro vyšší práva)"""
    try:
        if ticket is None or ticket == "":
            return unauthorized

        userinfo = get_stag_user_info(ticket)
        if userinfo is None:
            return unauthorized
        if userinfo == internal_server_error:
            return internal_server_error
        userid, role = get_userid_and_role(userinfo)
        if role == internal_server_error:
            return internal_server_error
        if vyucujici and "ST" in role:
            return unauthorized

        return [userid, role]
    except:
        return internal_server_error


def read_file():
    """ Vrátí .temp_vyucujici """
    try:
        temp_file = ".temp_vyucujici.txt"

        with open(temp_file, "r", encoding="utf-8") as infile:
            vyucujici_list = json.load(infile)
        return vyucujici_list
    except:
        return internal_server_error


def vyucujici_k_predmetum_to_txt(session):
    """ Vytvoření souboru .temp_vyucujici.txt, ktery v sobe má kódy předmětů a k něm přiřazené cvičící předmětu podle Stagu """
    try:
        temp_file = ".temp_vyucujici.txt"

        predmety_kod_katedra = get_vsechny_predmety_kod_katedra(session)
        if predmety_kod_katedra == internal_server_error:
            return internal_server_error
        vyucujici = {}
        for predmet in predmety_kod_katedra: #type: ignore
            vyucujici_predmetu = get_vyucujici_predmetu_stag(predmet[0], predmet[1])

            if vyucujici_predmetu == internal_server_error:
                return internal_server_error

            if vyucujici_predmetu is None or vyucujici_predmetu == "":
                vyucujici_seznam = []

            else:
                vyucujici_seznam = vyucujici_predmetu.split("', '") #type: ignore

                if vyucujici:
                    vyucujici_seznam[0] = vyucujici_seznam[0].lstrip("'")
                    vyucujici_seznam[-1] = vyucujici_seznam[-1].rstrip("'")

            vyucujici[predmet[1] + "/" + predmet[0]] = vyucujici_seznam if vyucujici_seznam else [""]

        if os.path.exists(temp_file):
            os.remove(temp_file)
        with open(temp_file, "w", encoding="utf-8") as outfile:
            json.dump(vyucujici, outfile, ensure_ascii=False, indent=4)

    except:
        return internal_server_error


def get_jmena_predmetu_by_zkratka(session, zkratky_predmetu):
    """ Vrací jména předmětů podle zkratek předmětu """
    try:
        jmena_predmetu = []
        for zkratka in zkratky_predmetu:
            katedra = get_katedra_by_predmet(session, zkratka)
            if katedra == internal_server_error:
                return internal_server_error
            if katedra is None:
                jmeno = zkratka
            else:
                jmeno = katedra + "/" + zkratka #type: ignore
            jmena_predmetu.append(jmeno)

        return jmena_predmetu
    except:
        return internal_server_error


def get_predmet_id_jmeno_cisla(predmety):
    """ Vrací seznam slovníků, které nesou informace o předmětech """
    try:
        predmet_id_jmeno_cisla = []
        for predmet in predmety:
            info = {}
            info["id"] = predmet.kod_predmetu
            info["pocet_cviceni"] = predmet.pocet_cviceni
            predmet_id_jmeno_cisla.append(info)

        if len(predmet_id_jmeno_cisla) == 0:
            return []

        return predmet_id_jmeno_cisla
    except:
        return internal_server_error


def get_predmety_by_kody(session, kody_predmetu):
    """ Vrací seznam objektů předmětů podle kódů předmětů """
    try:
        predmety = []
        for kod in kody_predmetu:
            predmet = get_predmet_by_id(session, kod)
            if predmet == internal_server_error:
                return internal_server_error
            if predmet is None:
                continue
            else:
                predmety.append(predmet)

        return predmety
    except:
        return internal_server_error


def get_list_studentu(ticket, list_studentu, pred_kat):
    """ Vrací seznam studentů dekódovaný s informacema o nich
    Args:
        list_studentu: zahashovaný seznam studentů
        pred_kat: [predmet, katedra]
    """

    predmet, katedra = pred_kat[0], pred_kat[1]
    vsichni_studenti = get_studenti_na_predmetu(ticket, katedra, predmet)
    if vsichni_studenti == internal_server_error:
        return internal_server_error
    dekodovane_cisla = compare_encoded(list_studentu, vsichni_studenti)
    jmena_studentu = get_studenti_info(ticket,  dekodovane_cisla)
    if jmena_studentu == internal_server_error:
        return internal_server_error
    return jmena_studentu


def pridej_datum_splneni_do_listu_studentu(list_studentu, termin_id):
    """ Přidá datum splnení do listu studentů """
    for student in list_studentu:
        id_student = encode_id(student["osCislo"])
        student["datum_splneni"] = get_datum_splneni_terminu(session, id_student, termin_id)
        if student["datum_splneni"] == internal_server_error:
            return internal_server_error
    return list_studentu



def pridat_vyucujici_k_terminu(terminy, vyucujici_list):
    """ Prida vyucujici do terminu """
    for i, termin in enumerate(terminy):
        termin_dict = vars(termin)
        kod = termin_dict["kod_predmet"]
        vyucujici = vyucujici_list[kod]
        termin_dict["vyucujici"] = vyucujici

        terminy[i] = termin_dict
    return terminy
