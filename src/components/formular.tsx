'use client'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Calendar as CalendarIcon, LoaderCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog'
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { tCreate } from '@/lib/types'
import { DateTime } from '@/lib/functions'
import { DefaultForm, DefaultPredmet, useFormContext } from '@/contexts/FormProvider'
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from './ui/accordion'
import { useReloadContext } from '@/contexts/ReloadProvider'
import { tPredmet } from '@/types/next_response_types'

const formSchema = z.object({
 _id: z.string().min(1, { message: 'Předmět je povinný' }),
 cviceni: z.string().optional(),
 nazev: z.string().optional(),
 tema: z.string().min(1, { message: 'Téma je povinné' }),
 ucebna: z.string().min(1, { message: 'Učebna je povinná' }),
 kapacita: z.number().min(1, { message: 'Kapacita musí být alespoň 1' }),
 startDatum: z.date({ required_error: 'Datum začátku je povinné' }),
 startCas: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 konecDatum: z.date({ required_error: 'Datum konce je povinné' }),
 konecCas: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 upozornit: z.boolean().default(true),
 vJmeno: z.string().optional(),
 vPrijmeni: z.string().optional(),
})

export default function Formular({ isAdmin }: { isAdmin: boolean }) {
 const { toast } = useToast()
 const [loading, setLoading] = useState<boolean>(false)

 const { reload, setReload } = useReloadContext()
 const { open, setOpen, predmety, formData, predmet, setPredmet, terminID, type } = useFormContext()

 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: DefaultForm,
  values: formData,
 })

 async function onSubmit(values: z.infer<typeof formSchema>) {
  setLoading(true)
  const body: tCreate = {
   _id: values._id,
   ucebna: values.ucebna,
   kapacita: values.kapacita,
   cviceni: parseInt(values.cviceni || '0'),
   nazev: values.nazev || '',
   tema: values.tema,
   start: DateTime(values.startDatum, values.startCas, 'Europe/Prague'),
   konec: DateTime(values.konecDatum, values.konecCas, 'Europe/Prague'),
   upzornit: values.upozornit,
   jmeno: values.vJmeno || '',
   prijmeni: values.vPrijmeni || '',
  }
  if (body.cviceni > 0) body.nazev = `${body._id} cvičení ${body.cviceni}`

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  if (terminID) {
   url.searchParams.set('id', terminID)
  }
  try {
   const res = await fetch(url.toString(), {
    method: terminID ? 'PATCH' : 'POST',
    credentials: 'include',
    body: JSON.stringify(body),
   })

   if (res.ok) {
    toast({
     title: 'Úspěch',
     description: 'Termín byl úspěšně vypsán',
    })
    setOpen(false)
    setReload(!reload)
    form.reset()
    if (values.upozornit) {
     const data = await res.json()
     const mails = data.mails
     if (mails.length > 0) {
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
      anchor.download = `${body._id}-${body.cviceni}_${date}`
      anchor.click()
      URL.revokeObjectURL(fileURL)
     }
    }
   } else {
    toast({
     variant: 'destructive',
     title: 'Problém',
     description: 'Něco se nepovedlo při vypisování',
    })
   }
  } catch (e: any) {
   console.error(e)
   toast({
    variant: 'destructive',
    title: 'Problém',
    description: 'Něco se nepovedlo při vypisování',
   })
  }
  setLoading(false)
 }
 const [konecDatumManuallySet, setKonecDatumManuallySet] = useState(false)

 const startDatum = useWatch({
  control: form.control,
  name: 'startDatum',
 })

 useEffect(() => {
  if (!konecDatumManuallySet) {
   form.setValue('konecDatum', startDatum)
  }
 }, [startDatum, form, konecDatumManuallySet])

 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className="sm:max-w-[425px] max-h-[53rem] h-dvh overflow-y-scroll">
    <DialogHeader>
     <DialogTitle>{type == 'create' ? 'Vytvořit novou' : 'Upravit'} událost</DialogTitle>
     <DialogDescription>
      Vyplňte detaily pro {type == 'create' ? 'vytvoření nové' : 'úpravu'} události. Po dokončení
      klikněte na uložit.
     </DialogDescription>
    </DialogHeader>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
       <FormField
        control={form.control}
        name="_id"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Předmět</FormLabel>
          <Select
           onValueChange={(value) => {
            field.onChange(value)
            setPredmet(predmety.find((p) => p.kod_predmetu === value) || DefaultPredmet)
           }}
           defaultValue={field.value}
           disabled={predmety.length === 0 || type != 'create'}>
           <FormControl>
            <SelectTrigger>
             <SelectValue placeholder="Vyberte předmět" />
            </SelectTrigger>
           </FormControl>
           <SelectContent>
            {predmety.length > 0 ? (
             predmety.map((subject: tPredmet) => (
              <SelectItem key={subject.kod_predmetu} value={subject.kod_predmetu}>
               {subject.kod_predmetu}
              </SelectItem>
             ))
            ) : (
             <SelectItem value="" disabled>
              Žádné předměty k dispozici
             </SelectItem>
            )}
           </SelectContent>
          </Select>
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
          <Select
           onValueChange={field.onChange}
           defaultValue={field.value}
           disabled={!predmet || predmet.pocet_cviceni === 0}>
           <FormControl>
            <SelectTrigger>
             <SelectValue placeholder="Vyberte cvičení" />
            </SelectTrigger>
           </FormControl>
           <SelectContent>
            {predmet && predmet.pocet_cviceni > 0 ? (
             Array.from({ length: predmet.pocet_cviceni }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
               Cvičení {i + 1}
              </SelectItem>
             ))
            ) : (
             <SelectItem value="1" disabled>
              {predmet ? 'Žádná cvičení k dispozici' : 'Nejprve vyberte předmět'}
             </SelectItem>
            )}
           </SelectContent>
          </Select>
          <FormMessage />
         </FormItem>
        )}
       />
      </div>
      <FormField
       control={form.control}
       name="nazev"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Název události</FormLabel>
         <FormControl>
          <Input
           disabled={!predmet || predmet.pocet_cviceni > 0 ? true : false}
           placeholder="Prezentace"
           {...field}
          />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <FormField
       control={form.control}
       name="tema"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Téma</FormLabel>
         <FormControl>
          <Input placeholder="Stavba PC" {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <div className="flex space-x-4">
       <FormField
        control={form.control}
        name="ucebna"
        render={({ field }) => (
         <FormItem className="flex-1">
          <FormLabel>Učebna</FormLabel>
          <FormControl>
           <Input placeholder="CP-1.03" {...field} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <FormField
        control={form.control}
        name="kapacita"
        render={({ field }) => (
         <FormItem className="flex-1">
          <FormLabel>Kapacita</FormLabel>
          <FormControl>
           <Input
            type="number"
            placeholder="20"
            {...field}
            onChange={(e) => field.onChange(+e.target.value)}
           />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
      </div>
      <div className="space-y-4">
       <div className="flex space-x-4">
        <FormField
         control={form.control}
         name="startDatum"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Datum začátku</FormLabel>
           <Popover>
            <PopoverTrigger asChild>
             <FormControl>
              <Button
               variant={'outline'}
               className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
               )}>
               {field.value ? (
                format(field.value, 'PPP', { locale: cs })
               ) : (
                <span>Vyberte datum</span>
               )}
               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
             </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
             <div className="p-3">
              <Calendar
               mode="single"
               className="z-50"
               selected={field.value}
               onSelect={(date) => {
                setKonecDatumManuallySet(false)
                field.onChange(date)
               }}
               disabled={(date) => date > new Date('2100-01-01')}
              />
             </div>
            </PopoverContent>
           </Popover>
           <FormMessage />
          </FormItem>
         )}
        />
        <FormField
         control={form.control}
         name="startCas"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Čas začátku</FormLabel>
           <FormControl>
            <div className="flex">
             <Input type="time" {...field} />
            </div>
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />
       </div>
       <div className="flex space-x-4">
        <FormField
         control={form.control}
         name="konecDatum"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Datum konce</FormLabel>
           <Popover>
            <PopoverTrigger asChild>
             <FormControl>
              <Button
               variant={'outline'}
               className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
               )}>
               {field.value ? (
                format(field.value, 'PPP', { locale: cs })
               ) : (
                <span>Vyberte datum</span>
               )}
               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
             </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[1000]" align="start">
             <Calendar
              mode="single"
              className="z-50"
              selected={field.value}
              onSelect={(date) => {
               setKonecDatumManuallySet(true)
               field.onChange(date)
              }}
              disabled={(date) =>
               date < form.getValues().startDatum || date > new Date('2100-01-01')
              }
             />
            </PopoverContent>
           </Popover>
           <FormMessage />
          </FormItem>
         )}
        />
        <FormField
         control={form.control}
         name="konecCas"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Čas konce</FormLabel>
           <FormControl>
            <div className="flex">
             <Input type="time" {...field} />
            </div>
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />
       </div>
      </div>
      {isAdmin ? (
       <div className="w-full">
        <Accordion type="single" collapsible>
         <AccordionItem value="item-1">
          <AccordionTrigger>Vypisuji za někoho</AccordionTrigger>
          <AccordionContent className="flex flex-row gap-5">
           <FormField
            control={form.control}
            name="vJmeno"
            render={({ field }) => (
             <FormItem className="flex-1">
              <FormLabel>Jméno</FormLabel>
              <FormControl>
               <Input placeholder="Karel" {...field} />
              </FormControl>
              <FormMessage />
             </FormItem>
            )}
           />
           <FormField
            control={form.control}
            name="vPrijmeni"
            render={({ field }) => (
             <FormItem className="flex-1">
              <FormLabel>Příjmení</FormLabel>
              <FormControl>
               <Input placeholder="Pádlo" {...field} />
              </FormControl>
              <FormMessage />
             </FormItem>
            )}
           />
          </AccordionContent>
         </AccordionItem>
        </Accordion>
       </div>
      ) : null}
      <FormField
       control={form.control}
       name="upozornit"
       render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
         <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
         </FormControl>
         <div className="space-y-1 leading-none">
          <FormLabel>Upozornit studenty</FormLabel>
          <FormDescription>
           Odeslat upozornění všem zapsaným studentům o této události.
          </FormDescription>
         </div>
        </FormItem>
       )}
      />
      <DialogFooter>
       <Button type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <>Uložit</>}
       </Button>
      </DialogFooter>
     </form>
    </Form>
   </DialogContent>
  </Dialog>
 )
}
