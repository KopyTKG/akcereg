'use client'
import { useLayoutEffect } from 'react'
import { fastHeaders } from '@/lib/stag'

export default function Home() {
 useLayoutEffect(() => {
  const redirectUrl = `${process.env.NEXT_PUBLIC_STAG_SERVER}/login?originalURL=${process.env.NEXT_PUBLIC_BASE}/login`
  const searchParams = new URLSearchParams(window.location.search)
  const params = {
   stagUserTicket: searchParams.get('stagUserTicket'),
  }
  if (params.stagUserTicket != null) {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/login`)
   fetch(url, {
    method: 'GET',
    headers: { ...fastHeaders, 'x-svt': params.stagUserTicket },
    credentials: 'include',
   }).then((data) => {
    if (!data.ok) {
     window.location.href = '/logout'
    } else {
     window.location.href = '/'
    }
   })
  } else if (!window.location.href.includes(redirectUrl)) {
   window.location.href = redirectUrl
  }
 }, [])

 return <main>Login in ...</main>
}
