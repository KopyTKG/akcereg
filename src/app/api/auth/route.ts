/*
 * Login route
 * -- Called only by middleware
 */

import { Internal, Success, Unauthorized } from '@/lib/http'
import { getUserInfo, getRovrhByStudent } from '@/lib/stag'
import { validateSoftTicket } from '@/lib/auth'
import { prisma } from '@/prisma'
import { tGetStagUserListForLoginTicketV2, tStagUserInfo } from '@/types/stag_response_types'

export async function GET(req: Request) {
 console.log(req)

 const rTicket = validateSoftTicket(req)
 if (!rTicket) return Unauthorized()

 const data = (await getUserInfo(rTicket)) as tGetStagUserListForLoginTicketV2 | null

 if (!data) {
  return Internal()
 } else {
  for (let user of data.stagUserInfo) {
   user = user as tStagUserInfo
   if (!user.role || !user.encId) {
    return Internal()
   }
   // Student
   if (user.role === 'ST') {
    const student = await prisma.student.findUnique({
     where: { id: user.encId },
    })
    if (!student) {
     await prisma.student.create({
      data: {
       id: user.encId,
       datum_vytvoreni: new Date(),
      },
     })
    }

    // Check if student was created
    const exists = await prisma.student.findUnique({
     where: { id: user.encId },
    })
    if (!exists) {
     return Internal()
    }

    const rozvrh = await getRovrhByStudent(rTicket, user.osCislo ? String(user.osCislo) : '')

    if (rozvrh) {
     for (const predmet of rozvrh.rozvrhovaAkce) {
      const predmetId = `${predmet.katedra}/${predmet.predmet}`
      const predmetExists = await prisma.predmet.findUnique({
       where: { kod_predmetu: predmetId },
      })
      if (predmetExists) {
       const linkExists = await prisma.predmet_student.findFirst({
        where: {
         student_id: user.encId,
         kod_predmetu: predmetExists.kod_predmetu,
        },
       })
       if (!linkExists) {
        await prisma.predmet_student.create({
         data: {
          student: { connect: { id: user.encId } },
          predmet: { connect: { kod_predmetu: predmetExists.kod_predmetu } },
         },
        })
       }
      }
     }
    }
    data.dbId = user.encId
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
