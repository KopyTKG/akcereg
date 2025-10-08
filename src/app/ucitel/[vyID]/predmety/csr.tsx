'use client'
import { tPredmet } from '@/types/next_response_types'
import { FileInput, Pencil } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { deletePredmet, getCompletedEmails } from './actions'
import { createCSV, createDateString } from '@/lib/functions'
import { tPredmetBody } from '@/lib/types'
import { useAdminContext } from '@/contexts/AdminProvider'
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
import { Trash } from 'lucide-react'

export function PrintEmails({ predmet }: { predmet: tPredmet }) {
 const { toast } = useToast()
 const HandleCLick = async () => {
  const res = await getCompletedEmails(predmet.kod_predmetu || '')

  if (!res.success) {
   if (res.error) console.error(res.error)
   return toast({
    title: 'Neprošlo',
    description: res.message || 'Server nebyl schopný zapsat splnění',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Úspěch',
    description: 'Splnění termínu zapsáno',
   })
   const date = createDateString()
   const filename = `UspesniStudenti-${predmet.kod_predmetu}_${date}.csv`
   createCSV(res.data, filename)
  }
 }
 return (
  <button
   className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
   aria-label="Edit"
   onClick={HandleCLick}>
   <FileInput className="w-5 h-5" aria-hidden="true" />
  </button>
 )
}

export function EditPredmet({ predmet }: { predmet: tPredmet }) {
 const { open, setOpen, setStorage } = useAdminContext()
 return (
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
 )
}

export function DeletePredmet({ predmet }: { predmet: tPredmet }) {
 const { toast } = useToast()
 const router = useRouter()

 const HandleCLick = async () => {
  const res = await deletePredmet(predmet.kod_predmetu || '')

  if (!res.success) {
   if (res.error) console.error(res.error)
   return toast({
    title: 'Neprošlo',
    description: res.message || 'Server nebyl schopný smazat předmět',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Úspěch',
    description: 'Předmět smazán',
   })
   router.refresh()
  }
 }

 return (
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
      onClick={HandleCLick}
      className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800">
      Pokračovat
     </AlertDialogAction>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 )
}

export function PredmetForm({})
