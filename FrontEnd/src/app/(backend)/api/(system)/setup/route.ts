import { Internal, Success, Unauthorized } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { validateSoftTicket } from '@/lib/auth'
import { tUser } from '@/lib/types'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
 // Ticket is as search param
 const rTicket = validateSoftTicket(req)
 if (!rTicket) return Unauthorized()

 const data = (await getUserInfo(rTicket)) as tUser | null

 if (!data || !data.role || !data.hash || !data.id) {
  return Internal()
 } else {
  if (data.role.includes('ST')) {
   // Check if user exists in DB
   const user = await prisma.student.findUnique({
    where: { id: data.hash },
   })
   if (!user) {
    // Create new user
    await prisma.student.create({
     data: {
      id: data.hash,
      datum_vytvoreni: new Date(),
     },
    })
   }
  } else {
   const user = await prisma.vyucujici.findUnique({
    where: { id: data.hash },
   })
   if (!user) {
    // Create new user
    await prisma.vyucujici.create({
     data: {
      id: data.hash,
     },
    })
   }
  }
  return Success(data)
 }
}
