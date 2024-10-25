'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Get } from '@/app/actions'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Check } from 'lucide-react'
import { fastHeaders } from '@/lib/stag'
import { tForm, tPredmet, tStudent, tTermin } from '@/lib/types'
import React, { useState, useCallback, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import TerminInfo from '@/components/terminInfo'
import { toast } from '@/hooks/use-toast'
import { DefaultForm, DefaultPredmet, FormCtx } from '@/contexts/FormProvider'
import { fetchPredmetyData } from '@/lib/functions'
import { Time } from '@/lib/functions'
import { ReloadCtx } from '@/contexts/ReloadProvider'
import { Chip } from '@/components/ui/chip'

const fetchTerminData = async (id: string) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  url.searchParams.set('id', id)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return null
  }
  return await res.json()
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
 const [Studenti, setStudenti] = useState<tStudent[]>([])
 const [noData, setNull] = useState<boolean>(false)
 const [fetching, setFetching] = useState<boolean>(true)
 const router = useRouter()

 const context = React.useContext(FormCtx)
 const Rcontext = React.useContext(ReloadCtx)

 if (!context || !Rcontext) {
  throw Error('Missing FormProvider or ReloadProvider')
 }

 const { setPredmety, setPredmet } = context
 const [reload, setReload] = Rcontext

 const fetchData = useCallback(async () => {
  const terminData = await fetchTerminData(params.terminID)
  const predmety = await fetchPredmetyData()
  if (terminData && predmety) {
   const termin = terminData.termin as tTermin
   setTermin(termin)
   setStudenti(terminData.studenti)
   setPredmety(predmety)
   setPredmet(predmety.find((a: tPredmet) => a._id === termin._id) || DefaultPredmet)
   setStorage({
    form: {
     _id: termin._id,
     cviceni: termin.cviceni.toString(),
     nazev: termin.nazev,
     tema: termin.tema,
     ucebna: termin.ucebna,
     kapacita: termin.kapacita,
     startDatum: new Date(termin.start),
     startCas: Time(termin.start),
     konecDatum: new Date(termin.konec),
     konecCas: Time(termin.konec),
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

 const sendStudent = async (osCislo: string) => {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/splnil`)
   const cookie = await Get('stagUserTicket')
   if (cookie) {
    url.searchParams.set('ticket', cookie.value)
   }
   url.searchParams.set('id_stud', osCislo)
   url.searchParams.set('id_terminu', params.terminID)
   const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
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
     {Studenti.map((student: tStudent) => (
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
          onClick={() => sendStudent(student.osCislo)}
         >
          <Check className="w-6" />
         </span>
        ) : (
         <></>
        )}
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
  </>
 )
}
