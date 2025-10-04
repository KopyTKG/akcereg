'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
 Dialog,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog'
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useAdminContext } from '@/contexts/AdminProvider'
import { useReloadContext } from '@/contexts/ReloadProvider'

const predmetSchema = z.object({
 zkratka: z.string().min(1, { message: 'Zkratka předmětu je povinná' }),
 katedra: z.string().min(1, { message: 'Katedra předmětu je povinná' }),
 cviceni: z.number().min(1, { message: 'Počet cvičení je povinný' }),
 kod: z.string().optional(),
})

export default function PredmetForm() {
 const { toast } = useToast()
 const [loading, setLoading] = useState<boolean>(false)

 const { open, setOpen, storage } = useAdminContext()
 const [reload, setReload] = useReloadContext()

 const form = useForm<z.infer<typeof predmetSchema>>({
  resolver: zodResolver(predmetSchema),
  values: storage,
 })

 async function onSubmit(values: z.infer<typeof predmetSchema>) {
  setLoading(true)
  const body: { zkratka: string; katedra: string; cviceni: number } = {
   zkratka: values.zkratka,
   katedra: values.katedra,
   cviceni: values.cviceni,
  }

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmet`)
  if (values.kod) {
   url.searchParams.set('kod_predmetu', values.kod)
  }
  try {
   const res = await fetch(url.toString(), {
    method: values.kod ? 'PATCH' : 'POST',
    credentials: 'include',
    body: JSON.stringify(body),
   })

   if (res.ok) {
    toast({
     title: 'Úspěch',
     description: `Předmět byl úspěšně ${values.kod ? 'upraven' : 'vypsán'}`,
    })
    setOpen(false)
    setReload(!reload)
    form.reset()
   } else {
    toast({
     variant: 'destructive',
     title: 'Problém',
     description: 'Něco se nepovedlo',
    })
   }
  } catch (e: any) {
   console.error(e)
   toast({
    variant: 'destructive',
    title: 'Problém',
    description: 'Něco se nepovedlo',
   })
  }
  setLoading(false)
 }

 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>Předmět</DialogTitle>
    </DialogHeader>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
       <FormField
        control={form.control}
        name="katedra"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Katedra</FormLabel>
          <FormControl>
           <Input placeholder="KI" {...field} disabled={storage.kod ? true : false} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <FormField
        control={form.control}
        name="zkratka"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Zkratka</FormLabel>
          <FormControl>
           <Input placeholder="PCA" {...field} disabled={storage.kod ? true : false} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <FormField
        control={form.control}
        name="cviceni"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Cvičení</FormLabel>
          <FormControl>
           <Input
            type="number"
            placeholder="3"
            {...field}
            onChange={(e) => field.onChange(+e.target.value)}
            max={5}
            min={0}
           />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
      </div>
      <DialogFooter>
       <Button type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <>Uložit</>}
       </Button>
      </DialogFooter>
     </form>
    </Form>
   </DialogContent>
  </Dialog>
 )
}
