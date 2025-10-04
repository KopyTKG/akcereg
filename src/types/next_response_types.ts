import { tGetStudentInfo } from './stag_response_types'

/*
 * route -> $HOST/api/predmety
 */

export type tPredmet = {
 _id: string
 nazev: string
 nCviceni: number
}

export type tPredmetyResponse = {
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

export type tHledatStudenta = {
 student: tGetStudentInfo
}
