import { isAdmin } from '@/lib/functions'
import { Forbidden, Internal, NotFound, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'
import { tPredmetBody } from '@/lib/types'

/* ----------------------------------------------------------------------------------------------- */
// Create
export async function POST(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const rBody: tPredmetBody = await req.json()
 if (!rBody) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/predmet`)
 url.searchParams.set('ticket', rTicket)
 const body = {
  zkratka_predmetu: rBody.zkratka,
  katedra: rBody.katedra,
  pocet_cviceni: rBody.cviceni,
 }
 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
  body: JSON.stringify(body),
 })
 if (!res.ok) return Internal()
 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Update
export async function PATCH(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 const rBody: tPredmetBody = await req.json()
 if (!rBody) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/predmet`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('kod_predmetu', rKod_predmetu)
 const body = {
  zkratka_predmetu: rBody.zkratka,
  katedra: rBody.katedra,
  pocet_cviceni: rBody.cviceni,
 }
 const res = await fetch(url.toString(), {
  method: 'PATCH',
  headers: fastHeaders,
  body: JSON.stringify(body),
 })
 if (!res.ok) return Internal()
 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Delete
export async function DELETE(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/predmet`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('kod_predmetu', rKod_predmetu)

 const res = await fetch(url.toString(), { method: 'DELETE', headers: fastHeaders })
 if (!res.ok) return Internal()
 return Success()
}
