'use server'

import { prisma } from '@/prisma'
import { ActionResponse } from '../termin/[terminID]/actions'
import { encodeId } from '@/lib/stag'

export async function markAsCompletedCourse(
 osCislo: string,
 predmet: string,
): Promise<ActionResponse> {
 try {
  const student = await prisma.student.findUnique({
   where: { id: encodeId(osCislo) },
  })

  if (!student) return { success: false, message: 'Student nenalezen' } as ActionResponse

  const historie = await prisma.historie_terminu.findFirst({
   where: {
    student_id: encodeId(osCislo),
    termin: {
     kod_predmet: predmet,
     cislo_cviceni: -1,
    },
   },
   select: { datum_splneni: true, termin: { select: { cislo_cviceni: true, id: true } } },
  })
  if (historie) return { success: false, message: 'Student již předmět splnil' } as ActionResponse

  const uznTermin = await prisma.termin.findFirst({
   where: { kod_predmet: predmet, cislo_cviceni: -1 },
  })

  if (!uznTermin) return { success: false, message: 'Termín nenalezen' } as ActionResponse

  await prisma.historie_terminu.create({
   data: {
    student: { connect: { id: encodeId(osCislo) } },
    termin: { connect: { id: uznTermin.id } },
    datum_splneni: new Date(),
   },
  })

  return { success: true } as ActionResponse
 } catch (e) {
  return {
   success: false,
   message: 'Chyba při zpracování požadavku',
   error: e instanceof Error ? e.message : String(e),
  } as ActionResponse
 }
}
