import {
 tGetPredmetInfo,
 tGetStudentInfo,
 tGetStagUserListForLoginTicketV2,
 tGetStudentiByPredmet,
 tGetRozvrhByStudent,
} from '@/types/stag_response_types'
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
export function encodeId(id: string) {
 const hash = crypto.createHash('sha1')
 hash.update(id)
 return hash.digest('hex')
}

function assembleHeaders(ticket: string): Headers {
 const headers = new Headers({
  accept: 'application/json',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'Accept-Origin': `${process.env.STAG_SERVER}`,
 })
 headers.set('Cookie', `WSCOOKIE=${ticket}`)
 return headers
}

/*
 * STAG API calls
 *
 * All functions return null if anything goes wrong (non-200 response, empty response, etc.)
 */

export async function getUserInfo(
 ticket: string,
): Promise<tGetStagUserListForLoginTicketV2 | null> {
 const headers = assembleHeaders(ticket)

 const res = await fetch(
  `${process.env.STAG_SERVER}/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${ticket}`,
  { method: 'GET', headers },
 )
 if (!res.ok) return null
 if (res.status === 204) return null

 const data = (await res.json()) as tGetStagUserListForLoginTicketV2
 if (!data) return null

 for (const user of data.stagUserInfo) {
  if (user.osCislo) user.encId = encodeId(`${user.osCislo}`)
  if (user.ucitIdno) user.encId = encodeId(`${user.ucitIdno}`)
 }

 return data
}

export async function getStudentiByPredmet(
 ticket: string,
 course: string,
 department: string,
): Promise<tGetStudentiByPredmet | null> {
 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/student/getStudentiByPredmet`)
 url.searchParams.set('zkratka', course)
 url.searchParams.set('katedra', department)

 const headers = assembleHeaders(ticket)

 const res = await fetch(url.toString(), { method: 'GET', headers })
 if (!res.ok) return null
 if (res.status === 204) return null

 const data = (await res.json()) as tGetStudentiByPredmet
 for (const student of data.studentPredmetu) {
  student.encOsCislo = encodeId(student.osCislo)
 }
 return data
}

export async function getPredmetInfo(
 ticket: string,
 course: string,
 department: string,
): Promise<tGetPredmetInfo | null> {
 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/predmety/getPredmetInfo`)
 url.searchParams.set('zkratka', course)
 url.searchParams.set('katedra', department)

 const headers = assembleHeaders(ticket)

 const res = await fetch(url.toString(), { method: 'GET', headers })
 if (!res.ok) return null
 if (res.status === 204) return null
 const data = await res.json()
 return data
}

export async function getStudentInfo(
 ticket: string,
 studentId: string,
): Promise<tGetStudentInfo | null> {
 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/student/getStudentInfo`)
 url.searchParams.set('osCislo', studentId)

 const headers = assembleHeaders(ticket)

 const res = await fetch(url.toString(), { method: 'GET', headers })
 if (!res.ok) return null
 if (res.status === 204) return null

 const data = (await res.json()) as tGetStudentInfo
 if (!data) return null
 return data
}

export async function getRovrhByStudent(
 ticket: string,
 studentId: string,
): Promise<tGetRozvrhByStudent | null> {
 return getRozvrhByStudent(ticket, studentId)
}

export async function getRozvrhByStudent(
 ticket: string,
 studentId: string,
): Promise<tGetRozvrhByStudent | null> {
 const url = new URL(`${process.env.STAG_SERVER}/services/rest2/rozvrhy/getRozvrhByStudent`)
 url.searchParams.set('osCislo', studentId)

 const headers = assembleHeaders(ticket)

 const res = await fetch(url.toString(), { method: 'GET', headers })
 if (!res.ok) return null
 if (res.status === 204) return null

 const data = await res.json()
 if (!data) return null
 return data
}
