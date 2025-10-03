import { tStagUserInfo, tStudentInfo, tUser, tUserRes } from '@/lib/types'

import crypto from 'crypto'

/* Header Based ticket in X-Stag-Ticket */
export function getTicketX(req: Request): string | null {
 const headers = req.headers
 const rTicket = headers.get('x-svt') || ''

 if (!rTicket) {
  return null
 }
 return rTicket
}

// Header Based ticket in Cookie
function encodeId(id: string) {
 const hash = crypto.createHash('sha1')
 hash.update(id)
 return hash.digest('hex')
}

export async function getUserInfo(ticket: string): Promise<tUser | null> {
 const headers = new Headers({
  accept: 'application/json',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'Accept-Origin': `${process.env.STAG_SERVER}`,
 })

 const res = await fetch(
  `${process.env.STAG_SERVER}/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${ticket}`,
  { method: 'GET', headers },
 )
 if (!res.ok) return null
 const data = (await res.json()) as tUserRes

 if (!data) return null

 const info: tUser = {
  role: [],
  id: '',
  hash: '',
 }

 for (const user of data.stagUserInfo) {
  const d = user as tStagUserInfo
  info.role.push(d.role)
  if (d.role == 'ST') info.id = d.osCislo
  else info.id = d.ucitIdno
 }
 info.hash = encodeId(`${info.id}`)
 return info
}

export async function getStudentsForCourse(
 ticket: string,
 course: string,
 department: string,
): Promise<tStudentInfo[] | null> {
 const headers = new Headers({
  accept: 'application/json',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'Accept-Origin': `${process.env.STAG_SERVER}`,
 })

 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/student/getStudentiByPredmet`)
 url.searchParams.set('zkratka', course)
 url.searchParams.set('katedra', department)

 // Set WSCOOKIE in cookies
 headers.set('Cookie', `WSCOOKIE=${ticket}`)

 const res = await fetch(url.toString(), { method: 'GET', headers })
 if (!res.ok) return null

 const data = await res.json()
 const result: tStudentInfo[] = []
 for (const student of data.studentPredmetu) {
  const s = student as tStudentInfo
  s.encOsCislo = encodeId(student.osCislo)
  s.email = student.email
  result.push(s)
 }
 return result
}
