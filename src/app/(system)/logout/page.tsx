'use client'
import { useLayoutEffect } from 'react'

export default function LogoutPage() {
 useLayoutEffect(() => {
  const apiUrl: string = process.env.NEXT_PUBLIC_BASE || ''
  const url = new URL(`${apiUrl}/api/auth/logout`)

  fetch(url, {
   method: 'GET',
   credentials: 'include',
  }).then((data) => {
   if (!data.ok) {
    window.location.href = '/'
   } else {
    window.location.href = '/standby'
   }
  })
 }, [])

 return <main>...</main>
}
