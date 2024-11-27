import { Internal, Unauthorized } from '@/lib/http'
import { getTicketV2 } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()

 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/help/invalidateTicket`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), {
  method: 'get',
  headers: {
   accept: 'text/plain',
   'Content-Type': 'text/plain',
  },
 })

 if (!res.ok) {
  return Internal()
 } else {
  const headers = new Headers()
  headers.append(
   'Set-Cookie',
   `x-svt=;expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict`,
  )
  headers.append(
   'Set-Cookie',
   `x-cvt=;expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict`,
  )

  return new Response('', {
   status: 200,
   statusText: 'OK',
   headers: headers,
  })
 }
}
