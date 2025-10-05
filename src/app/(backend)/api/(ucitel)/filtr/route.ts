import { isStudent } from '@/lib/functions'
import { Forbidden, Success, Unauthorized } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { validateTicket } from '@/lib/auth'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const predmety = base.searchParams.get('vybrane')
  ? base.searchParams.get('vybrane')?.split('-')
  : ''
 const vse = base.searchParams.get('vse') ? true : false

 const vyucujici = await prisma.role.findFirst({
  where: { ucitIdno: `${info.stagUserInfo[0].ucitIdno}` },
  select: {
   vyucujici: { select: { id: true } },
  },
 })

 const timeFilter = { gte: new Date() }

 const terminy = await prisma.termin.findMany({
  where: {
   vypsal_id: vyucujici?.vyucujici?.id,
   datum_konec: vse ? {} : timeFilter,
   kod_predmet: predmety && predmety.length > 0 ? { in: predmety } : undefined,
   cislo_cviceni: { not: -1 },
  },
  include: {
   vypsal: { select: { titulPred: true, jmeno: true, prijmeni: true, titulZa: true } },
   predmet: { select: { pocet_cviceni: true } },
  },
  orderBy: { datum_start: 'asc' },
 })

 return Success({ terminy: terminy })
}
