import { isStudent } from '@/lib/functions'
import { Unauthorized, NotFound, Success, Internal, Forbidden } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { fastHeaders, validateTicket } from '@/lib/auth'
import { tPredmetSekce, tStudent } from '@/lib/types'

type tResponse = {
 info: {
  osCislo: string
  jmeno: string
  prijmeni: string
  email: string
 }
 profil: {
  [key: string]: number[]
 }
}

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''

 if (!rId_stud) return NotFound()

 const url = new URL(`${process.env.API}/ucitel/student`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)

 const res = await fetch(url.toString(), {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) return Internal()

 const studentInfo = (await res.json()) as tResponse
 const keys = Object.keys(studentInfo.profil)
 const student: tStudent = studentInfo.info
 const parsed: tPredmetSekce[] = []
 keys.forEach((item: string) => {
  const tmp: tPredmetSekce = {
   nazev: item,
   cviceni: studentInfo.profil[item],
  }
  parsed.push(tmp)
 })

 return Success({ info: student, data: parsed })
}
