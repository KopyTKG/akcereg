import { Header } from '@/components/ui/header'
import UcitelHome from '@/components/screens/(ucitel)/ucitel_home'

export default function UcitelPage() {
 return (
  <div className="w-max-4xl w-full flex flex-col gap-5 items-center h-full">
   <Header underline="fade">Nadcházející termíny</Header>
   <UcitelHome />
  </div>
 )
}
