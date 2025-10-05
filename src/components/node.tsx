import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { Clock, Clock12, MapPin, UsersRound, Clock2, Files } from 'lucide-react'
import { Zapsat, Zobrazit } from '@/components/nodeButton'
import { Chip } from '@/components/ui/chip'
import { useMemo } from 'react'
import { useFormContext } from '@/contexts/FormProvider'
import { tNodeProps } from '@/types/component_types'

function CheckDate(date: Date): boolean {
 const timeGap: number = parseInt(process.env.NEXT_PUBLIC_TIME_GAP || '0')
 const timeToCheck = new Date(date).setHours(new Date(date).getHours() - timeGap)
 return Date.now() < new Date(timeToCheck).getTime() ? true : false
}

function CheckProgress(date: Date): boolean {
 const timestamp = new Date(date).getTime()
 return Date.now() < timestamp ? true : false
}

export default function Node({ demo = false, props, typUzivatele }: tNodeProps) {
 if (!props) throw new Error('missing props')

 const volnoRender = useMemo(() => {
  if (!CheckDate(props.datum_start)) return true
  return (props.aktualni_kapacita || 0) >= props.max_kapacita
 }, [props.datum_start, props.max_kapacita, props.aktualni_kapacita])

 const capRender = useMemo(() => {
  if (!CheckDate(props.datum_start)) return true
  return (props.aktualni_kapacita || 0) >= props.max_kapacita
 }, [props.datum_start, props.max_kapacita, props.aktualni_kapacita])

 return (
  <Card className="w-[25rem] h-max min-h-[10rem] dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-700 dark:shadow-neutral-900">
   <div className="w-full flex justify-end pt-2 pr-2 h-[1.75rem] mb-[-1.5rem]">
    {typUzivatele === 'admin' || typUzivatele === 'teacher' ? (
     CheckProgress(props.datum_start) ? (
      <Clock12 className="text-stone-600 dark:text-stone-50 w-5" />
     ) : CheckProgress(props.datum_konec) ? (
      <Clock2 className="text-amber-500 w-5" />
     ) : (
      <Clock className="text-red-600 w-5" />
     )
    ) : (
     <Chip className="m-0 py-0 font-bold" type="warning">
      {props.cislo_cviceni} z {props.predmet.pocet_cviceni}
     </Chip>
    )}
   </div>
   <CardHeader>
    <div className="text-2xl font-bold">{props.jmeno}</div>
    <p className="text-sm text-justify">{props.popis}</p>
   </CardHeader>
   <Divider className="mx-auto w-[80%] h-[0.1rem]" variant="fade" margin="mb4" />
   <CardContent>
    <div className="text-md flex flex-col my-2 gap-1">
     <div className="flex flex-row justify-datum_start gap-1 items-center ">
      <Clock12 className="w-6 text-green-500" />
      <div className="pt-1">{new Date(props.datum_start).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-datum_start gap-1 items-center">
      <Clock className="w-6 text-red-500" />
      <div className="pt-1">{new Date(props.datum_konec).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-datum_start gap-1 items-center">
      <MapPin className="w-6" />
      <div className="pt-1">{props.ucebna}</div>
     </div>
    </div>
   </CardContent>
   <CardFooter className="flex justify-between width-fultems-center">
    <div className="grid grid-cols-[70%_30%] gap-1 w-full">
     <div className="flex flex-col gap-1 justify-end">
      {props.vypsal && (
       <span className="text-xs">{`${props.vypsal.titulPred} ${props.vypsal.jmeno} ${props.vypsal.prijmeni} ${props.vypsal.titulZa}`}</span>
      )}
     </div>
     <div className="flex flex-col items-center justify-end gap-1">
      <div className="flex gap-2 items-center">
       {`${props.aktualni_kapacita} / ${props.max_kapacita}`} <UsersRound className="w-7" />
      </div>

      {typUzivatele === 'student' ? (
       <Zapsat
        id={props.id}
        owned={props.historie_terminu?.student_id ? true : false}
        date={CheckDate(props.datum_start)}
        VolnoRender={volnoRender}
        CapRender={capRender}
        volno={(props?.aktualni_kapacita || 0) >= props.max_kapacita}
        demo={demo || false}
       />
      ) : (
       <div className="inline-flex gap-2">
        <Duplicate props={props} demo={demo || false} typUzivatele={typUzivatele} />
        <Zobrazit id={props.id} demo={demo || false} />
       </div>
      )}
     </div>
    </div>
   </CardFooter>
  </Card>
 )
}

function Duplicate({ demo, props }: tNodeProps) {
 const { setOpen, setFormData, setTerminID, setType } = useFormContext()
 return (
  <button
   className="dark:text-stone-50 dark:hover:text-stone-300 text-stone-950 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-600 dark:focus:ring-stone-400 focus:ring-opacity-50 rounded-full p-1"
   aria-label="Mails"
   onClick={() => {
    if (!demo) {
     setOpen(true)
     setFormData({
      _id: props.kod_predmet,
      cviceni: props.cislo_cviceni.toString(),
      nazev: props.jmeno,
      tema: props.popis,
      ucebna: props.ucebna,
      kapacita: props.max_kapacita,
      startDatum: new Date(props.datum_start),
      startCas: new Date(props.datum_start).toTimeString().slice(0, 5),
      konecDatum: new Date(props.datum_konec),
      konecCas: new Date(props.datum_konec).toTimeString().slice(0, 5),
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
