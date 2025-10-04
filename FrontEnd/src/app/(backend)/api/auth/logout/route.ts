import { Internal } from '@/lib/http'
import { validateTicket } from '@/lib/auth'

export async function GET(req: Request) {
 let rTicket = validateTicket(req)
 if (!rTicket) rTicket = ''

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
  headers.append(
   'Set-Cookie',
   `x-svh=;expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict`,
  )
  headers.append('Cache-Control', 'no-store, no-cache, must-revalidate')
  headers.append('Pragma', 'no-cache')

  return new Response('', {
   status: 200,
   statusText: 'OK',
   headers: headers,
  })
 }
}
