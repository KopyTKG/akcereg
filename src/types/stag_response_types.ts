/*
 * getStudentiByPredmet
 * ---------------------
 * stag response types
 */
export type tGetStudentiByPredmet = {
 studentPredmetu: tstudentPredmetu[]
}

export type tstudentPredmetu = {
 osCislo: string
 encOsCislo: string | null
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 stav: string
 userName: string | null
 stprIdno: string
 nazevSp: string
 fakultaSp: string
 kodSp: string
 formaSp: string
 typSp: string
 typSpKey: string
 mistoVyuky: string
 rocnik: string
 financovani: string
 oborKomb: string
 oborIdnos: string
 email: string
 maxDobaDatum: string | null
 simsP58: string | null
 simsP59: string | null
 cisloKarty: string | null
 pohlavi: string
 rozvrhovyKrouzek: string | null
 studijniKruh: string
 evidovanBankovniUcet: string | null
 statutPredmetu: string
 casPrihlaseni: { value: string }
}

/*
 * getStagUserListForLoginTicketV2
 * --------------------------------
 * stag response types
 */

export type tGetStagUserListForLoginTicketV2 = {
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 email: string
 dbId: string | null
 stagUserInfo: tStagUserInfo[]
}

export type tStagUserInfo = {
 userName: string
 role: string
 roleNazev: string
 fakulta: string
 katedra: string
 ucitIdno: number | null
 osCislo: string | null
 encId: string | null
 email: string
}
