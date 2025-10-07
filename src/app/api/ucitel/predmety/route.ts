import { isAdmin, isStudent } from '@/lib/functions'
import { Unauthorized, Success, Forbidden, NotFound } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'

// TODO: add logic for multi-role users (e.g. admin + vyucujici)

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Forbidden()

 let searchRole = ''
 if (isAdmin(info)) {
  searchRole = 'KA'
 } else {
  searchRole = 'VY'
 }

 const someFilter = {
  ...(info.dbId ? { vyucujici_id: info.dbId } : {}),
  ...(searchRole ? { role: searchRole } : {}),
 }

 const predmety = await prisma.predmet.findMany({
  where: {
   predmet_role: {
    some: {
     role: someFilter,
    },
   },
  },
 })
 if (!predmety) return NotFound()
 return Success({ predmety: predmety })
}
