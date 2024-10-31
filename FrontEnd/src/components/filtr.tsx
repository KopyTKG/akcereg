'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useContext, useEffect, useState } from 'react'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { tPredmet } from '@/lib/types'
import { Header } from './ui/header'
import { FilterCtx } from '@/contexts/FilterProvider'
import { Accordion, AccordionContent, AccordionTrigger } from './ui/accordion'
import { AccordionItem } from '@radix-ui/react-accordion'

async function fetchPredmetyData() {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const ticket = (await Get('stagUserTicket'))?.value || ''
  url.searchParams.set('ticket', ticket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   throw new Error(`Failed to fetch: ${res.statusText}`)
  }
  return await res.json()
 } catch (error) {
  console.error('Error fetching predmety:', error)
  throw error
 }
}

const FormSchema = z.object({
 items: z.array(z.string()).default([]),
 all: z.boolean().optional(),
})

export default function Filtr() {
 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [isLoading, setIsLoading] = useState(true)

 const Fcontext = useContext(FilterCtx)
 if (!Fcontext) {
  throw new Error('Missing FilterProvider')
 }

 const { filter, setFilter, all, setAll } = Fcontext

 useEffect(() => {
  async function loadPredmety() {
   try {
    setIsLoading(true)
    const data = (await fetchPredmetyData())?.predmety
    setPredmety(data)
   } catch (e) {
    console.error(e)
   } finally {
    setIsLoading(false)
   }
  }
  loadPredmety()
 }, [])

 const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
   items: filter,
  },
 })

 function onSubmit(data: z.infer<typeof FormSchema>) {
  setFilter(data.items)
 }

 return (
  <div className=" w-[12rem] flex flex-col gap-2 col-start-1 col-span-1 h-full border-r-1 border-l-1 border-stone-700/55 px-2">
   <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
     <FormField
      control={form.control}
      name="items"
      render={() => (
       <FormItem className="w-full flex flex-col">
        <FormLabel>
         <Header type="h3" thickness="medium" className="w-full text-center mb-[-0.75rem]">
          Předměty
         </Header>
        </FormLabel>
        <FormDescription>Filtrování podle předmětu</FormDescription>
        {isLoading && (
         <>
          <Skeleton className="w-full h-6 rounded-xl" />
          <Skeleton className="w-full h-6 rounded-xl" />
          <Skeleton className="w-full h-6 rounded-xl" />
         </>
        )}
        {!isLoading &&
         predmety.map((item) => (
          <FormField
           key={item._id}
           control={form.control}
           name="items"
           render={({ field }) => {
            return (
             <FormItem key={item._id} className="flex items-start space-x-3 space-y-0 ml-5">
              <FormControl>
               <Checkbox
                checked={field.value?.includes(item._id)}
                onCheckedChange={(checked) => {
                 const updatedValue = checked
                  ? [...field.value, item._id]
                  : field.value?.filter((value) => value !== item._id)
                 field.onChange(updatedValue)
                }}
               />
              </FormControl>
              <FormLabel className="font-normal">{item.nazev}</FormLabel>
             </FormItem>
            )
           }}
          />
         ))}
        <FormMessage />
        <Button type="submit" className="mt-4">
         Potvrdit
        </Button>
        <FormField
         control={form.control}
         name="all"
         render={() => {
          return (
           <FormItem className="flex items-start space-x-3 space-y-0 w-full">
            <Accordion type="single" collapsible className="w-full">
             <AccordionItem value="item-1">
              <AccordionTrigger>Nastavení</AccordionTrigger>
              <AccordionContent className="ml-5 flex gap-3">
               <FormControl>
                <Checkbox
                 checked={all}
                 onCheckedChange={() => {
                  setAll(!all)
                 }}
                />
               </FormControl>
               <FormLabel className="font-normal">Zobrazit proběhlé</FormLabel>
              </AccordionContent>
             </AccordionItem>
            </Accordion>
           </FormItem>
          )
         }}
        />
       </FormItem>
      )}
     />
    </form>
   </Form>
  </div>
 )
}
