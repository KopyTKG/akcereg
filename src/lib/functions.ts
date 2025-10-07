import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'
import { tPredmetyBody } from '@/types/next_response_types'

export async function fetchPredmetyData(): Promise<tPredmetyBody | undefined> {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/ucitel/predmety`)
  const res = await fetch(url.toString(), {
   method: 'GET',
   credentials: 'include',
  })
  if (!res.ok) {
   console.error(res.statusText)
   return undefined
  } else if (res.ok) {
   return (await res.json()) as tPredmetyBody
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

export function createDateString(): string {
 return new Date(Date.now())
  .toLocaleString('en-GB', {
   year: 'numeric',
   month: '2-digit',
   day: '2-digit',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
  })
  .replace(',', '')
  .replace(/:/g, '-')
  .replace(/\//g, '-')
  .replace(' ', '_')
}

export function createCSV(data: string[][], filename: string) {
 const csvContent = data.map((row) => row.join(',')).join('\n')
 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
 const link = document.createElement('a')
 const url = URL.createObjectURL(blob)
 link.setAttribute('href', url)
 link.setAttribute('download', filename)
 link.style.visibility = 'hidden'
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)
}
