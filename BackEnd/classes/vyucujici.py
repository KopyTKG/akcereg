import requests
import hashlib
from classes.stag import *
import os


def get_student_info(ticket, osobni_cislo):
    """ Vrátí informace o studentovi podle osobního čísla """
    try:
        params = {
            "osCislo": osobni_cislo,
        }
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }

        url = os.getenv('STAG_URL') + "ws/services/rest2/student/getStudentInfo" #type: ignore
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket}).json()

        jmeno = response["jmeno"]
        prijmeni = response["prijmeni"]
        email = response["email"]

        return jmeno, prijmeni, email
    
    except:
        return internal_server_error


def get_student_predmety(ticket, osobni_cislo, predmety_db):
    """ Vrátí informace o studentovi podle osobního čísla """
    try:
        params = {
            "osCislo": osobni_cislo,
        }
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        url = os.getenv('STAG_URL') + "ws/services/rest2/rozvrhy/getRozvrhByStudent" #type: ignore
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket}).json()
    except:
        return not_found
    try:
        response = response["rozvrhovaAkce"]
        predmety = []
        predmety_db = [predmet_db.kod_predmetu for predmet_db in predmety_db]
        for predmet in response:
            kod = (predmet["katedra"] + "/" + predmet["predmet"])
            if kod in predmety_db:
                if kod not in predmety:
                    predmety.append(kod)

        return predmety
    except:
        return internal_server_error


def get_studenti_info(ticket, list_studentu):
    """ Vrátí informace o studentech podle osobního čísla """
    info = []
    try:
        for student in list_studentu:
            jmeno, prijmeni, email = get_student_info(ticket, student) #type: ignore
            student_info = {"osCislo": student, "jmeno": jmeno, "prijmeni": prijmeni, "email": email}
            info.append(student_info)

        return info
    except:
        return internal_server_error


# Asi není potřeba - pouze pro to, kdyby mohl učitel vypisovat pouze na svoje předměty
def get_ucitel_predmety(ticket, ucitIdno):
    """
     Vrati predmety, ktere ucitel vyucuje
    """
    try:
        url = "ws/services/rest2/predmety/getPredmetyByUcitel"
        params = {
            "ucitIdno": ucitIdno,
        }
        return get(ticket, url, params)
    except:
        return internal_server_error


def get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu):
    """ Získá F čísla všech studentů, kteří jsou zapsáni na předmětu """
    url = os.getenv("STAG_URL") + "ws/services/rest2/student/getStudentiByPredmet" # type: ignore
    params = {
        "zkratka": zkratka_predmetu,
        "katedra": katedra,
    }

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": os.getenv("STAG_URL"),
    }

    try:
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
        response = response.json()["studentPredmetu"]
        osobni_cisla = []
        for student in response:
            osobni_cisla.append(student["osCislo"])

        return osobni_cisla

    except:
        return internal_server_error


def compare_encoded(hash_studentu_na_terminu, studenti_na_predmetu):
    """ Vrátí nekódované Fčísla studentů, bere argument hashovaných Fčísel studentů, které porovná se všemi zapsanými studenty na předmětu """
    try:
        hash_studenti_na_predmetu = []
        for student in studenti_na_predmetu:
            hash_studenti_na_predmetu.append(hashlib.sha1(student.encode()).hexdigest())

        matching = find_matching_hash_positions(hash_studenti_na_predmetu, hash_studentu_na_terminu)
        if matching == internal_server_error:
            return internal_server_error


        osobni_cisla = []
        for match in matching: #type:ignore
            osobni_cisla.append(studenti_na_predmetu[match])

    # return osobni_cisla misto matching
        return osobni_cisla

    except:
        return internal_server_error


def find_matching_hash_positions(big_list, small_list):
    try:
        matching_positions = []

        for small_hash in small_list:
            if small_hash in big_list:
                big_list_index = big_list.index(small_hash)
                matching_positions.append(big_list_index)

        return matching_positions
    except:
        return internal_server_error


def get_vyucujici_predmety(ticket, predmety_db):
    """ Vrátí kódy předmětů, které vyučující má v rozvrhu a zároveň jsou tyto předměty k dispozici v DB"""
    url = os.getenv("STAG_URL") + "ws/services/rest2/rozvrhy/getRozvrhByUcitel" #type: ignore
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": os.getenv("STAG_URL"),
    }
    id = get_userid_and_role(get_stag_user_info(ticket))[0]

    params = {
        "ucitIdno": id,
    }
    try:
        response = (requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})).json() #type: ignore
    except:
        return unauthorized
    
    try:
        predmety = response["rozvrhovaAkce"]
        predmety_db = [predmet.kod_predmetu for predmet in predmety_db]
        predmety_ucitele = []
        for predmet in predmety:
            predmet, katedra = predmet["katedra"], predmet["predmet"]
            if predmet and katedra:
                kod = predmet + "/" + katedra
                if kod in predmety_db:
                    if kod not in predmety_ucitele:
                        predmety_ucitele.append(kod)

        return predmety_ucitele
    except:
        return internal_server_error
    

def get_id_ucitele_by_jmeno_prijmeni(ticket, jmeno, prijmeni):
    """ Získá F čísla všech studentů, kteří jsou zapsáni na předmětu """
    url = os.getenv("STAG_URL") + "ws/services/rest2/ucitel/najdiUcitelePodleJmena" #type: ignore
    params = {
        "prijmeni": prijmeni,
        "jmeno": jmeno,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": os.getenv("STAG_URL"),
    }
    try:
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
        response = response.json()["ucitel"][0]
        if len(response) == 0:
            return []
        return str(response["ucitIdno"])
    except:
        return not_found

__all__ = [get_student_info, get_student_predmety, get_studenti_info, get_ucitel_predmety, get_studenti_na_predmetu, compare_encoded, find_matching_hash_positions, get_vyucujici_predmety, get_id_ucitele_by_jmeno_prijmeni, ]