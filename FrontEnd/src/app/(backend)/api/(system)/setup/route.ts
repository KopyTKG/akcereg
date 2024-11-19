import { decrypt } from '@/lib/crypto'
import { Internal, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicketX } from '@/lib/stag'

export async function GET(req: Request) {
 console.log(req)
 const eTicket = getTicketX(req)
 if (!eTicket) return Unauthorized()

 const rTicket = decrypt(req, eTicket)
 console.log(rTicket)
 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url, {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) {
  return Internal()
 } else {
  const data = await res.json()
  console.log(data)
  return Success(data)
 }
}
