'use client'
import {
 AlertDialogContent,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogCancel,
 AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useFormContext } from '@/contexts/FormProvider'
import { useToast } from '@/hooks/use-toast'
import { createCSV } from '@/lib/functions'
import { tForm } from '@/lib/types'
import { tStudentPredmetuNaTerminu } from '@/types/next_response_types'
import { Check, Mails, Pencil, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { addStudentToTermin, deleteTermin, markAsCompleted, removeCompletion } from './actions'

export function Splnit({ osCislo, termin }: { osCislo: string; termin: string }) {
 const { toast } = useToast()
 const router = useRouter()

 const HandleCLick = async () => {
  const res = await markAsCompleted(osCislo, termin)
  router.refresh()
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
  }
 }

 return (
  <span className="text-green-500 cursor-pointer active:opacity-50" onClick={HandleCLick}>
   <Check className="w-6" />
  </span>
 )
}

export function Odebrat({ osCislo, termin }: { osCislo: string; termin: string }) {
 const { toast } = useToast()
 const router = useRouter()

 const HandleCLick = async () => {
  const res = await removeCompletion(osCislo, termin)
  router.refresh()
  if (!res.success) {
   if (res.error) console.error(res.error)
   toast({
    title: 'Neprošlo',
    description: res.message || 'Server nebyl schopný odebrat splnění',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Úspěch',
    description: 'Splnění termínu zapsáno',
   })
  }
  return
 }

 return (
  <span className="text-red-500 cursor-pointer active:opacity-50" onClick={HandleCLick}>
   <X className="w-6" />
  </span>
 )
}

export function TiskEmailu({
 studenti,
 kod,
 cviceni,
}: {
 studenti: tStudentPredmetuNaTerminu[] | undefined
 kod: string
 cviceni: number
}) {
 function PrintMails() {
  const mails: string[] = [] as string[]
  studenti?.forEach((student: tStudentPredmetuNaTerminu) => {
   mails.push(student.email)
  })
  const filename = `Studenti-${kod}-${cviceni}.csv`
  createCSV([mails], filename)
 }

 return (
  <button
   className="dark:text-stone-50 dark:hover:text-stone-300 text-stone-950 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-600 dark:focus:ring-stone-400 focus:ring-opacity-50 rounded-full p-1"
   aria-label="Mails"
   onClick={PrintMails}>
   <Mails className="w-6 h-6" aria-hidden="true" />
  </button>
 )
}

export function EditTerminu({
 storage,
}: {
 storage: {
  form: tForm
  terminId: string
 }
}) {
 const { setOpen, setFormData, setTerminID, setType } = useFormContext()
 return (
  <button
   className="text-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded-full p-1"
   aria-label="Edit"
   onClick={() => {
    setOpen(true)
    setFormData(storage.form)
    setTerminID(storage.terminId)
    setType('edit')
   }}>
   <Pencil className="w-6 h-6" aria-hidden="true" />
  </button>
 )
}

export function DeleteTerminu({ id }: { id: string }) {
 const { toast } = useToast()
 const router = useRouter()

 const HandleDelete = async () => {
  const res = await deleteTermin(id)
  router.push('/')
  if (!res.success) {
   if (res.error) console.error(res.error)
   toast({
    title: 'Neprošlo',
    description: res.message || 'Server nebyl schopný smazat termín',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Úspěch',
    description: 'Termín smazán',
   })
  }
  return
 }

 return (
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
     onClick={HandleDelete}
     className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800">
     Pokračovat
    </AlertDialogAction>
   </AlertDialogFooter>
  </AlertDialogContent>
 )
}

export function AddStudenta({ terminId }: { terminId: string }) {
 const { toast } = useToast()
 const router = useRouter()

 const HandleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  const studId = formData.get('stud_id')?.toString()
  const res = await addStudentToTermin(studId || '', terminId)
  if (!res.success) {
   console.error(res.message)
   toast({
    title: 'Neprošlo',
    description: res.message || 'Server nebyl schopný přidat studenta',
    variant: 'destructive',
   })
  } else {
   router.refresh()
   toast({
    title: 'Úspěch',
    description: 'Student přidán',
   })
  }
 }

 return (
  <AlertDialogContent>
   <form onSubmit={HandleSubmit}>
    <AlertDialogHeader>
     <AlertDialogTitle>Přídání studenta</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogDescription className="flex flex-col gap-2">
     <Label htmlFor="stud_id">Zadejte osobní číslo studenta</Label>
     <Input id="stud_id" name="stud_id" type="text" placeholder="např.: Fxxxxx" required />
    </AlertDialogDescription>
    <AlertDialogFooter className="mt-4">
     <AlertDialogCancel
      type="button"
      className="bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:text-black text-white hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-white">
      Zrušit
     </AlertDialogCancel>
     <AlertDialogAction
      type="submit"
      className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-800">
      Pokračovat
     </AlertDialogAction>
    </AlertDialogFooter>
   </form>
  </AlertDialogContent>
 )
}
