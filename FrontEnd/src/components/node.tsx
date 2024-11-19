/* eslint-disable react/prop-types */
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { tNode } from '@/lib/types'
import { Clock, Clock12, MapPin, UsersRound, Clock2, Files } from 'lucide-react'
import { Zapsat, Zobrazit } from '@/components/nodeButton'
import { Chip } from '@/components/ui/chip'
import { useContext, useMemo } from 'react'
import { FormCtx } from '@/contexts/FormProvider'
import { Time } from '@/lib/functions'

function CheckDate(date: number): boolean {
 const timeGap: number = parseInt(process.env.NEXT_PUBLIC_TIME_GAP || '0')
 const timeToCheck = new Date(date).setHours(new Date(date).getHours() - timeGap)
 return Date.now() < new Date(timeToCheck).getTime() ? true : false
}

function CheckProgress(date: number): boolean {
 return Date.now() < date ? true : false
}
export default function Node({ demo = false, props }: { demo?: boolean; props: tNode }) {
 if (!props) throw new Error('missing props')

 const volnoRender = useMemo(() => {
  if (!CheckDate(props.start)) return true
  return (props.zapsany || 0) >= props.kapacita
 }, [props.start, props.kapacita, props.zapsany])

 const capRender = useMemo(() => {
  if (!CheckDate(props.start)) return true
  return (props.zapsany || 0) >= props.kapacita
 }, [props.start, props.kapacita, props.zapsany])

 return (
  <Card className="w-[25rem] h-max min-h-[10rem] dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-700 dark:shadow-neutral-900">
   <div className="w-full flex justify-end pt-2 pr-2 h-[1.75rem] mb-[-1.5rem]">
    {props.typ != 'student' ? (
     CheckProgress(props.start) ? (
      <Clock12 className="text-stone-600 dark:text-stone-50 w-5" />
     ) : CheckProgress(props.konec) ? (
      <Clock2 className="text-amber-500 w-5" />
     ) : (
      <Clock className="text-red-600 w-5" />
     )
    ) : (
     <Chip className="m-0 py-0 font-bold" type="warning">
      {props.cviceni} z {props?.nCviceni}
     </Chip>
    )}
   </div>
   <CardHeader>
    <div className="text-2xl font-bold">{props.nazev}</div>
    <p className="text-sm text-justify">{props.tema}</p>
   </CardHeader>
   <Divider className="mx-auto w-[80%] h-[0.1rem]" variant="fade" margin="mb4" />
   <CardContent>
    <div className="text-md flex flex-col my-2 gap-1">
     <div className="flex flex-row justify-start gap-1 items-center ">
      <Clock12 className="w-6 text-green-500" />
      <div className="pt-1">{new Date(props.start).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1 items-center">
      <Clock className="w-6 text-red-500" />
      <div className="pt-1">{new Date(props.konec).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1 items-center">
      <MapPin className="w-6" />
      <div className="pt-1">{props.ucebna}</div>
     </div>
    </div>
   </CardContent>
   <CardFooter className="flex justify-between width-fultems-center">
    <div className="grid grid-cols-[70%_30%] gap-1 w-full">
     <div className="flex flex-col gap-1 justify-end">
      {props.vypsal?.map((item: string, key: number) => (
       <span key={item + key} className="text-xs">{`${item}`}</span>
      ))}
     </div>
     <div className="flex flex-col items-center justify-end gap-1">
      <div className="flex gap-2 items-center">
       {`${props.zapsany} / ${props.kapacita}`} <UsersRound className="w-7" />
      </div>

      {props.typ == 'student' ? (
       <Zapsat
        id={props._id}
        owned={props.owned || false}
        date={CheckDate(props.start)}
        VolnoRender={volnoRender}
        CapRender={capRender}
        volno={(props?.zapsany || 0) >= props.kapacita}
        demo={demo}
       />
      ) : (
       <div className="inline-flex gap-2">
        <Duplicate props={props} demo={demo} />
        <Zobrazit id={props._id} demo={demo} />
       </div>
      )}
     </div>
    </div>
   </CardFooter>
  </Card>
 )
}

function Duplicate({ demo, props }: { demo?: boolean; props: tNode }) {
 const Fcontext = useContext(FormCtx)
 if (!Fcontext) {
  throw Error('Missing FormProvider')
 }
 const { setOpen, setFormData, setTerminID, setType } = Fcontext
 return (
  <button
   className="dark:text-stone-50 dark:hover:text-stone-300 text-stone-950 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-600 dark:focus:ring-stone-400 focus:ring-opacity-50 rounded-full p-1"
   aria-label="Mails"
   onClick={() => {
    if (!demo) {
     setOpen(true)
     setFormData({
      _id: props.kod || '',
      cviceni: props.cviceni.toString(),
      nazev: props.nazev,
      tema: props.tema,
      ucebna: props.ucebna,
      kapacita: props.kapacita,
      startDatum: new Date(props.start),
      startCas: Time(props.start),
      konecDatum: new Date(props.konec),
      konecCas: Time(props.konec),
      upozornit: true,
      vJmeno: '',
      vPrijmeni: '',
     })
     setTerminID('')
     setType('create')
    }
   }}>
   {' '}
   <Files className="w-6 h-6" aria-hidden="true" />
  </button>
 )
}
