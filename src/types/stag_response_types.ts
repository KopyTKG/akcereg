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

/*
 * getPredmetInfo
 */

export type tGetPredmetInfo = {
 katedra: string
 zkratka: string
 rok: string
 nazev: string
 nazevDlouhy: string
 maVyuku: string
 vyukaZS: string
 vyukaLS: string
 jakCastoJeNabizen: string
 jakCastoJeNabizenUpresneni: string | null
 kreditu: number
 viceZapis: string
 minObsazeni: number
 garanti: string
 garantiSPodily: string
 garantiUcitIdno: string
 prednasejici: string
 prednasejiciSPodily: string
 prednasejiciUcitIdno: string
 cvicici: string
 cviciciSPodily: string
 cviciciUcitIdno: string
 seminarici: string
 seminariciSPodily: string
 seminariciUcitIdno: string
 schvalujiciUznani: string
 schvalujiciUznaniUcitIdno: string
 examinatori: string
 examinatoriUcitIdno: string
 podminujiciPredmety: string
 vylucujiciPredmety: string
 podminujePredmety: string
 literatura: string
 nahrazPredmety: string
 metodyVyucovaci: string
 metodyHodnotici: string
 akreditovan: string
 jednotekPrednasek: number
 jednotkaPrednasky: string
 jednotekCviceni: number
 jednotkaCviceni: string
 jednotekSeminare: number
 jednotkaSeminare: string
 anotace: string
 typZkousky: string
 maZapocetPredZk: string
 formaZkousky: string | null
 pozadavky: string
 prehledLatky: string
 predpoklady: string
 ziskaneZpusobilosti: string
 casovaNarocnost: string
 predmetUrl: string | null
 vyucovaciJazyky: string
 poznamka: string
 ectsZobrazit: string
 ectsAkreditace: string
 ectsNabizetUPrijezdu: string
 poznamkaVerejna: string | null
 skupinaAkreditace: string
 skupinaAkreditaceKey: string
 zarazenDoPrezencnihoStudia: string
 zarazenDoKombinovanehoStudia: string
 studijniOpory: string
 praxePocetDnu: number
 urovenNastavena: string | null
 urovenVypoctena: string
 automatickyUznavatZppZk: string
 hodZaSemKombForma: string | null
}

/*
 * getStudentInfo
 */

export type tGetStudentInfo = {
 osCislo: string
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
}
