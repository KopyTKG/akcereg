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
			// call API to check if user exists
			const url = `${process.env.NEXT_PUBLIC_BASE}/api/login?ticket=${params.stagUserTicket}`
			fetch(url, { method: 'GET', headers: fastHeaders, credentials: 'include' }).then((data) => {
				if (!data.ok) {
					window.location.href = '/logout'
				} else {
					window.location.href = '/'
				}
			})
		} else if (!window.location.href.includes(redirectUrl)) {
			// Redirect the user to the specified URL
			window.location.href = redirectUrl
		}
	}, [])

	return <main>Login in ...</main>
}
