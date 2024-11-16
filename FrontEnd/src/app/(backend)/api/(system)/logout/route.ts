import { Internal, Success, Unauthorized } from '@/lib/http'
import { getTicketV2, getUserInfo } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
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
  return new Response('', {
   status: 200,
   statusText: 'OK',
   headers: {
    'Set-Cookie': `stagUserTicket=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict`,
   },
  })
 }
}
