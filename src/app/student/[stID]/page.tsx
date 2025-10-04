import { Header } from '@/components/ui/header'
import VypsaneTerminy from '@/components/user/vypsaneTerminy'

export default function StudentPage() {
 return (
  <div className="w-full flex flex-col gap-5 items-center h-full">
   <Header underline="fade"> Vypsané termíny</Header>
   <VypsaneTerminy typ="student" />
  </div>
 )
}
