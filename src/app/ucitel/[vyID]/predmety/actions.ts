'use server'

import { prisma } from '@/prisma'
import { ActionResponse } from '../termin/[terminID]/actions'
import { tPredmet } from '@/types/next_response_types'

export async function getCompletedEmails(predmet: string): Promise<ActionResponse> {
 try {
  return { success: true, data: [] } as ActionResponse
 } catch (e) {
  return {
   success: false,
   message: 'Chyba při zpracování požadavku',
   error: e instanceof Error ? e.message : String(e),
  } as ActionResponse
 }
}

export async function deletePredmet(predmet: string): Promise<ActionResponse> {
 try {
  await prisma.predmet.delete({
   where: { kod_predmetu: predmet },
  })

  const check = await prisma.predmet.findUnique({
   where: { kod_predmetu: predmet },
  })

  if (check) {
   return { success: false, message: 'Předmět se nepodařilo smazat' } as ActionResponse
  }

  return { success: true } as ActionResponse
 } catch (e) {
  return {
   success: false,
   message: 'Chyba při zpracování požadavku',
   error: e instanceof Error ? e.message : String(e),
  } as ActionResponse
 }
}

export async function patchPredmet(predmet: tPredmet): Promise<ActionResponse> {
 try {
  await prisma.predmet.update({
   where: { kod_predmetu: predmet.kod_predmetu || '' },
   data: {
    katedra: predmet.katedra,
    zkratka_predmetu: predmet.zkratka_predmetu,
    pocet_cviceni: predmet.pocet_cviceni,
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

export async function postPredmet(predmet: tPredmet): Promise<ActionResponse> {
 try {
  await prisma.predmet.create({
   data: {
    kod_predmetu: predmet.kod_predmetu || '',
    katedra: predmet.katedra,
    zkratka_predmetu: predmet.zkratka_predmetu,
    pocet_cviceni: predmet.pocet_cviceni,
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
