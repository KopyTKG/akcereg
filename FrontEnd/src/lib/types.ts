import React from 'react'

export interface tTermin {
 _id: string
 ucebna: string
 start: number
 konec: number
 nazev: string
 tema: string
 cviceni: number
 kapacita: number
 zapsany?: number
 vypsal?: string[]
 owned?: boolean
 nCviceni?: number
 kod?: string
}

export interface tSelected {
 s: string | undefined
}

export interface tNode extends tTermin {
 typ: string
}

export interface tCreate extends tTermin {
 upzornit: boolean
 vyucuje?: string
 jmeno: string
 prijmeni: string
}

export interface tLink {
 label: string
 href: string
 icon: React.ReactNode
}

export interface tPredmetSekce {
 nazev: string
 cviceni: number[]
}

export interface tPredmet {
 _id: string
 nazev: string
 nCviceni: number
}

export interface tUser {
 id: string
 role: string[]
 hash: string
}

export interface tStudent {
 osCislo: string
 jmeno: string
 prijmeni: string
 email: string
 datum_splneni?: string | undefined
}

export interface tForm {
 _id: string
 cviceni: string
 nazev: string
 tema: string
 ucebna: string
 kapacita: number
 startDatum: Date
 startCas: string
 konecDatum: Date
 konecCas: string
 upozornit: boolean
 vJmeno: string
 vPrijmeni: string
}

export interface tPredmetBody {
 kod: string
 zkratka: string
 katedra: string
 cviceni: number
}

export interface tStagUserInfo {
 ucitIdno: string
 osCislo: string
 jmeno: string
 prijmeni: string
 email: string
 role: string[]
}

export interface tUserRes {
 stagUserInfo: tStagUserInfo[]
}
