import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'
import { tCreate, tStudent, tTermin } from '@/lib/types'

type tBody = {
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

/* ----------------------------------------------------------------------------------------------- */
// Create
export async function POST(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const body: tCreate = await req.json()
 if (!body) return NotFound()
 const fBody: tBody = {
  ucebna: body.ucebna,
  datum_start: new Date(body.start).toJSON(),
  datum_konec: new Date(body.konec).toJSON(),
  max_kapacita: body.kapacita,
  cislo_cviceni: body.cviceni,
  popis: body.tema,
  jmeno: body.nazev,
  kod_predmetu: body._id,
  upozornit: body.upzornit,
  vyucuje_prijmeni: body.prijmeni,
  vyucuje_jmeno: body.jmeno,
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
  body: JSON.stringify(fBody),
 })

 if (!res.ok) return Internal()

 const resData = await res.json()
 if (typeof resData === 'object' && typeof resData.message === 'string') {
  return Success()
 }
 return Success({ mails: resData })
}

/* ----------------------------------------------------------------------------------------------- */
// Read
export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const res = await fetch(url.toString(), {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) {
  if (res.status == 404) return NotFound()
  else return Internal()
 }

 let data = await res.json()

 const studenti: tStudent[] = data.studenti
 data = data.termin as tBody
 const termin: tTermin = {
  _id: data.kod_predmet,
  ucebna: data.ucebna,
  start: data.datum_start,
  konec: data.datum_konec,
  nazev: data.jmeno,
  cviceni: data.cislo_cviceni,
  zapsany: data.aktualni_kapacita,
  kapacita: data.max_kapacita,
  tema: data.popis,
 }
 return Success({ termin: termin, studenti: studenti })
}

/* ----------------------------------------------------------------------------------------------- */
// Update
export async function PATCH(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const body: tCreate = await req.json()
 if (!body) return NotFound()

 const fBody: tBody = {
  ucebna: body.ucebna,
  datum_start: new Date(body.start).toJSON(),
  datum_konec: new Date(body.konec).toJSON(),
  max_kapacita: body.kapacita,
  cislo_cviceni: body.cviceni,
  popis: body.tema,
  jmeno: body.nazev,
  kod_predmetu: body._id,
  upozornit: body.upzornit,
  vyucuje_prijmeni: body.prijmeni,
  vyucuje_jmeno: body.jmeno,
 }

 const res = await fetch(url.toString(), {
  method: 'PATCH',
  headers: fastHeaders,
  body: JSON.stringify(fBody),
 })

 if (!res.ok) return Internal()

 const resData = await res.json()
 if (typeof resData === 'object' && typeof resData.message === 'string') {
  return Success()
 }

 return Success({ mails: resData })
}

/* ----------------------------------------------------------------------------------------------- */
// Delete
export async function DELETE(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const res = await fetch(url.toString(), {
  method: 'DELETE',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 return Success()
}
