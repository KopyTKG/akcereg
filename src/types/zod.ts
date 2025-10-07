import * as z from 'zod'

// Creation form for course (termin)
export const ZodFormTermin = z.object({
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
