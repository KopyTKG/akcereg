import { tPredmetSekce } from '@/lib/types'
import { Divider } from './ui/divider'
import { Chip } from './ui/chip'

export default function Predmet({
 predmet,
 key,
 lenght,
}: {
 predmet: tPredmetSekce
 key?: number
 lenght?: number
}) {
 return (
  <div className="mb-3">
   <h3 className="font-bold text-xl ">{predmet.nazev}</h3>
   <div className="w-full h-max rounded-2xl flex flex-col dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-800 dark:shadow-neutral-950">
    {predmet.cviceni.map((datum: any, key: number) => {
     return (
      <>
       <div
        key={datum.toLocaleString() + key}
        className={`w-full h-full flex flex-row justify-between p-3 bg-gradient-to-l ${key === 0 ? `rounded-t-xl` : key === predmet.cviceni.length - 1 ? 'rounded-b-xl' : ''} ${!datum ? 'from-red-500/15 to-transparent' : 'from-lime-500/15 to-transparent'}`}>
        <span className="text-lg">{`Laboratorní cvičení ${key + 1}`}</span>
        <Chip type={datum ? 'success' : 'danger'}>
         {datum ? new Date(datum).toLocaleDateString() : 'nesplnil'}
        </Chip>
       </div>
       {key < predmet.cviceni.length - 1 && <Divider margin="my0" />}
      </>
     )
    })}
   </div>
   {(key || 0) < (lenght || 0) && <Divider margin="my4" variant="ghost" />}
  </div>
 )
}
