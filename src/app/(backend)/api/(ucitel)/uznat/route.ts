import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Forbidden } from '@/lib/http'
import { getUserInfo, encodeId } from '@/lib/stag'
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
 const rKod_predmetu = decodeURI(base.searchParams.get('kod_predmetu') || '')

 if (!rId_stud || !rKod_predmetu) return NotFound()

 const termin = await prisma.historie_terminu.findFirst({
  where: {
   termin: { kod_predmet: rKod_predmetu, cislo_cviceni: -1 },
   student_id: rId_stud,
   datum_splneni: { not: null },
  },
  select: { datum_splneni: true, termin: { select: { cislo_cviceni: true, id: true } } },
 })
 if (!termin) {
  const uznTermin = await prisma.termin.findFirst({
   where: { kod_predmet: rKod_predmetu, cislo_cviceni: -1 },
  })

  if (!uznTermin) return NotFound()
  await prisma.historie_terminu.create({
   data: {
    student: { connect: { id: encodeId(rId_stud) } },
    termin: { connect: { id: uznTermin.id } },
    datum_splneni: new Date(),
   },
  })
 }

 return Success()
}
