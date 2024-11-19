import { isStudent } from '@/lib/functions'
import { Forbidden, NotFound, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicketV2, getUserInfoV1 } from '@/lib/stag'
import { tPredmetSekce } from '@/lib/types'

export async function GET(req: Request) {
 const rTicket = getTicketV2(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfoV1(rTicket)
 if (!info) return Unauthorized()
 if (!isStudent(info)) return Forbidden()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/profil`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 if (!res.ok) return NotFound()

 const data = (await res.json()) as { [key: string]: number[] }
 const keys = Object.keys(data)
 const parsed: tPredmetSekce[] = []
 keys.forEach((item: string) => {
  const tmp: tPredmetSekce = {
   nazev: item,
   cviceni: data[item],
  }
  parsed.push(tmp)
 })

 return Success({ data: parsed })
}
