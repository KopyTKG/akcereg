'use server'

import { encodeId } from '@/lib/stag'
import { prisma } from '@/prisma'

export type ActionResponse = {
 success: boolean
 message?: string
 error?: string
 data?: any
}

export async function markAsCompleted(osCislo: string, termin: string): Promise<ActionResponse> {
 try {
  const student = await prisma.student.findUnique({
   where: { id: encodeId(osCislo) },
  })

  if (!student) return { success: false, message: 'Student nenalezen' } as ActionResponse

  const historie = await prisma.historie_terminu.findFirst({
   where: {
    student_id: encodeId(osCislo),
    termin_id: termin,
   },
  })

  if (!historie) return { success: false, message: 'Student neni na termínu' } as ActionResponse

  await prisma.historie_terminu.update({
   where: {
    id: historie.id,
   },
   data: {
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

export async function removeCompletion(osCislo: string, termin: string): Promise<ActionResponse> {
 try {
  const student = await prisma.student.findUnique({
   where: { id: encodeId(osCislo) },
  })

  if (!student) return { success: false, message: 'Student nenalezen' } as ActionResponse

  const historie = await prisma.historie_terminu.findFirst({
   where: {
    student_id: encodeId(osCislo),
    termin_id: termin,
   },
  })

  if (!historie) return { success: false, message: 'Student neni na termínu' } as ActionResponse

  await prisma.historie_terminu.update({
   where: {
    id: historie.id,
   },
   data: {
    datum_splneni: null,
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

export async function deleteTermin(terminID: string): Promise<ActionResponse> {
 try {
  await prisma.termin.delete({
   where: { id: terminID },
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

export async function addStudentToTermin(
 osCislo: string,
 terminID: string,
): Promise<ActionResponse> {
 try {
  const student = await prisma.student.findUnique({
   where: { id: encodeId(osCislo) },
  })

  if (!student) return { success: false, message: 'Student nenalezen' } as ActionResponse

  const termin = await prisma.termin.findUnique({
   where: { id: terminID },
  })

  if (!termin) return { success: false, message: 'Termín nenalezen' } as ActionResponse

  let historie = await prisma.historie_terminu.findFirst({
   where: {
    student_id: encodeId(osCislo),
    termin_id: terminID,
   },
  })

  if (historie) return { success: false, message: 'Student je již na termínu' } as ActionResponse

  historie = await prisma.historie_terminu.findFirst({
   where: {
    student_id: encodeId(osCislo),
    termin: { cislo_cviceni: -1 },
   },
  })
  if (historie) return { success: false, message: 'Student má splněno' } as ActionResponse

  await prisma.historie_terminu.create({
   data: {
    student: { connect: { id: encodeId(osCislo) } },
    termin: { connect: { id: terminID } },
   },
  })

  await prisma.termin.update({
   where: { id: terminID },
   data: {
    aktualni_kapacita: { increment: 1 },
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
