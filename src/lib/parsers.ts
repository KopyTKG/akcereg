import { tTermin } from '@/lib/types'

export function resTotTermin(data: any): tTermin[] {
 const terminy: tTermin[] = []
 data.forEach((item: any) => {
  const predmet = item?.predmet_terminu
  let cv = 0
  if (predmet) cv = predmet?.pocet_cviceni
  const tmp: tTermin = {
   _id: item.id,
   ucebna: item.ucebna,
   start: new Date(item.datum_start).valueOf(),
   konec: new Date(item.datum_konec).valueOf(),
   nazev: item.jmeno,
   cviceni: item.cislo_cviceni,
   kapacita: item.max_kapacita,
   zapsany: item.aktualni_kapacita,
   vypsal: item.vyucujici,
   tema: item.popis,
   nCviceni: cv,
   kod: item.kod_predmet,
  }
  terminy.push(tmp)
 })
 return terminy
}
