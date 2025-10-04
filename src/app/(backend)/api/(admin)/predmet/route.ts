import { isAdmin } from '@/lib/functions'
import { Forbidden, Internal, NotFound, Success, Unauthorized } from '@/lib/http'
import { encodeId, getPredmetInfo, getStudentsForCourse, getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'
import { tPredmetPostBody } from '@/types/next_response_types'

/* ----------------------------------------------------------------------------------------------- */
// Create
export async function POST(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const rBody: tPredmetPostBody = await req.json()
 if (!rBody) return NotFound()

 const course = await prisma.predmet.findUnique({
  where: {
   kod_predmetu: `${rBody.katedra}/${rBody.zkratka}`,
  },
 })
 if (course) return Success() // If course already exists, return success

 const valid = await getPredmetInfo(rTicket, rBody.zkratka, rBody.katedra)
 if (!valid) return NotFound()

 // Create new course
 await prisma.predmet.create({
  data: {
   kod_predmetu: `${rBody.katedra}/${rBody.zkratka}`,
   zkratka_predmetu: rBody.zkratka,
   katedra: rBody.katedra,
   pocet_cviceni: rBody.cviceni,
  },
 })
 // Verify creation
 const data = await prisma.predmet.findUnique({
  where: {
   kod_predmetu: `${rBody.katedra}/${rBody.zkratka}`,
  },
 })
 if (!data) return Internal()

 // Create links between course and teachers
 const teachers = await prisma.role.findMany({
  where: {
   role: 'KA',
  },
 })
 for (const teacher of teachers) {
  await prisma.predmet_role.create({
   data: {
    role: { connect: { id: teacher.id } },
    predmet: { connect: { kod_predmetu: data.kod_predmetu } },
   },
  })
 }

 const stagStudents = await getStudentsForCourse(rTicket, rBody.zkratka, rBody.katedra)
 if (stagStudents) {
  for (const stagStudent of stagStudents.studentPredmetu) {
   const encId = encodeId(stagStudent.osCislo)
   let student = await prisma.student.findUnique({
    where: { id: encId },
   })
   if (!student) {
    student = await prisma.student.create({
     data: {
      id: encId,
      datum_vytvoreni: new Date(),
     },
    })
   }
  }
 }
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

 const rBody: tPredmetPostBody = await req.json()
 if (!rBody) return NotFound()

 await prisma.predmet.update({
  where: {
   kod_predmetu: rKod_predmetu,
  },
  data: {
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
