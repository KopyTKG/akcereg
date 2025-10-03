import { isAdmin } from '@/lib/functions'
import { Forbidden, Internal, NotFound, Success, Unauthorized } from '@/lib/http'
import { getStudentsForCourse, getUserInfo } from '@/lib/stag'
import { fastHeaders, validateTicket } from '@/lib/auth'
import { tPredmetBody, tStudentInfo } from '@/lib/types'
import { prisma } from '@/prisma'
import crypto from 'crypto'

/* ----------------------------------------------------------------------------------------------- */
// Create
export async function POST(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const rBody: tPredmetBody = await req.json()
 if (!rBody) return NotFound()

 const course = await prisma.predmet.findUnique({
  where: {
   kod_predmetu: `${rBody.katedra}/${rBody.zkratka}`,
  },
 })
 if (course) return Success() // If course already exists, return success

 await prisma.predmet.create({
  data: {
   kod_predmetu: `${rBody.katedra}/${rBody.zkratka}`,
   zkratka_predmetu: rBody.zkratka,
   katedra: rBody.katedra,
   pocet_cviceni: rBody.cviceni,
   termin: {
    create: [
     {
      id: crypto.randomUUID(),
      ucebna: 'Nespecifikováno',
      datum_start: new Date('1970-01-01T00:00:00Z'),
      datum_konec: new Date('1970-01-01T00:00:00Z'),
      max_kapacita: 1,
      vypsal_id: info.hash || 'unknown',
      vyucuje_id: info.hash || 'unknown',
      jmeno: 'Uznávací termín',
      popis: 'Cvičení pro uznání předmětu',
     },
    ],
   },
   vyucujici_predmety: {
    create: [
     {
      vyucujici_id: info.hash || 'unknown',
     },
    ],
   },
  },
 })

 const data: tStudentInfo[] | null = await getStudentsForCourse(
  rTicket,
  rBody.zkratka,
  rBody.katedra,
 )
 if (!data) return Internal()

 for (const student of data) {
  const user = prisma.student.findUnique({
   where: { id: student.encOsCislo },
  })
  if (!user) {
   await prisma.student.create({
    data: { id: student.encOsCislo, datum_vytvoreni: new Date() },
   })
  }
 }

 if (!data) return Internal()
 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Update
export async function PATCH(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 const rBody: tPredmetBody = await req.json()
 if (!rBody) return NotFound()

 await prisma.predmet.update({
  where: {
   kod_predmetu: rKod_predmetu,
  },
  data: {
   kod_predmetu: rBody.kod,
   zkratka_predmetu: rBody.zkratka,
   katedra: rBody.katedra,
   pocet_cviceni: rBody.cviceni,
  },
 })

 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Delete
export async function DELETE(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 await prisma.predmet.delete({
  where: {
   kod_predmetu: rKod_predmetu,
  },
 })

 const course = await prisma.predmet.findUnique({
  where: {
   kod_predmetu: rKod_predmetu,
  },
 })
 if (course) return Internal() // If course still exists, return error
 return Success()
}
