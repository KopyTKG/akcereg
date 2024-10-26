import LogoutClient from './LogoutClient'
import { Get } from '@/app/actions'

export default async function LogoutPage() {
 let ticket: string = ''

 try {
  const ticketData = await Get('stagUserTicket')
  ticket = ticketData?.value ?? ''
 } catch (error) {
  console.error('Error fetching ticket:', error)
 }

 // Ensure ticket is a string
 const serializedTicket = ticket

 // Ensure NEXT_PUBLIC_BASE is a string
 const apiUrl: string = process.env.NEXT_PUBLIC_BASE || ''

 return <LogoutClient ticket={serializedTicket} apiUrl={apiUrl} />
}
