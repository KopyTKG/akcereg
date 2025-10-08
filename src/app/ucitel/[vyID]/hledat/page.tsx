import { Header } from '@/components/ui/header'
import { Divider } from '@/components/ui/divider'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { tGetStudentInfo } from '@/types/stag_response_types'
import { tPredmetHledat } from '@/types/next_response_types'
import { FormHledat, Uznat } from './csr'
import { prisma } from '@/prisma'
import { encodeId, getStudentInfo } from '@/lib/stag'
import { Get } from '@/app/actions'
import { decrypt } from '@/lib/crypto'

export default async function HledatPage({ searchParams }: { searchParams: { osCislo?: string } }) {
 const student = {} as tGetStudentInfo
 const predmety: tPredmetHledat[] = []

 const ticket = await Get('x-svt')
 if (!ticket) return
 const rawTicket = decrypt(ticket.value)
 if (!rawTicket) return

 const search = await searchParams
 const stud_id = search.osCislo

 if (stud_id) {
  const studentInfo = await getStudentInfo(rawTicket, stud_id)
  if (!studentInfo) return
  Object.assign(student, studentInfo)

  const predmetyStudenta = await prisma.predmet_student.findMany({
   where: { student_id: encodeId(stud_id) },
   select: { predmet: { select: { kod_predmetu: true, pocet_cviceni: true } } },
  })

  if (!predmetyStudenta || predmetyStudenta.length === 0) return

  await Promise.all(
   predmetyStudenta.map(async (p) => {
    const terminy = await prisma.historie_terminu.findMany({
     select: {
      datum_splneni: true,
      termin: { select: { kod_predmet: true, cislo_cviceni: true } },
     },
     where: {
      student_id: encodeId(stud_id),
      datum_splneni: { not: null },
      termin: { cislo_cviceni: -1, kod_predmet: p.predmet.kod_predmetu },
     },
     orderBy: { datum_splneni: 'desc' },
    })
    if (terminy.length > 0) {
     predmety.push({
      kod_predmetu: p.predmet.kod_predmetu,
      cviceni: [...Array(p.predmet.pocet_cviceni)].map(() => -1),
     })
    } else {
     const splnenyTerminy = await prisma.historie_terminu.findMany({
      select: {
       datum_splneni: true,
       termin: { select: { kod_predmet: true, cislo_cviceni: true } },
      },
      where: {
       student_id: encodeId(stud_id),
       datum_splneni: { not: null },
       termin: { cislo_cviceni: { not: -1 }, kod_predmet: p.predmet.kod_predmetu },
      },
      orderBy: { datum_splneni: 'desc' },
     })
     const cviceni = [...Array(p.predmet.pocet_cviceni)].map(() => 0)
     if (splnenyTerminy) {
      splnenyTerminy.forEach((t) => {
       if (t.termin.cislo_cviceni) {
        const index = t.termin.cislo_cviceni - 1
        if (t.datum_splneni) cviceni[index] = new Date(t.datum_splneni).getTime()
       }
      })
     }
     predmety.push({ kod_predmetu: p.predmet.kod_predmetu, cviceni })
    }
   }),
  )
 }

 return (
  <section className="w-full grid px-4 lg:px-0  lg:grid-cols-2 gap-4 min-h-[90svh]">
   <div className="flex flex-col w-full gap-10">
    <Header underline="fade">Hlednání studenta</Header>
    <FormHledat />
   </div>
   <div className="flex flex-col gap-10">
    <Header underline="fade">Student</Header>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead>Osobní číslo</TableHead>
       <TableHead>Jméno</TableHead>
       <TableHead>Příjmení</TableHead>
       <TableHead>Email</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {student && (
       <TableRow key={student.osCislo}>
        <TableCell className="font-medium">{student.osCislo}</TableCell>
        <TableCell>{student.jmeno}</TableCell>
        <TableCell>{student.prijmeni}</TableCell>
        <TableCell>{student.email}</TableCell>
       </TableRow>
      )}
     </TableBody>
    </Table>
    {predmety &&
     predmety.map((predmet: tPredmetHledat, key: number) => {
      return (
       <div className="mb-3" key={predmet.kod_predmetu}>
        <div className="w-full flex flex-row justify-between">
         <h3 className="font-bold text-xl ">{predmet.kod_predmetu}</h3>
         {predmet.cviceni.includes(0) ? (
          <Uznat predmet={predmet.kod_predmetu} osCislo={student.osCislo} />
         ) : null}
        </div>
        <div className="w-full h-max rounded-2xl flex flex-col dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-800 dark:shadow-neutral-950">
         {predmet.cviceni.map((datum: any, key: number) => {
          return (
           <>
            <div
             key={datum.toLocaleString() + key}
             className={`w-full h-full flex flex-row justify-between p-3 bg-gradient-to-l ${key === 0 ? `rounded-t-xl` : key === predmet.cviceni.length - 1 ? 'rounded-b-xl' : ''} ${!datum ? 'from-red-500/15 to-transparent' : 'from-lime-500/15 to-transparent'}`}>
             <span className="text-lg">{`Laboratorní cvičení ${key + 1}`}</span>
             <Chip type={datum === -1 ? 'success' : datum ? 'success' : 'danger'}>
              {datum === -1 ? 'Uznáno' : datum ? new Date(datum).toLocaleDateString() : 'nesplnil'}
             </Chip>
            </div>
            {key < predmet.cviceni.length - 1 && <Divider margin="my0" />}
           </>
          )
         })}
        </div>
        {key < predmety.length - 1 && <Divider margin="my4" variant="ghost" />}
       </div>
      )
     })}
   </div>
  </section>
 )
}
