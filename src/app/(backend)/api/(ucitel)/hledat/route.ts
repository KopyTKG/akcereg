import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { encodeId, getRovrhByStudent, getStudentInfo, getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'
import { tPredmetSekce } from '@/lib/types'
import crypto from 'crypto'

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

 const rozvrh = await getRovrhByStudent(rTicket, rId_stud)

 if (!rozvrh) return Internal()

 const predmety = await prisma.predmet_student.findMany({
  where: { student_id: encId },
  select: { predmet: { select: { kod_predmetu: true, pocet_cviceni: true } } },
 })

 if (predmety.length === 0) return Success({ info: student, data: [] })

 const response = [] as tPredmetSekce[]

 predmety.forEach((p) => {
  response.push({
   nazev: p.predmet.kod_predmetu,
   cviceni: [...Array(p.predmet.pocet_cviceni)].map((_, i) => i + 1).map(() => 0),
  })
 })

 const terminy = await prisma.historie_terminu.findMany({
  select: {
   datum_splneni: true,
   termin: { select: { kod_predmet: true, cislo_cviceni: true } },
  },
  where: { student_id: encId, datum_splneni: { not: null }, termin: { cislo_cviceni: -1 } },
  orderBy: { datum_splneni: 'desc' },
 })

 if (terminy.length > 0) {
  for (const termin of terminy) {
   const predmet = response.find((p) => p.nazev === termin.termin.kod_predmet)
   if (predmet) {
    for (let i = 0; i < predmet.cviceni.length; i++) {
     predmet.cviceni[i] = -1
    }
   }
  }
  return Success({ info: student, data: response })
 } else {
  terminy.forEach((t) => {
   const predmet = response.find((p) => p.nazev === t.termin.kod_predmet)
   if (predmet && t.termin.cislo_cviceni) {
    const index = t.termin.cislo_cviceni - 1
    if (t.datum_splneni) predmet.cviceni[index] = new Date(t.datum_splneni).getTime()
   }
  })

  return Success({ info: student, data: response })
 }
}
