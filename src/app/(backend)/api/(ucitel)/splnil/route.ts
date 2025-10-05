import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { validateTicket, fastHeaders } from '@/lib/auth'
import { encodeId, getUserInfo } from '@/lib/stag'
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

 const historie = await prisma.historie_terminu.findFirst({
  where: {
   student_id: encId,
   termin_id: rId_terminu,
  },
 })

 if (!historie) return NotFound()

 await prisma.historie_terminu.update({
  where: {
   id: historie.id,
  },
  data: {
   datum_splneni: new Date(),
  },
 })

 return Success()
}

// Delete
export async function DELETE(req: Request) {
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

 const historie = await prisma.historie_terminu.findFirst({
  where: {
   student_id: encId,
   termin_id: rId_terminu,
  },
 })

 if (!historie) return NotFound()

 await prisma.historie_terminu.update({
  where: {
   id: historie.id,
  },
  data: {
   datum_splneni: null,
  },
 })

 return Success()
}
