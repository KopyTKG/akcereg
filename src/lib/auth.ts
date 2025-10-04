import { decrypt, getHash } from '@/lib/crypto'

// ####### DEPRICATED - api will be migrated to Next.js instead of FastAPI #######
export const fastHeaders = new Headers({
 accept: 'application/json',
 'Content-Type': 'application/json',
})
// ###############################################################################

// Ticket validation for enc ticket
export function validateTicket(req: Request): string | null {
 const headers = req.headers
 const cookie = headers.get('cookie')
 let cookies: string[] = ['']
 if (cookie?.includes(';')) {
  cookies = cookie?.split(';')
 } else {
  cookies[0] = cookie || ''
 }
 const ticket = cookies.filter((str) => str.includes('x-svt='))
 let rTicket = ticket[0].split('=')[1] || ''
 if (!rTicket) {
  return null
 }

 try {
  const t = decrypt(req, rTicket)
  if (!t) return null
  rTicket = t
 } catch {
  return null
 }

 const hash = cookies.filter((str) => str.includes('x-svh='))
 const rhash = hash[0].split('=')[1] || ''
 if (!rhash) {
  return null
 }

 if (rhash !== getHash(rTicket)) {
  return null
 }

 return rTicket
}

// Ticket validation for soft ticket
export function validateSoftTicket(req: Request): string | null {
 const headers = req.headers
 const cookie = headers.get('cookie')
 let cookies: string[] = ['']
 if (cookie?.includes(';')) {
  cookies = cookie?.split(';')
 } else {
  cookies[0] = cookie || ''
 }
 const ticket = cookies.filter((str) => str.includes('e-svt='))
 const rTicket = ticket[0].split('=')[1] || ''
 if (!rTicket) {
  return null
 }
 const hash = cookies.filter((str) => str.includes('e-svh='))
 const rhash = hash[0].split('=')[1] || ''
 if (!rhash) {
  return null
 }

 if (rhash !== getHash(rTicket)) {
  return null
 }

 return rTicket
}
