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
 let rTicket = ''
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

export async function getUserInfo(ticket: string): Promise<tUser | null> {
 const checkURL = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/setup`)
 const roleRes = await fetch(checkURL, {
  method: 'GET',
  headers: { ...fastHeaders, 'x-svt': ticket },
 })

 if (!roleRes.ok) return null

 const data = await roleRes.json()
 return setupParser(data)
}

export async function getUserInfoV1(ticket: string): Promise<tUser | null> {
 const checkURL = new URL(`${process.env.API}/setup`)
 checkURL.searchParams.set('ticket', ticket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) return null

 const data = await roleRes.json()
 return setupParser(data)
}
