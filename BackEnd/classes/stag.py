import requests
import os
from lib.HTTP_messages import internal_server_error
from logging import ERROR, log


def get(ticket, url, params):
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": os.getenv("STAG_URL"),
    }
    url = os.getenv('STAG_URL') + url
    try:
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
        if not response.ok:
            raise Exception(response.text)
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error
    try:
        response = response.json()
    except:
        return None
    return response


def get_stag_user_info(ticket):
    """ Vrátí jméno, příjmení, email, titul a stagUserInfo (username, role, nazev, ucitIdno/osCilo, email)"""
    try:
        url = os.getenv('STAG_URL') + "ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + ticket  # type: ignore
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        response = requests.get(url, headers=headers)
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error
    if not response.ok:
        return None
    try:
        response = response.json()
    except:
        return None
    return response


def bool_existuje_predmet(ticket, katedra, zkratka_predmetu):
    """ Vrátí informace o předmětu """
    try:
        url = os.getenv('STAG_URL') + "ws/services/rest2/predmety/getPredmetInfo" # type: ignore
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        params = {
            "katedra": katedra,
            "zkratka": zkratka_predmetu
        }
        response = requests.get(url, headers=headers, params=params)
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error
    if not response.ok:
        return None
    try:
        response = response.json()
        if response:
            return True
        else:
            return False
    except:
        return None


def get_vyucujici_predmetu_stag(zkratka_predmetu, katedra):
    """ Vrátí informace o predmetu"""
    try:
        params = {
            "katedra": katedra,
            "zkratka": zkratka_predmetu
        }
        url= os.getenv('STAG_URL') + "ws/services/rest2/predmety/getPredmetInfo" # type: ignore
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        response = requests.get(url, headers=headers, params=params)
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error

    if not response.ok:
        return "chyba"
    try:
        response = response.json()
    except:
        return None
    return response["cvicici"]


def get_userid_and_role(json):
    """Vrací userId a roli uživatele
    json: json, který vrací funkce "get_stag_user_info"
    """
    try:
        role = json["stagUserInfo"][0]["role"]
        if role == "":
            return internal_server_error, internal_server_error
        if "ST" not in role:
            userid = str(json["stagUserInfo"][0]["ucitIdno"])
        else:
            userid = str(json["stagUserInfo"][0]["osCislo"])
        return userid, role
    except KeyboardInterrupt:
        os.close(1)
    except SystemExit:
        os.close(1)
    except Exception as e:
        log(ERROR, e)
        return internal_server_error, internal_server_error


__all__ = ["get", "get_stag_user_info", "bool_existuje_predmet", "get_vyucujici_predmetu_stag", "get_userid_and_role"]
