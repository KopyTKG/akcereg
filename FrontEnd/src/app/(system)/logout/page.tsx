'use client'
import { fastHeaders } from '@/lib/stag'
import { useLayoutEffect } from 'react'

export default function LogoutPage() {
 useLayoutEffect(() => {
  async function logout() {
   const apiUrl: string = process.env.NEXT_PUBLIC_BASE || ''
   const url = new URL(`${apiUrl}/api/logout`)

   fetch(url, {
    method: 'GET',
    headers: {
     ...fastHeaders,
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
