import { decrypt } from '@/lib/crypto'
import { Internal, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicketX } from '@/lib/stag'

export async function GET(req: Request) {
 const eTicket = getTicketX(req)
 if (!eTicket) return Unauthorized()

 const rTicket = decrypt(req, eTicket)
 if (!rTicket) {
  return Internal()
 }
 const url = new URL(`${process.env.API}/setup`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url, {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) {
  return Internal()
 } else {
  const data = await res.json()
  return Success(data)
 }
}
