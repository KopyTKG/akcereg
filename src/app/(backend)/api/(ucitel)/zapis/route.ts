import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { fastHeaders, validateTicket } from '@/lib/auth'
// Create
export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rId_terminu = base.searchParams.get('id_terminu') || ''

 if (!rId_stud || !rId_terminu) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/zapis`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)
 url.searchParams.set('id_terminu', rId_terminu)

 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 return Success()
}
