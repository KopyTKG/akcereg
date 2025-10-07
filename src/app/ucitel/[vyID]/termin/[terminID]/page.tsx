'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, X } from 'lucide-react'
import { tForm } from '@/lib/types'
import { useState, useCallback, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import TerminInfo from '@/components/terminInfo'
import { toast } from '@/hooks/use-toast'
import { DefaultForm, DefaultPredmet, useFormContext } from '@/contexts/FormProvider'
import { fetchPredmetyData, Time } from '@/lib/functions'
import { Chip } from '@/components/ui/chip'
import { useReloadContext } from '@/contexts/ReloadProvider'
import {
 tStudentPredmetuNaTerminu,
 tTermin,
 tTerminGetBody,
 tPredmet,
} from '@/types/next_response_types'

const fetchTerminData = async (id: string) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/ucitel/termin`)
  url.searchParams.set('id', id)
  const res = await fetch(url.toString(), {
   method: 'GET',
   credentials: 'include',
  })
  if (!res.ok) {
   return null
  }
  return (await res.json()) as tTerminGetBody
 } catch (e) {
  console.error(e)
  return null
 }
}

export default function TerminPage(props: { params: Promise<{ terminID: string }> }) {
 const params = use(props.params)
 const [Termin, setTermin] = useState<tTermin>()
 const [storage, setStorage] = useState<{ form: tForm; terminId: string }>({
  form: DefaultForm,
  terminId: '',
 })
 const [Studenti, setStudenti] = useState<tStudentPredmetuNaTerminu[]>([])
 const [noData, setNull] = useState<boolean>(false)
 const [fetching, setFetching] = useState<boolean>(true)
 const router = useRouter()

 const { setPredmety, setPredmet } = useFormContext()
 const { reload, setReload } = useReloadContext()

 const fetchData = useCallback(async () => {
  const terminData = await fetchTerminData(params.terminID)
  const predmety = await fetchPredmetyData()
  if (terminData && predmety) {
   const termin = terminData.termin
   setTermin(termin)
   setStudenti(terminData.studenti)
   setPredmety(predmety.predmety)
   setPredmet(
    predmety.predmety.find((a: tPredmet) => a.kod_predmetu === termin.kod_predmet) ||
     DefaultPredmet,
   )
   setStorage({
    form: {
     _id: termin.kod_predmet,
     cviceni: termin.cislo_cviceni.toString(),
     nazev: termin.jmeno,
     tema: termin.popis,
     ucebna: termin.ucebna,
     kapacita: termin.max_kapacita,
     startDatum: new Date(termin.datum_start),
     startCas: Time(termin.datum_start),
     konecDatum: new Date(termin.datum_konec),
     konecCas: Time(termin.datum_konec),
     upozornit: true,
     vJmeno: '',
     vPrijmeni: '',
    },
    terminId: params.terminID,
   })
  } else {
   setNull(true)
  }
  setFetching(false)
 }, [params.terminID, setPredmety, setPredmet, reload])

 useEffect(() => {
  fetchData()
 }, [fetchData])

 useEffect(() => {
  if (noData) {
   router.push('/')
  }
 }, [noData, router])

 if (fetching) {
  return <Skeleton className="w-full h-[18rem] rounded-xl" />
 }

 if (noData) {
  return null
 }

 const sendStudent = async (osCislo: string, state: boolean) => {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/ucitel/termin/splnil`)
   url.searchParams.set('id_stud', osCislo)
   url.searchParams.set('id_terminu', params.terminID)
   const res = await fetch(url.toString(), {
    method: state ? 'DELETE' : 'POST',
    credentials: 'include',
   })
   if (!res.ok) {
    return null
   }
   setReload(!reload)
   toast({
    title: 'Úspěch',
    description: 'Splnění termínu zapsáno',
   })
  } catch (e) {
   console.error(e)
   return null
  }
 }

 return (
  <>
   <TerminInfo
    Termin={Termin || ({} as tTermin)}
    id={params.terminID}
    setNull={setNull}
    storage={storage}
    studenti={Studenti}
   />
   <Table>
    <TableHeader>
     <TableRow>
      <TableHead>Osobní číslo</TableHead>
      <TableHead>Jméno</TableHead>
      <TableHead>Příjmení</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>
       <div className="w-full flex justify-center items-center">Stav </div>
      </TableHead>
      <TableHead className="w-full flex justify-center items-center">Označit splnění</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {Studenti.map((student: tStudentPredmetuNaTerminu) => (
      <TableRow key={student.osCislo}>
       <TableCell className="font-medium">{student.osCislo}</TableCell>
       <TableCell>{student.jmeno}</TableCell>
       <TableCell>{student.prijmeni}</TableCell>
       <TableCell>{student.email}</TableCell>
       <TableCell>
        <div className="inline-flex justify-center w-full">
         {student.datum_splneni ? (
          <Chip type="success">Splněno</Chip>
         ) : (
          <Chip type="danger">Nesplněno</Chip>
         )}
        </div>
       </TableCell>
       <TableCell className="w-full justify-center inline-grid">
        {!student.datum_splneni ? (
         <span
          className="text-green-500 cursor-pointer active:opacity-50"
          onClick={() => sendStudent(student.osCislo, false)}>
          <Check className="w-6" />
         </span>
        ) : (
         <span
          className="text-red-500 cursor-pointer active:opacity-50"
          onClick={() => sendStudent(student.osCislo, true)}>
          <X className="w-6" />
         </span>
        )}
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
  </>
 )
}
