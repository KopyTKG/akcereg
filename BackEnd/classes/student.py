import requests
import os
from classes.stag import *
import json

def get_predmet_by_student(ticket, semestr, userid):
    """ Vrátí všechny zapsané předměty studentem v daném semestru (ZS / LS)"""
    url = "ws/services/rest2/predmety/getPredmetyByStudent"
    params = {
        "osCislo": userid,
        "semestr": semestr,
    }
    return get(ticket, url, params)


def get_predmet_student_k_dispozici(ticket, predmety_lab):
    """
    Vrati vsechny predmety, pro ktere existuje moznost seminare, ktere student jeste nema splneny, ale zapsany
    """
    url = os.getenv('STAG_URL') + "ws/services/rest2/student/getStudentPredmetyAbsolvoval" # type: ignore
    try:
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive", 
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        response = requests.get(url, headers=headers, cookies={'WSCOOKIE': ticket})
        if not response.ok:
            return not_found
    except:
        return internal_server_error

    splneno = set()
    aktivni_predmety = set()
    predmety = response.json()
    zkratky = []

    try:
        for predmet in predmety_lab:
            zkratky.append((predmet.kod_predmetu).split("/")[-1])

        for predmet in predmety["predmetAbsolvoval"]:
            if predmet["zkratka"] in zkratky:
                if predmet["absolvoval"] == "N":
                    aktivni_predmety.add(predmet["katedra"] + "/" + predmet["zkratka"])
                else:
                    splneno.add(predmet["katedra"] + "/" + predmet["zkratka"])

        predmety = list(aktivni_predmety - splneno)  # Set difference operation
        return predmety
    except:
        return internal_server_error

__all__ = ["get_predmet_by_student", "get_predmet_student_k_dispozici"] 
