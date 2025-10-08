import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { encodeId, getStudentiByPredmet, getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { tCreate } from '@/lib/types'
import { tGetStudentiByPredmet, tStudentPredmetu } from '@/types/stag_response_types'
import { tStudentPredmetuNaTerminu } from '@/types/next_response_types'
import { prisma } from '@/prisma'
import crypto from 'crypto'

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

 const kod = body._id
 if (!kod) return NotFound()

 const katedra = kod.split('/')[0] || ''
 const zkratka = kod.split('/')[1] || ''
 if (!katedra || !zkratka) return NotFound()

 const data: tGetStudentiByPredmet | null = await getStudentiByPredmet(rTicket, zkratka, katedra)
 if (!data) return NotFound()

 const mails: string[] = []
 for (const student of data.studentPredmetu) {
  if (student.email && student.email.includes('@')) {
   mails.push(student.email)
  }
 }
 const id: string = crypto.randomUUID()

 const teacher = await prisma.role.findFirst({
  where: { ucitIdno: `${info.stagUserInfo[0].ucitIdno}` },
  select: {
   vyucujici: {
    select: { id: true },
   },
  },
 })

 if (!teacher || !teacher.vyucujici) return Internal()

 await prisma.termin.create({
  data: {
   id: id,
   ucebna: body.ucebna,
   datum_start: new Date(body.start),
   datum_konec: new Date(body.konec),
   max_kapacita: body.kapacita,
   aktualni_kapacita: 0,
   jmeno: body.nazev,
   cislo_cviceni: body.cviceni,
   popis: body.tema,
   predmet: {
    connect: { kod_predmetu: kod },
   },
   vypsal: {
    connect: { id: teacher.vyucujici.id },
   },
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

type tHistorieWithStudent = {
 id: string
 student_id: string
 termin_id: string
 datum_splneni: Date | null
 student: {
  id: string
  datum_vytvoreni: Date
 }
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

 const body: tCreate = await req.json()
 if (!body) return NotFound()

 const termin = await prisma.termin.findUnique({
  where: { id: rID },
 })
 if (!termin) return NotFound()

 await prisma.termin.update({
  where: { id: rID },
  data: {
   ucebna: body.ucebna,
   datum_start: new Date(body.start),
   datum_konec: new Date(body.konec),
   max_kapacita: body.kapacita,
   jmeno: body.nazev,
   cislo_cviceni: body.cviceni,
   popis: body.tema,
  },
 })

 if (!body.upzornit) return Success()

 const studenti = await prisma.termin.findUnique({
  where: { id: rID },
  include: {
   historie_terminu: {
    include: { student: true },
   },
  },
 })

 if (!studenti) return Success()

 const studentData = await getStudentiByPredmet(
  rTicket,
  termin.kod_predmet.split('/')[1],
  termin.kod_predmet.split('/')[0],
 )
 if (!studentData) return Success()

 const resData: string[] = []
 for (let s of studenti.historie_terminu) {
  s = s as tHistorieWithStudent
  for (const sd of studentData.studentPredmetu) {
   if (s.id === encodeId(sd.osCislo) && sd.email && sd.email.includes('@')) {
    resData.push(sd.email)
    break
   }
  }
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

 await prisma.termin.delete({
  where: { id: rID },
 })

 const termin = await prisma.termin.findUnique({
  where: { id: rID },
 })

 if (termin) return Internal()

 return Success()
}
