import { isAdmin, isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success } from '@/lib/http'
import { resTotTermin } from '@/lib/parsers'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'
import { tTermin } from '@/lib/types'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()

 let apipoint = '/ucitel'
 if (isStudent(info)) {
  apipoint = '/student'
 } else if (isAdmin(info)) {
  apipoint = '/admin'
 }

 const url = new URL(req.url)
 const rType = url.searchParams.get('t') || ''

 if (!rType || (rType != 'vypsane' && rType != 'zapsane')) {
  return NotFound()
 } else if (rType === 'vypsane') {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound()
  }
  const data = await res.json()
  const terminy: tTermin[] = resTotTermin(data)
  const sorted = terminy.sort((a, b) => new Date(a.konec).getTime() - new Date(b.konec).getTime())
  return Success({ data: sorted })
 } else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}/moje`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound()
  }
  const data = await res.json()
  const terminy: tTermin[] = resTotTermin(data)
  const sorted = terminy.sort((a, b) => new Date(a.konec).getTime() - new Date(b.konec).getTime())
  return Success({ data: sorted })
 }
}
