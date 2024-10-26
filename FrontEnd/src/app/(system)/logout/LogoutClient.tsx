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
    if (!apiUrl) {
     throw new Error('API URL is not defined')
    }
    const url = new URL(`${apiUrl}/api/invalidate`)
    if (ticket) {
     url.searchParams.set('ticket', ticket)
    }
    const res = await fetch(url.toString(), { method: 'GET' })
    if (res.ok) {
     await deleteParam('stagUserTicket')
    } else {
     throw new Error('Logout failed')
    }
   } catch (e) {
    console.error('Logout error:', e)
   } finally {
    window.location.href = '/'
   }
  }
  logout()
 }, [ticket, apiUrl])

 return <main>Logging out...</main>
}
