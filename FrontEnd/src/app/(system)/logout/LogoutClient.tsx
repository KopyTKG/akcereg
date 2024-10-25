'use client'
import { useEffect } from 'react'
import { deleteParam } from '@/app/actions'

interface LogoutClientProps {
 ticket: string
 apiUrl: string
}

export default function LogoutClient({ ticket, apiUrl }: LogoutClientProps) {
 useEffect(() => {
  const logout = async () => {
   try {
    const url = new URL(`${apiUrl}/invalidate`)
    url.searchParams.set('ticket', ticket)
    const res = await fetch(url.toString(), { method: 'GET' })

    if (res.ok) {
     await deleteParam('stagUserTicket')
     window.location.href = '/'
    } else {
     throw new Error('Logout failed')
    }
   } catch (e) {
    console.error(e)
    await deleteParam('stagUserTicket')
    window.location.href = '/'
   }
  }
  logout()
 }, [ticket, apiUrl])

 return <main>Logging out...</main>
}
