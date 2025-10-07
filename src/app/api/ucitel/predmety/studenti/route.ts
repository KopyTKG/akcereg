import { validateTicket } from '@/lib/auth'
import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Forbidden } from '@/lib/http'
import { encodeId, getStudentiByPredmet, getUserInfo } from '@/lib/stag'
import { prisma } from '@/prisma'
import { tStudentPredmetu } from '@/types/stag_response_types'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod = base.searchParams.get('kod_predmetu') || ''
 if (!rKod) return NotFound()

 const studentiPredmetu = await getStudentiByPredmet(
  rTicket,
  rKod.split('/')[1],
  rKod.split('/')[0],
 )

 if (!studentiPredmetu) return NotFound()
 const dbStudents = await prisma.historie_terminu.findMany({
  where: {
   termin: { predmet: { kod_predmetu: rKod } },
   datum_splneni: { not: null },
  },
 })

 if (!dbStudents) return NotFound()

 const resultStudents: tStudentPredmetu[] = []

 for (const s of studentiPredmetu.studentPredmetu) {
  const dbStudent = dbStudents.find((ds) => ds.student_id === encodeId(s.osCislo))
  if (dbStudent) {
   resultStudents.push(s)
  }
 }

 return Success({ kod: rKod, studenti: resultStudents })
}
