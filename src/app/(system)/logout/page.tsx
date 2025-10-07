import { redirect } from 'next/navigation'

export default async function LogoutPage() {
 const url = new URL(`${process.env.BASE || ''}/api/auth/logout`)

 const res = await fetch(url, {
  method: 'GET',
  credentials: 'include',
 })
 if (!res.ok) redirect('/logout')
 redirect('/standby')
}
