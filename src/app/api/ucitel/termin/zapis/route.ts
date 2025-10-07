import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Forbidden } from '@/lib/http'
import { encodeId, getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'
// Create
export async function POST(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rId_terminu = base.searchParams.get('id_terminu') || ''

 if (!rId_stud || !rId_terminu) return NotFound()

 const encId = encodeId(rId_stud)

 const student = await prisma.student.findUnique({
  where: { id: encId },
 })
 if (!student) return NotFound()

 const termin = await prisma.termin.findUnique({
  where: { id: rId_terminu },
 })
 if (!termin) return NotFound()

 let historie = await prisma.historie_terminu.findFirst({
  where: {
   student_id: encId,
   termin_id: rId_terminu,
  },
 })

 if (historie) return Forbidden()

 historie = await prisma.historie_terminu.findFirst({
  where: {
   student_id: encId,
   termin: { cislo_cviceni: -1 },
  },
 })
 if (historie) return Forbidden()

 await prisma.historie_terminu.create({
  data: {
   student: { connect: { id: encId } },
   termin: { connect: { id: rId_terminu } },
  },
 })

 await prisma.termin.update({
  where: { id: rId_terminu },
  data: {
   aktualni_kapacita: { increment: 1 },
  },
 })

 return Success()
}
