import {
 Calendar,
 Clock,
 Users,
 Book,
 FileText,
 Bookmark,
 Trash,
 Pencil,
 UserPlus,
 Mails,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fastHeaders } from '@/lib/stag'
import { tForm, tStudent, tTermin } from '@/lib/types'
import * as React from 'react'
import {
 AlertDialog,
 AlertDialogContent,
 AlertDialogTrigger,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogCancel,
 AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { FormCtx } from '@/contexts/FormProvider'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { ReloadCtx } from '@/contexts/ReloadProvider'
import { useToast } from '@/hooks/use-toast'

export default function TerminInfo({
 Termin,
 id,
 setNull,
 storage,
 studenti,
}: {
 Termin: tTermin
 id: string
 setNull: React.Dispatch<boolean>
 storage: { form: tForm; terminId: string }
 studenti?: tStudent[]
}) {
 const context = React.useContext(FormCtx)
 const Rcontext = React.useContext(ReloadCtx)

 const { toast } = useToast()

 if (!context || !Rcontext) {
  throw Error('Missing FormProvider or ReloadProvider')
 }
 const [reload, setReload] = Rcontext
 const { setOpen, setFormData, setTerminID, setType } = context

 const formatDate = (dateString: number) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('cs-CZ', {
   day: '2-digit',
   month: 'long',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
  }).format(date)
 }

 async function fetchDelete() {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
   url.searchParams.set('id', id)
   const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: fastHeaders,
    credentials: 'include',
   })
   if (!res.ok) {
    toast({
     title: 'Neprošlo',
     description: 'Server nebyl schopný zapsat studenta',
     variant: 'destructive',
    })
    console.error(res.statusText)
   } else {
    setNull(true)
   }
  } catch (e) {
   console.error(e)
  }
 }

 async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  try {
   e.preventDefault()
   const formData = new FormData(e.currentTarget)
   const studId = formData.get('stud_id')?.toString()
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/zapis`)
   url.searchParams.set('id_terminu', id)
   url.searchParams.set('id_stud', studId || '')
   const res = await fetch(url.toString(), {
    method: 'GET',
    headers: fastHeaders,
    credentials: 'include',
    redirect: 'manual',
   })
   if (!res.ok) {
    toast({
     title: 'Neprošlo',
     description: 'Server nebyl schopný zapsat studenta',
     variant: 'destructive',
    })
    console.error(res.statusText)
   } else {
    setReload(!reload)
   }
  } catch (e) {
   console.error(e)
  }
 }

 function PrintMails() {
  const mails: string[] = [] as string[]
  studenti?.forEach((student: tStudent) => {
   mails.push(student.email)
  })

  const file = new Blob([mails.join('\n')], { type: 'text/csv' })
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
  anchor.download = `Studenti-${Termin._id}-${Termin.cviceni}_${date}`
  anchor.click()
  URL.revokeObjectURL(fileURL)
 }

 return (
  <Card className="w-full mb-5 dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-700 dark:shadow-neutral-950">
   <CardHeader className="pb-2">
    <CardTitle className="text-2xl font-bold flex justify-between">
     <span className="flex gap-2 items-center">
      <Bookmark className="h-6 w-6 text-amber-400" aria-hidden="true" />
      {Termin?.nazev || 'Název předmětu'}
     </span>
     <span className="flex gap-2 items-center">
      <button
       className="dark:text-stone-50 dark:hover:text-stone-300 text-stone-950 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-600 dark:focus:ring-stone-400 focus:ring-opacity-50 rounded-full p-1"
       aria-label="Mails"
       onClick={PrintMails}>
       <Mails className="w-6 h-6" aria-hidden="true" />
      </button>
      <AlertDialog>
       <AlertDialogTrigger asChild>
        <button
         className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
         aria-label="Delete">
         <UserPlus className="w-6 h-6" aria-hidden="true" />
        </button>
       </AlertDialogTrigger>
       <AlertDialogContent>
        <form onSubmit={onSubmit}>
         <AlertDialogHeader>
          <AlertDialogTitle>Přídání studenta</AlertDialogTitle>
         </AlertDialogHeader>
         <AlertDialogDescription className="flex flex-col gap-2">
          <Label htmlFor="stud_id">Zadejte osobní číslo studenta</Label>
          <Input id="stud_id" name="stud_id" type="text" placeholder="např.: Fxxxxx" required />
         </AlertDialogDescription>
         <AlertDialogFooter>
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
      </AlertDialog>

      <button
       className="text-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded-full p-1"
       aria-label="Delete"
       onClick={() => {
        setOpen(true)
        setFormData(storage.form)
        setTerminID(storage.terminId)
        setType('edit')
       }}>
       <Pencil className="w-6 h-6" aria-hidden="true" />
      </button>

      <AlertDialog>
       <AlertDialogTrigger asChild>
        <button
         className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
         aria-label="Delete">
         <Trash className="w-6 h-6" aria-hidden="true" />
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
          onClick={() => fetchDelete()}
          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800">
          Pokračovat
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     </span>
    </CardTitle>
   </CardHeader>
   <CardContent className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
     <div className="flex items-center gap-2">
      <Book className="h-5 w-5 text-emerald-400" aria-hidden="true" />
      <span className="text-sm font-medium">Předmět:</span>
      <span className="font-bold">{Termin?._id || 'N/A'}</span>
     </div>
     <div className="flex items-center gap-2">
      <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
      <span className="text-sm font-medium">Cvičení:</span>
      <span className="font-bold">{Termin?.cviceni || 'N/A'}</span>
     </div>
    </div>
    <div className="flex items-center gap-2">
     <Users className="h-5 w-5 text-purple-400" aria-hidden="true" />
     <span className="text-sm font-medium">Kapacita:</span>
     <span className="font-bold">{Termin?.kapacita || 'N/A'}</span>
    </div>
    <div className="space-y-2">
     <h3 className="text-lg font-semibold flex items-center gap-2">
      <Calendar className="h-5 w-5 text-red-400" aria-hidden="true" />
      Termín
     </h3>
     <div className="grid grid-cols-2 gap-2 pl-7">
      <div className="flex items-center gap-2">
       <Clock className="h-4 w-4 text-green-400" aria-hidden="true" />
       <span className="text-sm">Začátek:</span>
       <span className="font-medium">{formatDate(Termin?.start)}</span>
      </div>
      <div className="flex items-center gap-2">
       <Clock className="h-4 w-4 text-orange-400" aria-hidden="true" />
       <span className="text-sm">Konec:</span>
       <span className="font-medium">{formatDate(Termin?.konec)}</span>
      </div>
     </div>
    </div>
    <div className="space-y-2">
     <h3 className="text-lg font-semibold flex items-center gap-2">
      <FileText className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      Popis
     </h3>
     <p className="text-sm dark:text-stone-300 pl-7">
      {Termin?.tema || 'Žádný popis není k dispozici.'}
     </p>
    </div>
   </CardContent>
  </Card>
 )
}
