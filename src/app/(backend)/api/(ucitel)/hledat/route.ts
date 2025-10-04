import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { encodeId, getStudentInfo, getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''

 if (!rId_stud) return NotFound()

 const student = await getStudentInfo(rTicket, rId_stud)

 if (!student) return NotFound()

 const encId = encodeId(rId_stud)

 const terminy = await prisma.historie_terminu.findMany({
  select: {
   datum_splneni: true,
   termin: { select: { kod_predmet: true, cislo_cviceni: true } },
  },
  where: { student_id: encId, datum_splneni: { not: null } },
  orderBy: { datum_splneni: 'desc' },
 })

 console.log(terminy)

 return Success({ info: student, data: terminy })
}
