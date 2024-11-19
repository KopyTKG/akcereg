import { Get } from '@/app/actions'
import AdminToolbar from '@/components/adminToolbar'
import Predmety from '@/components/predmety'
import { Header } from '@/components/ui/header'

export default async function Page() {
 const ticket = (await Get('x-cvt'))?.value || ''
 if (!ticket) console.error('missing')
 return (
  <div className="w-max mx-auto flex flex-col items-center gap-2">
   <Header underline="fade" className="w-max">
    Předměty
   </Header>
   {ticket && <AdminToolbar />}
   <Predmety isAdmin={ticket ? true : false} />
  </div>
 )
}
