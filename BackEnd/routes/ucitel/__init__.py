from .home import router as ucitel_home
from .moje import router as ucitel_moje
from .termin.termin_info import router as ucitel_termin_info
from .board_by_predmet import router as ucitel_board_by_predmet
from .termin.termin_vytvor import router as ucitel_termin_vytvor
from .termin.termin_zmena import router as ucitel_termin_zmena
from .termin.termin_smazat import router as ucitel_termin_smazat
from .student.studenti import router as ucitel_studenti
from .student.student_info import router as ucitel_student_info
from .student.student_splnit import router as ucitel_student_splnit
from .student.student_nesplnit import router as ucitel_student_nesplnit
from .student.student_uznat import router as ucitel_student_uznat
from .student.student_zapsat import router as ucitel_student_zapsat
from .emaily import router as ucitel_emaily
from .student.uspesni_studenti import router as ucitel_uspesni_studenti
from .reset_ucitel import router as ucitel_reset

ucitel_routers = [
    ucitel_home,
    ucitel_moje,
    ucitel_termin_info,
    ucitel_board_by_predmet,
    ucitel_termin_vytvor,
    ucitel_termin_zmena,
    ucitel_termin_smazat,
    ucitel_studenti,
    ucitel_student_info,
    ucitel_student_splnit,
    ucitel_student_nesplnit,
    ucitel_student_uznat,
    ucitel_student_zapsat,
    ucitel_emaily,
    ucitel_uspesni_studenti,
    ucitel_reset
]
