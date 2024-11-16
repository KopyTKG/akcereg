'use client'
import { fastHeaders } from '@/lib/stag'
import { Get } from '@/app/actions'
import { useLayoutEffect } from 'react'

export default function LogoutPage() {
 useLayoutEffect(() => {
  async function logout() {
   let ticket: string = ''

   try {
    const ticketData = await Get('stagUserTicket')
    ticket = ticketData?.value ?? ''
   } catch (error) {
    console.error('Error fetching ticket:', error)
   }

   const serializedTicket = ticket

   const apiUrl: string = process.env.NEXT_PUBLIC_BASE || ''
   const url = new URL(`${apiUrl}/api/logout`)

   fetch(url, {
    method: 'GET',
    headers: {
     ...fastHeaders,
     Cookie: `ticket=${serializedTicket}`,
    },
    credentials: 'include',
   }).then((data) => {
    if (!data.ok) {
     window.location.href = '/'
    } else {
     window.location.href = '/standby'
    }
   })
  }

  logout()
 }, [])

 return <main>...</main>
}
