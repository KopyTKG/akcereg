'use client'
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { markAsCompletedCourse } from './actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function Uznat({ predmet, osCislo }: { predmet: string; osCislo: string }) {
 const { toast } = useToast()
 const router = useRouter()
 const HandleCLick = async () => {
  const res = await markAsCompletedCourse(osCislo, predmet)
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
   router.refresh()
  }
 }

 return (
  <Button
   variant="ghost"
   size="sm"
   className="text-xl font-bold text-green-500"
   onClick={HandleCLick}>
   <Check className="w-8" />
  </Button>
 )
}

const formSchema = z.object({
 id_stud: z.string().min(6, { message: 'osČíslo je povinný' }),
})

export function FormHledat() {
 const router = useRouter()

 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { id_stud: '' },
 })

 const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  router.push(`?osCislo=${values.id_stud}`)
 }

 return (
  <Form {...form}>
   <form className="w-max mx-auto" onSubmit={form.handleSubmit(handleSubmit)}>
    <FormItem className="flex flex-row gap-4">
     <FormField
      control={form.control}
      name="id_stud"
      render={({ field }) => (
       <FormItem className="flex flex-col">
        <FormLabel className="text-xl">Zadejte osobní číslo studenta</FormLabel>
        <FormControl>
         <Input placeholder="např.: Fxxxxx" {...field} />
        </FormControl>
        <FormMessage />
       </FormItem>
      )}
     />
     <Button className="self-end" type="submit">
      Vyhledat
     </Button>
    </FormItem>
   </form>
  </Form>
 )
}
