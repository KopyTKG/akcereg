/*
 * route -> $HOST/api/predmety
 */

import { info } from 'console'

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
