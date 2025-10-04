import { Header } from '@/components/ui/header'
import ZapsaneTerminy from '@/components/user/zapsaneTerminy'

export default function MojeTerminyPage() {
 return (
  <div className="w-full flex flex-col gap-5 items-center h-full">
   <Header underline="fade">Moje termíny</Header>
   <ZapsaneTerminy />
  </div>
 )
}
