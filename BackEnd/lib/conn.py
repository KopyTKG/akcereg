from sqlalchemy import create_engine,ForeignKey, Column, String, Integer, Text, UUID, DateTime, and_ 
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
import os
import dotenv
import uuid
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from lib.HTTP_messages import ok, internal_server_error, not_found, bad_request, conflict, unauthorized

# nacteni DB connection stringu z .env
dotenv.load_dotenv()
DATABASE_URL = os.getenv('DB_URL')


if not DATABASE_URL:
    raise Exception("Missing envs")

# navazani pripojeni k DB
engine = create_engine(DATABASE_URL)

Base = declarative_base()

Session = sessionmaker(bind=engine)

# connector/handler pro databazi
session = Session()


# Jednotlive namapovane tables
class Termin(Base):
    __tablename__ = "termin"

    id = Column("id", UUID, primary_key=True)
    ucebna = Column("ucebna", Text)
    datum_start = Column("datum_start", DateTime)
    datum_konec = Column("datum_konec", DateTime)
    aktualni_kapacita = Column("aktualni_kapacita", Integer)
    max_kapacita = Column("max_kapacita", Integer)
    jmeno = Column("jmeno", Text)
    vypsal_id = Column(String, ForeignKey('vyucujici.id'))
    vyucuje_id = Column(String, ForeignKey('vyucujici.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu', ondelete='CASCADE'))
    cislo_cviceni = Column("cislo_cviceni", Integer)
    popis = Column("popis", Text)
    # Relationships to Predmet
    predmet = relationship('Predmet', back_populates="termin", passive_deletes=True)
    # Relationships to Vyucujici
    vypsal = relationship('Vyucujici', foreign_keys=[vypsal_id], back_populates="terminy_vypsal")
    vyucuje = relationship('Vyucujici', foreign_keys=[vyucuje_id], back_populates="terminy_vyucuje")
    # Many-to-many relationship via HistorieTerminu
    historie_terminu = relationship('HistorieTerminu', back_populates="termin", passive_deletes=True)

class VyucujiciPredmety(Base):
    __tablename__ = "vyucujici_predmety"

    id = Column("id", Integer, primary_key=True)
    kod_predmetu = Column(Text, ForeignKey('predmet.kod_predmetu', ondelete='CASCADE'))
    vyucujici_id = Column(String, ForeignKey('vyucujici.id', ondelete='CASCADE'))
    # Relationships to Vyucujici
    vyucujici = relationship('Vyucujici', back_populates="predmet_vyucuje", passive_deletes=True)
    # Relationships to Predmet
    predmet = relationship('Predmet', back_populates="vyucujici_predmety", passive_deletes=True)

class Vyucujici(Base):
    __tablename__ = "vyucujici"

    id = Column(String, primary_key=True)
    # Many-to-many relationship via VyucujiciPredmety
    predmet_vyucuje = relationship("VyucujiciPredmety", back_populates="vyucujici")
    # Relationships to Termin
    terminy_vyucuje = relationship("Termin", foreign_keys=[Termin.vyucuje_id], back_populates="vyucuje")
    terminy_vypsal = relationship("Termin", foreign_keys=[Termin.vypsal_id], back_populates="vypsal")
    # Many-to-many relationship via VyucujiciPredmety
    vyucujici_predmety = relationship("VyucujiciPredmety", back_populates="vyucujici", passive_deletes=True)

class Predmet(Base):
    __tablename__ = "predmet"

    kod_predmetu = Column("kod_predmetu", Text, primary_key=True)
    zkratka_predmetu = Column("zkratka_predmetu", Text)
    katedra = Column("katedra", Text)
    pocet_cviceni = Column("pocet_cviceni", Integer)
    # Many-to-many relationship via VyucujiciPredmety
    vyucujici_predmety = relationship('VyucujiciPredmety', back_populates="predmet", passive_deletes=True)
    # Relationships to Termin
    termin = relationship('Termin', back_populates="predmet", passive_deletes=True)

class Student(Base):
    __tablename__ = "student"

    id = Column("id", String, primary_key=True)
    datum_vytvoreni = Column("datum_vytvoreni", DateTime)
    # Many-to-many relationship via HistorieTerminu
    historie_terminu = relationship('HistorieTerminu', back_populates="student", passive_deletes=True)

class HistorieTerminu(Base):
    __tablename__ = "historie_terminu"

    id = Column("id", UUID, primary_key=True)
    student_id = Column(String, ForeignKey('student.id', ondelete='CASCADE'))
    termin_id = Column(UUID, ForeignKey('termin.id', ondelete='CASCADE'))
    datum_splneni = Column("datum_splneni", DateTime)
    # Realationships to Student
    student = relationship('Student', back_populates="historie_terminu")
    # Relationships to Termin
    termin = relationship('Termin', back_populates="historie_terminu")



### TVORBA UZIVATEL
def vytvor_student(session, id):
    try:
        if session.query(Student).filter_by(id=id).first() is None:
            student = Student(id=id, datum_vytvoreni=datetime.now())
            session.add(student)
            session.commit()
            return ok
        return ok
    except:
        session.rollback()
        return internal_server_error


def vytvor_vyucujici(session, id):
    try:
        if session.query(Vyucujici).filter_by(id=id).first() is None:
            vyucujici = Vyucujici(id=id)
            session.add(vyucujici)
            session.commit()
            return ok
        return ok
    except:
        session.rollback()
        return internal_server_error


### USER ACTIONS
def upravit_termin(session, id_terminu, newStartDatum=None, newKonecDatum=None, newUcebna=None, newMax_kapacita=None, newJmeno=None, cislo_cviceni=None, newPopis=None):
    try:
        termin = session.query(Termin).filter(Termin.id == id_terminu).first()

        if termin is None:
            return not_found

        if newStartDatum is not None:
            termin.datum_start = newStartDatum

        if newKonecDatum is not None:
            termin.datum_konec = newKonecDatum

        if newUcebna is not None:
            termin.ucebna = newUcebna

        if newMax_kapacita is not None:
            termin.max_kapacita = newMax_kapacita

        if newJmeno is not None:
            termin.jmeno = newJmeno

        if cislo_cviceni is not None:
            termin.cislo_cviceni = cislo_cviceni

        if newPopis is not None:
            termin.popis = newPopis

        session.commit()
        return ok
    except:
        session.rollback()
        return internal_server_error


def odepsat_z_terminu(session, student_id, termin_id):
    try:
        termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id,HistorieTerminu.student_id == student_id).first()

        if termin:
            if termin.datum_splneni is not None:
                return unauthorized

            konkretni_termin = session.query(Termin).filter(Termin.id == termin_id).first()

            if (konkretni_termin.datum_start - datetime.now()) < timedelta(hours=float(os.getenv("MIN_TIME_ODZAPIS"))): #type:ignore
                return conflict

            konkretni_termin.aktualni_kapacita -= 1

            session.delete(termin)
            session.commit()
            return ok
        else:
            return bad_request

    except:
        session.rollback()
        return internal_server_error


def zapsat_se_na_termin(session, student_id, termin_id):
    try:
        zapsat_na_termin = HistorieTerminu(id=uuid.uuid4(), student_id=student_id, termin_id=termin_id)

        termin = session.query(Termin).filter(Termin.id == termin_id).first()

        if termin is None:
            return not_found

        if termin.aktualni_kapacita >= termin.max_kapacita:
            return conflict

        if termin.cislo_cviceni == -1:
            return conflict

        termin.aktualni_kapacita += 1
        session.add(zapsat_na_termin)
        session.commit()

        return ok

    except:
        session.rollback()
        return internal_server_error


def smazat_termin(session, id_terminu):
    try:
        termin = session.query(Termin).filter(Termin.id == id_terminu).first()
        if termin is None:
            return not_found

        session.delete(termin)
        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def uznat_termin(session, id_terminu, id_studenta):
    try:
        termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == id_terminu,HistorieTerminu.student_id == id_studenta)).first()

        if termin is None:
            return not_found

        termin.datum_splneni = datetime.now()

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def neuznat_termin(session, id_terminu, id_studenta):
    try:
        termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == id_terminu,HistorieTerminu.student_id == id_studenta)).first()

        if termin is None:
            return not_found

        termin.datum_splneni = None

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def pridat_studenta(session, student_id, termin_id, datum_splneni=None):
    try:
        if session.query(Student).filter_by(id=student_id).first() is None:
            return not_found

        elif session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == termin_id,HistorieTerminu.student_id == student_id)).first() is not None:
            return conflict

        zapis_termin = HistorieTerminu(id=uuid.uuid4(),student_id=student_id,termin_id=termin_id,datum_splneni=datum_splneni)

        session.add(zapis_termin)

        termin = session.query(Termin).filter(Termin.id == termin_id).first()
        termin.aktualni_kapacita += 1

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error

### PREDMETY
def vytvor_predmet(session, kod_predmetu, zkratka_predmetu, katedra, vyucuje_id, pocet_cviceni):
    try:
        if session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first() is not None:
            return conflict
        predmet = Predmet(kod_predmetu=kod_predmetu,zkratka_predmetu=zkratka_predmetu,katedra=katedra,pocet_cviceni=pocet_cviceni)

        vyucujici_na_predmetu = VyucujiciPredmety(kod_predmetu=kod_predmetu, vyucujici_id=vyucuje_id)
        session.add(vyucujici_na_predmetu)
        session.add(predmet)
        session.commit()

        return ok
    except Exception as e:
        session.rollback()
        return internal_server_error

def smazat_predmet(session, kod_predmetu):
    try:
        predmet = session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first()
        if predmet is None:
            return not_found
        session.delete(predmet)
        session.commit()
        return ok
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error occurred: {e}")
        return internal_server_error

def upravit_predmet(session, kod_predmetu, newZkratkaPredmetu=None, newKatedra=None, newPocetCviceni=None):
    try:
        predmet = session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first()
        if predmet is None:
            return not_found
        
        predmet.zkratka_predmetu = newZkratkaPredmetu
        predmet.katedra = newKatedra
        predmet.pocet_cviceni = newPocetCviceni
        predmet.kod_predmetu = f"{newKatedra}/{newZkratkaPredmetu}"

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error

def pridej_vyucujiciho_na_predmet(session, kod_predmetu, vyucujici_id):
    try:
        vyucujici_na_predmetu = VyucujiciPredmety(kod_predmetu=kod_predmetu, vyucujici_id=vyucujici_id)
        session.add(vyucujici_na_predmetu)
        session.commit()
        return ok
    except:
        session.rollback()
        return internal_server_error


### TERMINY
def vypsat_termin(session, ucebna: Text, datum_start: datetime, datum_konec: datetime, max_kapacita: int, vypsal_id: Text, vyucuje_id: Text, kod_predmet: Text, jmeno: Text, cislo_cviceni: int,popis: Text, aktualni_kapacita=0):
    try:
        vyucujici = session.query(Vyucujici).filter_by(id=vyucuje_id).first()
        if vyucujici is None:
            return not_found

        termin = Termin(id=uuid.uuid4(),ucebna=ucebna,datum_start=datum_start,datum_konec=datum_konec,aktualni_kapacita=aktualni_kapacita,max_kapacita=max_kapacita,vypsal_id=vypsal_id,vyucuje_id=vyucuje_id,kod_predmet=kod_predmet,jmeno=jmeno,cislo_cviceni=cislo_cviceni, popis=popis)

        session.add(termin)

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def historie_studenta(session, id):
    try:
        student = session.query(Student).filter_by(id=id).first()

        if student is None:
            return not_found

        termins = []
        for history in student.historie_terminu:
            termin = history.termin
            termins.append(termin)

        return termins

    except:
        return internal_server_error


def uspesne_zakonceni_studenta_terminy(session, id_studenta, kod_predmetu):
    """ Vrátí všechny úspěsné zakončené termíny (HistorieTerminu) v předmětu """
    try:
        uspesne_terminy = session.query(HistorieTerminu).join(Termin, HistorieTerminu.termin_id == Termin.id).filter(and_(HistorieTerminu.student_id == id_studenta,Termin.kod_predmet == kod_predmetu,HistorieTerminu.datum_splneni != None)).all()
        uspesne_terminy_list = [student for student in uspesne_terminy]
        return uspesne_terminy_list

    except:
        return False


def uspesne_dokoncene_terminy(session, id):
    try:
        student = session.query(Student).filter_by(id=id).first()

        if student is None:
            return not_found

        splnene_terminy = []
        for history in student.historie_terminu:
            termin = history.termin

            if termin.cislo_cviceni == -1:
                splnene_terminy.append(termin)

            elif history.datum_splneni is not None:
                splnene_terminy.append(termin)

        return splnene_terminy

    except:
        return internal_server_error


def pocet_cviceni_pro_predmet(session):
    try:
        predmety = session.query(Predmet).all()
        predmet_pocet_cviceni = {}

        if not predmety:
            return {}

        for predmet in predmety:
            nazev = predmet.kod_predmetu
            pocet_cviceni = predmet.pocet_cviceni
            if pocet_cviceni:
                predmet_pocet_cviceni[nazev] = [0] * pocet_cviceni
            else:
                predmet_pocet_cviceni[nazev] = []

        return predmet_pocet_cviceni

    except:
        return internal_server_error


# zde nesmi prichazet parametr katedra - musi si to brat z "Uspesne zakonceni studenta"
def vyhodnoceni_studenta(session, id_studenta, pocet_pro_predmet):
    try:
        for kod_predmetu in list(pocet_pro_predmet.keys()):
            uspesne_terminy = uspesne_zakonceni_studenta_terminy(session, id_studenta, kod_predmetu)

            if uspesne_terminy:
                for historie_terminu in uspesne_terminy:
                    termin = session.query(Termin).filter(Termin.id == historie_terminu.termin_id).first()
                    if termin:
                        if get_uznani_predmetu_by_student(session, id_studenta, termin.kod_predmet):
                            for i in range(len(pocet_pro_predmet[kod_predmetu])):
                                pocet_pro_predmet[kod_predmetu][i] = historie_terminu.datum_splneni if historie_terminu.datum_splneni else datetime.now()
                        else:
                            cislo_cviceni = termin.cislo_cviceni - 1
                            pocet_pro_predmet[kod_predmetu][cislo_cviceni] = historie_terminu.datum_splneni
        return pocet_pro_predmet
    except:
        return internal_server_error

def vypis_uspesnych_studentu(session, kod_predmetu):
    try:

        studenti = (
            session.query(Student)
            .join(HistorieTerminu, HistorieTerminu.student_id == Student.id)  # Join HistorieTerminu with Student
            .join(Termin, HistorieTerminu.termin_id == Termin.id)             # Join HistorieTerminu with Termin
            .filter(Termin.kod_predmet == kod_predmetu)                       # Filter by the given kod_predmetu
            .all()  # Return all matching students
        )

        pocet_pro_predmet = {kod_predmetu: pocet_cviceni_pro_predmet(session)[kod_predmetu]} #type:ignore

        vyhodnoceni_studentu = {}
        for student in studenti:
            if get_uznani_predmetu_by_student(session, student.id, kod_predmetu):
                vyhodnoceni_studentu[student.id] = 1
            else:
                vyhodnoceni = vyhodnoceni_studenta(session, student.id, pocet_pro_predmet)
                if 0 in vyhodnoceni[kod_predmetu]: #type:ignore
                    continue
                else:
                    vyhodnoceni_studentu[student.id] = vyhodnoceni

        return vyhodnoceni_studentu

    except:
        return internal_server_error


def get_uznani_predmetu_by_student(session, id_studenta, kod_predmetu):
    """ Vrátí, zda má student předmět celý uznán """
    try:
        result = (
        session.query(Termin)
        .join(HistorieTerminu, HistorieTerminu.termin_id == Termin.id)
        .join(Student, Student.id == HistorieTerminu.student_id)
        .filter(
            Termin.cislo_cviceni == -1,    # Check if it's the specific exercise (-1)
            Student.id == id_studenta,     # Match the student ID
            Termin.kod_predmet == kod_predmetu  # Match the subject code
        )
        .first()  # Use first() to return one result or None
    )

        return result is not None
    except:
        return internal_server_error




def get_predmety_by_vyucujici(session, id_vyucujiciho: str):
    """ Vrátí všechny předměty, které daný vyučíjící učí """
    try:
        vsechny_predmety = []
        predmety = session.query(Predmet).join(VyucujiciPredmety, Predmet.kod_predmetu == VyucujiciPredmety.kod_predmetu).filter(VyucujiciPredmety.vyucujici_id == id_vyucujiciho).all()
        for zaznam in predmety:
            vsechny_predmety.append(zaznam)
        if vsechny_predmety:
            return vsechny_predmety
        else:
            return []
    except:
        return internal_server_error



# psaní toho __all__ není moc fun

__all__ = ["session", "vytvor_student", "vytvor_vyucujici", "upravit_termin", "odepsat_z_terminu", "zapsat_se_na_termin", "smazat_termin", "uznat_termin", "neuznat_termin", "pridat_studenta", "vytvor_predmet", "smazat_predmet", "upravit_predmet", "pridej_vyucujiciho_na_predmet", "vypsat_termin", "historie_studenta", "uspesne_zakonceni_studenta_terminy", "uspesne_dokoncene_terminy", "pocet_cviceni_pro_predmet", "vyhodnoceni_studenta", "vypis_uspesnych_studentu", "get_uznani_predmetu_by_student", "get_predmety_by_vyucujici"]
