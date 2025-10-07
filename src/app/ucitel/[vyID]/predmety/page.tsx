'use client'
import AdminToolbar from '@/components/adminToolbar'
import Predmety from '@/components/predmety'
import { Header } from '@/components/ui/header'
import { useUserContext } from '@/contexts/UserProvider'
import { isAdmin } from '@/lib/functions'

export default function Page() {
 const { userInfo } = useUserContext()
 return (
  <div className="w-max mx-auto flex flex-col items-center gap-2">
   <Header underline="fade" className="w-max">
    Předměty
   </Header>
   {isAdmin(userInfo) && <AdminToolbar />}
   <Predmety isAdmin={isAdmin(userInfo)} />
  </div>
 )
}
