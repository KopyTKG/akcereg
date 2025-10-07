'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableBody,
 TableCell,
} from '@/components/ui/table'
import { useReloadContext } from '@/contexts/ReloadProvider'
import { tPredmetBody } from '@/lib/types'
import { FileInput, LoaderCircle, Pencil, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAdminContext } from '@/contexts/AdminProvider'
import { useToast } from '@/hooks/use-toast'
import { tPredmet, tStudentiBody } from '@/types/next_response_types'
import { fetchPredmetyData } from '@/lib/functions'
import { tStudentPredmetu } from '@/types/stag_response_types'

export default function Predmety({ isAdmin }: { isAdmin: boolean }) {
 const [Predmety, setPredmety] = useState<tPredmet[]>([])

 const { reload } = useReloadContext()

 const fetchPredmety = useCallback(async () => {
  const data = await fetchPredmetyData()
  if (data) {
   setPredmety(data.predmety)
  }
 }, [reload])

 useEffect(() => {
  fetchPredmety()
 }, [fetchPredmety])

 return (
  <Table>
   <TableHeader>
    <TableRow>
     <TableHead>Katedra</TableHead>
     <TableHead>Zkratka</TableHead>
     <TableHead>Počet cvičení</TableHead>
     <TableHead>Operace</TableHead>
    </TableRow>
   </TableHeader>
   <TableBody>
    {Predmety
     ? Predmety.map((predmet: tPredmet) => (
        <TableRow key={predmet.kod_predmetu}>
         <TableCell>{predmet.katedra}</TableCell>
         <TableCell>{predmet.zkratka_predmetu}</TableCell>
         <TableCell align="center">{predmet.pocet_cviceni}</TableCell>
         <TableCell align="center">
          <div className="flex gap-1 items-center">
           <ToolkitUcitel predmet={predmet} />
           {isAdmin && <ToolkitAdmin predmet={predmet} />}
          </div>
         </TableCell>
        </TableRow>
       ))
     : null}
   </TableBody>
  </Table>
 )
}

function ToolkitUcitel({ predmet }: { predmet: tPredmet }) {
 const [loading, setLoading] = useState<boolean>(false)
 async function PrintStudnets() {
  setLoading(true)
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/ucitel/predmety/studenti`)
  url.searchParams.set('kod_predmetu', predmet.kod_predmetu)

  const res = await fetch(url.toString(), {
   method: 'GET',
   credentials: 'include',
  })
  if (!res.ok) throw new Error('fetch failed')

  const data = (await res.json()) as tStudentiBody
  if (!data) throw new Error('missing data')

  const kod = data.kod
  const studenti = data.studenti

  const csv: string[][] = [] as string[][]
  csv.push(['osCislo', 'titulPred', 'jmeno', 'prijmeni', 'titulZa', 'email'])
  studenti?.forEach((student: tStudentPredmetu) => {
   const tmp = [
    student.osCislo || '',
    student.titulPred || '',
    student.jmeno || '',
    student.prijmeni || '',
    student.titulZa || '',
    student.email || '',
   ]
   csv.push(tmp)
  })

  const file = new Blob([csv.join('\n')], { type: 'text/csv' })
  const fileURL = URL.createObjectURL(file)

  const anchor = document.createElement('a')
  anchor.href = fileURL
  const date = new Date(Date.now())
   .toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
   })
   .replace(',', '')
   .replace(/:/g, '-')
   .replace(/\//g, '-')
   .replace(' ', '_')
  anchor.download = `UspesniStudenti-${kod}_${date}`
  anchor.click()
  URL.revokeObjectURL(fileURL)
  setLoading(false)
 }

 return (
  <div>
   <button
    className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
    aria-label="Edit"
    onClick={PrintStudnets}>
    {loading ? (
     <LoaderCircle className="animate-spin w-5 h-5" />
    ) : (
     <FileInput className="w-5 h-5" aria-hidden="true" />
    )}
   </button>
  </div>
 )
}

function ToolkitAdmin({ predmet }: { predmet: tPredmet }) {
 const { toast } = useToast()
 const { open, setOpen, setStorage } = useAdminContext()
 const { reload, setReload } = useReloadContext()

 async function onDelete(kod: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/katedra/predmet`)
  kod ? url.searchParams.set('kod_predmetu', kod) : url.searchParams.set('kod_predmetu', '')

  const res = await fetch(url.toString(), {
   method: 'DELETE',
   credentials: 'include',
  })
  if (!res.ok) {
   toast({
    title: 'Něco se nepovedlo',
    description: 'Nastala chyba při mazání předmětu',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Povedlo se',
    description: 'Mazání předmětu dokončeno',
   })
   setReload(!reload)
  }
 }

 return (
  <>
   <button
    className="text-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded-full p-1"
    aria-label="Edit"
    onClick={() => {
     setOpen(!open)
     setStorage({
      kod: predmet.kod_predmetu,
      zkratka: predmet.zkratka_predmetu,
      katedra: predmet.katedra,
      cviceni: predmet.pocet_cviceni,
     } as tPredmetBody)
    }}>
    <Pencil className="w-5 h-5" aria-hidden="true" />
   </button>
   <AlertDialog>
    <AlertDialogTrigger asChild>
     <button
      className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
      aria-label="Delete">
      <Trash className="w-5 h-5" aria-hidden="true" />
     </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="dark:bg-zinc-950 dark:text-white text-black border dark:border-zinc-900 shadow-md">
     <AlertDialogHeader>
      <AlertDialogTitle>Jste si jisti?</AlertDialogTitle>
      <AlertDialogDescription className="font-medium">
       Tuto akci nelze vrátit zpět. Trvale to odstraní tento termín z našich serverů.
      </AlertDialogDescription>
     </AlertDialogHeader>
     <AlertDialogFooter>
      <AlertDialogCancel className="bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:text-black text-white hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-white">
       Zrušit
      </AlertDialogCancel>
      <AlertDialogAction
       onClick={() => onDelete(predmet.kod_predmetu)}
       className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800">
       Pokračovat
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>
  </>
 )
}
