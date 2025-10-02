import { setupParser } from '@/lib/parsers'
import { tUser } from '@/lib/types'
import { decrypt } from '@/lib/crypto'

export const fastHeaders = new Headers({
 accept: 'application/json',
 'Content-Type': 'application/json',
})

/* Header Based ticket in X-Stag-Ticket */
export function getTicketX(req: Request): string | null {
 const headers = req.headers
 const rTicket = headers.get('x-svt') || ''

 if (!rTicket) {
  return null
 }
 return rTicket
}
/* Header Based ticket in X-Stag-Ticket */
export function getTicketHash(req: Request): string | null {
 const headers = req.headers
 const hash = headers.get('x-svh') || ''

 if (!hash) {
  return null
 }
 return hash
}

/* Header Based ticket */
export function getTicketV2(req: Request): string | null {
 const headers = req.headers
 const cookie = headers.get('Cookie')
 let cookies: string[] = ['']
 if (cookie?.includes(';')) {
  cookies = cookie?.split(';')
 } else {
  cookies[0] = cookie || ''
 }

 const ticket = cookies.filter((str) => str.includes('x-svt='))
 const eTicket = ticket[0].split('=')[1] || ''
 let rTicket: string | null = ''
 try {
  rTicket = decrypt(req, eTicket)
 } catch (e) {
  console.error(e)
 }
 if (!rTicket) {
  return null
 }

 return rTicket
}

export async function getUserInfoV1(ticket: string): Promise<tUser | null> {
 const checkURL = new URL(`${process.env.BASE}/api/setup`)
 checkURL.searchParams.set('ticket', ticket)
 const res = await fetch(checkURL.toString(), { method: 'GET' })

 if (!res.ok) return null
 const data = await res.json()
 return data.info
}
