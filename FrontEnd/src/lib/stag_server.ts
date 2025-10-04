import { getHash } from '@/lib/crypto'
import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'

export async function getAuth(ticket: string): Promise<tGetStagUserListForLoginTicketV2 | null> {
 const checkURL = new URL(`${process.env.BASE}/api/auth`)

 const cookies = [`e-svt=${ticket}`, `e-svh=${getHash(ticket)}`]
 const res = await fetch(checkURL.toString(), {
  method: 'GET',
  headers: { Cookie: cookies.join(';') },
 })

 if (!res.ok) return null
 const data = await res.json()
 return data
}
