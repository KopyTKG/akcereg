import { encrypt } from '@/lib/crypto'
import { isStudent } from '@/lib/functions'
import { Internal, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicketX, getUserInfoV1 } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicketX(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()

 const ticket = encrypt(req, rTicket)

 if (isStudent(info))
  return new Response('', {
   status: 200,
   statusText: 'OK',
   headers: {
    'Set-Cookie': `x-svt=${ticket}; Path=/; HttpOnly; SameSite=Strict`,
   },
  })
 else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/reset/ucitel`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return Internal()
  } else {
   return new Response('', {
    status: 200,
    statusText: 'OK',
    headers: {
     'Set-Cookie': `x-svt=${ticket}; Path=/; HttpOnly; SameSite=Strict`,
    },
   })
  }
 }
}
