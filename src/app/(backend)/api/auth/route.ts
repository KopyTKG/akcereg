/*
 * Login route
 * -- Called only by middleware
 */

import { Internal, Success, Unauthorized } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { validateSoftTicket } from '@/lib/auth'
import { prisma } from '@/prisma'
import { tGetStagUserListForLoginTicketV2, tStagUserInfo } from '@/types/stag_response_types'
import crypto from 'crypto'

export async function GET(req: Request) {
 const rTicket = validateSoftTicket(req)
 if (!rTicket) return Unauthorized()

 const data = (await getUserInfo(rTicket)) as tGetStagUserListForLoginTicketV2 | null

 if (!data) {
  return Internal()
 } else {
  for (let user of data.stagUserInfo) {
   user = user as tStagUserInfo
   // Student
   if (user.role === 'ST') {
    const student = await prisma.student.findUnique({
     where: { id: user.encId || '' },
    })
    if (!student) {
     await prisma.student.create({
      data: {
       id: user.encId || '',
       datum_vytvoreni: new Date(),
      },
     })
    }
   }
   // Teacher
   else {
    const vyucujici = await prisma.vyucujici.findFirst({
     where: {
      jmeno: data.jmeno,
      prijmeni: data.prijmeni,
      titulPred: data.titulPred || '',
      titulZa: data.titulZa || '',
      email: data.email,
     },
    })
    let role = null
    if (vyucujici) {
     role = await prisma.role.findFirst({
      where: {
       vyucujici_id: vyucujici.id,
       role: user.role,
       fakulta: user.fakulta,
       katedra: user.katedra,
       ucitIdno: user.ucitIdno ? String(user.ucitIdno) : '',
       email: user.email,
      },
     })
     data.dbId = vyucujici.id
    }

    if (!role && vyucujici) {
     await prisma.role.create({
      data: {
       vyucujici_id: vyucujici.id,
       role: user.role,
       roleNazev: user.roleNazev,
       fakulta: user.fakulta,
       katedra: user.katedra,
       ucitIdno: user.ucitIdno ? String(user.ucitIdno) : '',
       email: user.email,
      },
     })
    } else if (!vyucujici) {
     await prisma.vyucujici.create({
      data: {
       jmeno: data.jmeno,
       prijmeni: data.prijmeni,
       titulPred: data.titulPred || '',
       titulZa: data.titulZa || '',
       email: data.email,
      },
     })
    }
   }
  }
 }
 return Success(data)
}
