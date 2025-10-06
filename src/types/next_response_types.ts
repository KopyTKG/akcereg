import { string } from 'zod'
import { tGetStudentInfo, tstudentPredmetu } from './stag_response_types'

/*
 * route -> $HOST/api/predmety
 */

export type tPredmet = {
 kod_predmetu: string
 zkratka_predmetu: string
 katedra: string
 pocet_cviceni: number
}

export type tPredmetyBody = {
 predmety: tPredmet[]
}

/*
 * route -> $HOST/api/predmet
 */

export type tPredmetPostBody = {
 kod: string | null
 zkratka: string
 katedra: string
 cviceni: number
}

/*
 * route -> $HOST/api/hledat
 */

export type tPredmetHledat = {
 kod_predmetu: string
 cviceni: number[]
}

export type tHledatBody = {
 student: tGetStudentInfo
 predmety: tPredmetHledat[]
}

/*
 * route -> $HOST/api/termin
 */

export type tTerminPatchBody = {
 ucebna: string
 datum_start: string
 datum_konec: string
 max_kapacita: number
 kod_predmetu: string
 jmeno: string
 cislo_cviceni: number
 popis: string
 upozornit: boolean
 vyucuje_prijmeni: string
 vyucuje_jmeno: string
}

export interface tStudentPredmetuNaTeminu extends tstudentPredmetu {
 datum_splneni: Date | null
}

export type tTerminGetBody = {
 termin: tTermin
 studenti: tStudentPredmetuNaTeminu[]
}

/*
 * route -> $HOST/api/filtr
 */

export type tFiltrBody = {
 terminy: tTermin[]
}

export type tTermin = {
 id: string
 ucebna: string
 datum_start: Date
 datum_konec: Date
 aktualni_kapacita: number
 max_kapacita: number
 kod_predmet: string
 jmeno: string
 cislo_cviceni: number
 popis: string
 vypsal_id: string
 vypsal: {
  titulPred: string | null
  jmeno: string
  prijmeni: string
  titulZa: string | null
 }
 predmet: {
  pocet_cviceni: number
 }
 historie_terminu: {
  student_id: string
 } | null
}
