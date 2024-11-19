import { setupParser } from '@/lib/parsers'
import { tUser } from '@/lib/types'

export const fastHeaders = new Headers({
 accept: 'application/json',
 'Content-Type': 'application/json',
})

/* URL Based ticket */
export function getTicket(req: Request): string | null {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''

 if (!rTicket) {
  return null
 }

 return rTicket
}

/* Header Based ticket */
export function getTicketV2(req: Request): string | null {
 const headers = req.headers
 const cookies = headers.get('Cookie')
 const rTicket = cookies?.split('=')[1]

 if (!rTicket) {
  return null
 }

 return rTicket
}

export async function getUserInfo(ticket: string): Promise<tUser | null> {
 const checkURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 checkURL.searchParams.set('ticket', ticket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) return null

 const data = await roleRes.json()
 return setupParser(data)
}
