import LogoutClient from './LogoutClient'
import { Get } from '@/app/actions'

export default async function LogoutPage() {
 const ticket = (await Get('stagUserTicket'))?.value || ''

 // Ensure we're passing a serializable value
 const serializedTicket = typeof ticket === 'string' ? ticket : JSON.stringify(ticket)

 return <LogoutClient ticket={serializedTicket} apiUrl={process.env.NEXT_PUBLIC_BASE || ''} />
}
