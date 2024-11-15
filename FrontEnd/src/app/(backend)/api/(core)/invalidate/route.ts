import { Internal, Success, Unauthorized } from '@/lib/http'
import { getTicket, getUserInfo } from '@/lib/stag'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 const url = new URL(`${process.env.NEXT_PUBLIC_STAG_SERVER}/services/rest2/help/invalidateTicket`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), {
  method: 'get',
  headers: {
   accept: 'text/plain',
   'Content-Type': 'text/plain',
  },
 })

 if (!res.ok) {
  console.log(res)
  return Internal()
 } else {
  return Success()
 }
}
