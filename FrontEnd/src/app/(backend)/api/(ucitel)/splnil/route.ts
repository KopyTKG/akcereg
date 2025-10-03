import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { validateTicket, fastHeaders } from '@/lib/auth'
import { getUserInfo } from '@/lib/stag'

// Create
export async function POST(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rId_terminu = base.searchParams.get('id_terminu') || ''

 if (!rId_stud || !rId_terminu) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/splnit`)
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

// Delete
export async function DELETE(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rId_terminu = base.searchParams.get('id_terminu') || ''

 if (!rId_stud || !rId_terminu) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/splnit`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)
 url.searchParams.set('id_terminu', rId_terminu)

 const res = await fetch(url.toString(), {
  method: 'DELETE',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 return Success()
}
