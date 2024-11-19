import { Get } from '@/app/actions'
import AdminToolbar from '@/components/adminToolbar'
import Predmety from '@/components/predmety'
import { Header } from '@/components/ui/header'
import { isAdmin } from '@/lib/functions'
import { getUserInfo } from '@/lib/stag'

export default async function Page() {
 const ticket = (await Get('x-svt'))?.value || ''
 if (!ticket) console.error('missing ticket')
 const info = await getUserInfo(ticket)
 if (!info) throw new Error('missing ticket')
 return (
  <div className="w-max mx-auto flex flex-col items-center gap-2">
   <Header underline="fade" className="w-max">
    Předměty
   </Header>
   {isAdmin(info) && <AdminToolbar />}
   <Predmety isAdmin={isAdmin(info)} />
  </div>
 )
}
