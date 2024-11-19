import { tPredmet, tUser } from '@/lib/types'
import { fastHeaders } from '@/lib/stag'

export async function fetchPredmetyData(): Promise<tPredmet[] | undefined> {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const res = await fetch(url.toString(), {
   method: 'GET',
   headers: fastHeaders,
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

export function Time(timestamp: number): string {
 const datetime = new Date(timestamp)
 return `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
}

export function isStudent(info: tUser): boolean {
 return info.role.includes('ST')
}

export function isAdmin(info: tUser): boolean {
 return info.role.includes('KA')
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
