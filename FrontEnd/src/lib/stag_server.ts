import { tUser } from '@/lib/types'
import { getHash } from '@/lib/crypto'

export async function getSetup(ticket: string): Promise<tUser | null> {
 const checkURL = new URL(`${process.env.BASE}/api/setup`)

 const cookies = [`e-svt=${ticket}`, `e-svh=${getHash(ticket)}`]
 const res = await fetch(checkURL.toString(), {
  method: 'GET',
  headers: { Cookie: cookies.join(';') },
 })

 if (!res.ok) return null
 const data = await res.json()
 return data
}
