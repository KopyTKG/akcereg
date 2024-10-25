'use client'
import { useLayoutEffect } from 'react'
import { setStag } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'

export default function Home() {
 useLayoutEffect(() => {
  const redirectUrl = `${process.env.NEXT_PUBLIC_STAG_SERVER}/login?originalURL=${process.env.NEXT_PUBLIC_BASE}/login`
  const searchParams = new URLSearchParams(window.location.search)
  const params = {
   stagUserTicket: searchParams.get('stagUserTicket'),
   stagUserInfo: searchParams.get('stagUserInfo'),
  }
  setStag(params).then(() => {
   if (params.stagUserTicket != null && params.stagUserInfo != null) {
    // call API to check if user exists
    const url = `${process.env.NEXT_PUBLIC_BASE}/api/user?ticket=${params.stagUserTicket}`
    fetch(url, { method: 'GET', headers: fastHeaders }).then((data) => {
     if (data.status != 200) {
      window.location.href = '/logout'
     } else {
      window.location.href = '/'
     }
    })
   } else if (!window.location.href.includes(redirectUrl)) {
    // Redirect the user to the specified URL
    window.location.href = redirectUrl
   }
  })
 }, [])

 return <main>Login in ...</main>
}
