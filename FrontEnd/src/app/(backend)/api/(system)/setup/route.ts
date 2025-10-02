import { Internal, Success, Unauthorized } from '@/lib/http'
import { getTicketX } from '@/lib/stag'
import { tUserRes, tUser } from '@/lib/types'
import { prisma } from '@/prisma'

import crypto from 'crypto'

function encodeId(id: string) {
 const hash = crypto.createHash('sha1')
 hash.update(id)
 return hash.digest('hex')
}

// GET data from stag
const headers = new Headers({
 accept: 'application/json',
 'Content-Type': 'application/json',
 Connection: 'keep-alive',
 'Accept-Origin': `${process.env.STAG_SERVER}`,
})

async function getUserInfo(ticket: string): Promise<tUser | null> {
 const res = await fetch(
  `${process.env.STAG_SERVER}/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${ticket}`,
  { method: 'GET', headers },
 )
 if (!res.ok) return null
 const data = await res.json()
 return data as tUserRes
}

export async function GET(req: Request) {
 // Ticket is as search param
 const { searchParams } = new URL(req.url)
 let rTicket = searchParams.get('ticket') || ''

 if (!rTicket) {
  rTicket = getTicketX(req) || ''
 }
 if (!rTicket) Unauthorized('Missing ticket')

 const url = new URL(`${process.env.API}/setup`)
 url.searchParams.set('ticket', rTicket)

 const data = await getUserInfo(rTicket)

 if (!data) {
  return Internal()
 } else {
  console.log(data)
  const info: tUser = {
   role: [],
   id: '',
   hash: '',
  }
  for (const d of data.stagUserInfo) {
   info.role.push(d.role)
   if (d.role == 'ST') info.id = d.osCislo
   else info.id = d.ucitIdno
  }
  info.hash = encodeId(`${info.id}`)

  if (info.role.includes('ST')) {
   // Check if user exists in DB
   const user = await prisma.student.findUnique({
    where: { id: info.hash },
   })
   if (!user) {
    // Create new user
    await prisma.student.create({
     data: {
      id: info.hash,
      datum_vytvoreni: new Date(),
     },
    })
   }
  } else {
   const user = await prisma.vyucujici.findUnique({
    where: { id: info.hash },
   })
   if (!user) {
    // Create new user
    await prisma.vyucujici.create({
     data: {
      id: info.hash,
     },
    })
   }
  }

  return Success({ info })
 }
}
