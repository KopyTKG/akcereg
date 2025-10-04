import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { getStudentsForCourse, getUserInfo } from '@/lib/stag'
import { fastHeaders, validateTicket } from '@/lib/auth'
import { tCreate, tStudent, tStudentInfo, tTermin } from '@/lib/types'
import { prisma } from '@/prisma'
import crypto from 'crypto'

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
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const body: tCreate = await req.json()
 if (!body) return NotFound()
 console.log(body)

 const kod = body._id
 if (!kod) return NotFound()

 const katedra = kod.split('/')[0] || ''
 const zkratka = kod.split('/')[1] || ''
 if (!katedra || !zkratka) return NotFound()

 const data: tStudentInfo[] | null = await getStudentsForCourse(rTicket, zkratka, katedra)
 if (!data) return NotFound()

 const mails: string[] = []
 for (const student of data) {
  if (student.email && student.email.includes('@')) {
   mails.push(student.email)
  }
 }
 const id: string = crypto.randomUUID()

 await prisma.termin.create({
  data: {
   id: id,
   ucebna: body.ucebna,
   datum_start: new Date(body.start),
   datum_konec: new Date(body.konec),
   max_kapacita: body.kapacita,
   aktualni_kapacita: 0,
   vypsal_id: info.hash || 'unknown',
   vyucuje_id: info.hash || 'unknown',
   jmeno: body.nazev,
   cislo_cviceni: body.cviceni,
   popis: body.tema,
   kod_predmet: kod,
  },
 })

 const t = await prisma.termin.findUnique({
  where: { id: id },
 })
 if (!t) return Internal()
 return Success({ mails: mails })
}

/* ----------------------------------------------------------------------------------------------- */
// Read
export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const data = await prisma.termin.findUnique({
  where: { id: rID },
  include: {
   historie_terminu: {
    include: { student: true },
   },
  },
 })
 if (!data) return NotFound()
 console.log(data) // <-- needs to be fixed
 return Success({ termin: {}, studenti: [] })
}

/* ----------------------------------------------------------------------------------------------- */
// Update
export async function PATCH(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/termin`)
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
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 if (!rID) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const res = await fetch(url.toString(), {
  method: 'DELETE',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 return Success()
}
