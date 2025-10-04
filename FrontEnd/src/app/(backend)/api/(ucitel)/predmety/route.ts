import { isAdmin, isStudent } from '@/lib/functions'
import { Unauthorized, Success, Forbidden } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { tPredmetyResponse } from '@/types/next_response_types'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Forbidden()

 const res = {} as tPredmetyResponse
 res.predmety = []

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

 const dbPredmety = await prisma.predmet.findMany({
  where: {
   predmet_role: {
    some: {
     role: someFilter,
    },
   },
  },
 })
 if (dbPredmety) {
  for (const predmet of dbPredmety) {
   res.predmety.push({
    _id: predmet.kod_predmetu,
    nazev: predmet.kod_predmetu,
    nCviceni: predmet.pocet_cviceni || 0,
   })
  }
 }

 return Success(res)
}
