import { isStudent } from '@/lib/functions'
import { Unauthorized, Success, Conflict, NotFound, Internal, Forbidden } from '@/lib/http'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (!isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 const rType = base.searchParams.get('type') || ''

 if (!rID || !rType) return NotFound()

 const url = new URL(`${process.env.API}/student`)
 url.searchParams.set('id_terminu', rID)
 url.searchParams.set('typ', rType)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), { method: 'POST', headers: fastHeaders })

 switch (res.status) {
  case 200:
   return Success()
  case 409:
   return Conflict()
  case 401:
   return Unauthorized()
  default:
   return Internal()
 }
}
