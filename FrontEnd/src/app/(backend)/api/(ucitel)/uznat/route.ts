import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rKod_predmetu = decodeURI(base.searchParams.get('kod_predmetu') || '')

 if (!rId_stud || !rKod_predmetu) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/uznat`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)
 url.searchParams.set('kod_predmetu', rKod_predmetu)

 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 return Success()
}
