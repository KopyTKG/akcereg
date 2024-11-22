from fastapi import APIRouter
from classes.server_utils import kontrola_ticketu, encode_id
from lib.db_utils import get_vsechny_predmety_obj
from classes.student import get_predmet_student_k_dispozici
from lib.conn import session, vyhodnoceni_studenta, pocet_cviceni_pro_predmet
from lib.HTTP_messages import internal_server_error, unauthorized


router = APIRouter()


@router.get("/profil")
async def get_student_profil(ticket: str | None = None):
    """ Vraci zaznam o vsech typech cviceni na vsechny predmety, ktere ma student
    zapsane na portalu STAG a jsou zaroven v Databazi, zda je student splnil ci nikoli"""
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]


    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety_obj(session)) # vrátí předměty, které student studuje podle stagu (formát KAT/PRED)
    if predmety_k_dispozici == internal_server_error:
        return internal_server_error

    pocet_pro_predmet = pocet_cviceni_pro_predmet(session) # vrací dict všech předmětů z DB a počet cvičení, formát: {kat/pred: [0, 0, 0], ...}
    if pocet_pro_predmet == internal_server_error:
        return internal_server_error

    vyhodnoceni_vsech_predmetu = vyhodnoceni_studenta(session, userid, pocet_pro_predmet) # vraci dict vyhodnoceni studenta všech předmětů z db
    if vyhodnoceni_vsech_predmetu == internal_server_error:
        return internal_server_error
    vyhodnoceni = {}

    for predmet in predmety_k_dispozici:
        if predmet in list(vyhodnoceni_vsech_predmetu.keys()):
            vyhodnoceni[predmet] = vyhodnoceni_vsech_predmetu[predmet]

    # format: {"kat/pred": [0, 1, 1], ...} # len list = pocet cviceni, index = index cviceni, 0 nesplnil 1 splnil
    return vyhodnoceni
