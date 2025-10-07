import { Forbidden, Success, Unauthorized } from '@/lib/http'
import { validateTicket } from '@/lib/auth'
import { getUserInfo } from '@/lib/stag'
import { isStudent } from '@/lib/functions'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Forbidden()

 const timeOffset = 7 * 24 * 60 * 60 * 1000
 const endDate = new Date(Date.now() + timeOffset)

 const terminy = await prisma.termin.findMany({
  where: {
   predmet: {
    predmet_role: {
     some: {
      role: {
       ucitIdno: `${info.stagUserInfo[0].ucitIdno}`,
      },
     },
    },
   },
   datum_start: { gte: new Date() },
   datum_konec: { lte: endDate }, // konec + 7 dní
  },
 })

 return Success({ terminy: terminy })
}
