import Profil from '@/components/profil'
import { Header } from '@/components/ui/header'
export default function ProfilePage() {
 return (
  <>
   <div className="flex flex-col w-full mx-auto">
    <Header underline="fade">Profil studenta</Header>
    <Profil />
   </div>
  </>
 )
}
