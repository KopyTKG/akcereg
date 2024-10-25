import { Unauthorized, Internal, Success } from '@/lib/http'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'
import { tPredmet } from '@/lib/types'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/predmety`)
 url.searchParams.set('ticket', rTicket)
 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 if (!res.ok && res.status == 401) {
  return Unauthorized()
 } else if (!res.ok) {
  return Internal()
 } else {
  const data = await res.json()
  const predmety: tPredmet[] = []
  if (data) {
   data.map((item: any) => {
    const predmet: tPredmet = {
     _id: item.id,
     nazev: item.id,
     nCviceni: item.pocet_cviceni,
    }
    predmety.push(predmet)
   })
  }
  return Success({ predmety })
 }
}
