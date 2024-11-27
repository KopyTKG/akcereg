import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'
import { tStudent } from '@/lib/types'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod = base.searchParams.get('kod_predmetu') || ''
 if (!rKod) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/uspesni_studenti`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('kod_predmetu', rKod)

 const res = await fetch(url.toString(), {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) {
  if (res.status == 404) return NotFound()
  else return Internal()
 }

 const data = await res.json()

 const studenti: tStudent[] = data.studenti
 return Success({ kod: data.kod_predmetu, studenti: studenti })
}
