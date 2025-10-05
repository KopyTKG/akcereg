import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'
import { tPredmet } from '@/types/next_response_types'

export async function fetchPredmetyData(): Promise<tPredmet[] | undefined> {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const res = await fetch(url.toString(), {
   method: 'GET',
   credentials: 'include',
  })
  if (!res.ok) {
   console.error(res.statusText)
   return undefined
  } else if (res.ok) {
   const data = await res.json()
   return data && data?.predmety ? (data?.predmety as tPredmet[]) : undefined
  }
 } catch (e) {
  console.error(e)
  return undefined
 }
}

export function DateTime(date: Date, time: string, timezone: string): number {
 const base = new Date(date)
 const splitted = time.split(':')
 base.setHours(parseInt(splitted[0]), parseInt(splitted[1]), 0, 0)

 const utcDate = new Date(base.toLocaleString('en-US', { timeZone: 'UTC' }))

 const options = { timeZone: timezone, hour12: false }
 const tzDate = new Date(base.toLocaleString('en-US', options))

 const timeOffset = tzDate.getTime() - utcDate.getTime()

 return base.getTime() + timeOffset
}

export function Time(timestamp: Date): string {
 const datetime = new Date(timestamp)
 return `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
}

export function isStudent(info: tGetStagUserListForLoginTicketV2): boolean {
 return info.stagUserInfo.find((user) => user.role === 'ST') !== undefined
}

export function isAdmin(info: tGetStagUserListForLoginTicketV2): boolean {
 return info.stagUserInfo.find((user) => user.role === 'KA') !== undefined
}

export function isVyucujici(info: tGetStagUserListForLoginTicketV2): boolean {
 return info.stagUserInfo.find((user) => user.role === 'VY') !== undefined
}

export function addDays(date: Date, days: number) {
 const result = new Date(date)
 result.setDate(result.getDate() + days)
 return result
}

export function addHours(date: Date, hours: number) {
 const result = new Date(date)
 result.setHours(result.getHours() + hours)
 return result
}
