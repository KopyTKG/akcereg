import Filtr from '@/components/filtr'
import FiltrTerminy from '@/components/user/FiltrTerminy'

export default function Page() {
 return (
  <div className="w-max mx-auto grid md:grid-cols-[33%_67%] lg:grid-cols-[19%_81%] justify-items-center gap-10 md:gap-2">
   <Filtr />
   <div>
    <FiltrTerminy />
   </div>
  </div>
 )
}
