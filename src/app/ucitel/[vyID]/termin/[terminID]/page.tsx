import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Calendar, Clock, Users, Book, FileText, Bookmark, Trash, UserPlus } from 'lucide-react'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Get } from '@/app/actions'
import { decrypt } from '@/lib/crypto'
import { encodeId, getStudentiByPredmet } from '@/lib/stag'
import { prisma } from '@/prisma'
import { tStudentPredmetuNaTerminu } from '@/types/next_response_types'
import { tStudentPredmetu } from '@/types/stag_response_types'
import { AddStudenta, DeleteTerminu, EditTerminu, Odebrat, Splnit, TiskEmailu } from './csr'
import { tForm } from '@/lib/types'
import { Time } from '@/lib/functions'

type tTerminWithHistorie = {
 id: string
 ucebna: string | null
 datum_start: Date | null
 aktualni_kapacita: number | null
 max_kapacita: number | null
 kod_predmet: string | null
 jmeno: string | null
 cislo_cviceni: number | null
 datum_konec: Date | null
 popis: string | null
 vypsal_id: string | null
 historie_terminu: tHistorieWithStudent[]
}

type tHistorieWithStudent = {
 id: string
 student_id: string
 termin_id: string
 datum_splneni: Date | null
 student: {
  id: string
  datum_vytvoreni: Date
 }
}

export default async function TerminPage({ params }: { params: { terminID: string } }) {
 const { terminID } = await params

 const ticket = await Get('x-svt')
 if (!ticket) return
 const rawTicket = decrypt(ticket.value)
 if (!rawTicket) return

 const termin = await prisma.termin.findUnique({
  where: { id: terminID },
  include: {
   historie_terminu: {
    include: { student: true },
   },
  },
 })

 const studenti = await getStudentiByPredmet(
  rawTicket,
  termin?.kod_predmet.split('/')[1] || '',
  termin?.kod_predmet.split('/')[0] || '',
 )

 if (!termin) return <div>Termin not found</div>

 const renderData: {
  termin: tTerminWithHistorie
  studenti: tStudentPredmetuNaTerminu[]
 } = { termin: termin, studenti: [] }

 if (studenti && studenti.studentPredmetu.length > 0) {
  for (let s of termin.historie_terminu) {
   s = s as tHistorieWithStudent
   for (let st of studenti.studentPredmetu) {
    st = st as tStudentPredmetu
    if (s.student_id === encodeId(st.osCislo)) {
     renderData.studenti.push({ ...st, datum_splneni: s.datum_splneni })
     break
    }
   }
  }
 }

 const formatDate = (dateString: Date) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('cs-CZ', {
   day: '2-digit',
   month: 'long',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
  }).format(date)
 }

 if (
  !renderData.termin ||
  renderData.termin.datum_start === null ||
  renderData.termin.datum_konec === null
 )
  return <div>Termin not found</div>
 else
  return (
   <>
    <Card className="w-full mb-5 dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-700 dark:shadow-neutral-950">
     <CardHeader className="pb-2">
      <CardTitle className="text-2xl font-bold flex justify-between">
       <span className="flex gap-2 items-center">
        <Bookmark className="h-6 w-6 text-amber-400" aria-hidden="true" />
        {renderData.termin.jmeno || 'Název předmětu'}
       </span>
       <span className="flex gap-2 items-center">
        <TiskEmailu
         studenti={renderData.studenti}
         kod={renderData.termin.kod_predmet || ''}
         cviceni={renderData.termin.cislo_cviceni || 0}
        />
        <AlertDialog>
         <AlertDialogTrigger asChild>
          <button
           className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
           aria-label="Delete">
           <UserPlus className="w-6 h-6" aria-hidden="true" />
          </button>
         </AlertDialogTrigger>
         <AddStudenta terminId={renderData.termin.id} />
        </AlertDialog>

        <EditTerminu
         storage={{
          form: {
           _id: renderData.termin.kod_predmet,
           cviceni: `${renderData.termin.cislo_cviceni}`,
           nazev: renderData.termin.jmeno,
           tema: renderData.termin.popis,
           ucebna: renderData.termin.ucebna,
           kapacita: renderData.termin.max_kapacita,
           startDatum: new Date(`${renderData.termin.datum_start}`),
           startCas: Time(renderData.termin.datum_start),
           konecDatum: new Date(`${renderData.termin.datum_konec}`),
           konecCas: Time(renderData.termin.datum_konec),
           upozornit: true,
           vJmeno: '',
           vPrijmeni: '',
          } as tForm,
          terminId: terminID,
         }}
        />

        <AlertDialog>
         <AlertDialogTrigger asChild>
          <button
           className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
           aria-label="Delete">
           <Trash className="w-6 h-6" aria-hidden="true" />
          </button>
         </AlertDialogTrigger>
         <DeleteTerminu id={terminID} />
        </AlertDialog>
       </span>
      </CardTitle>
     </CardHeader>
     <CardContent className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
       <div className="flex items-center gap-2">
        <Book className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        <span className="text-sm font-medium">Předmět:</span>
        <span className="font-bold">{renderData.termin.kod_predmet || 'N/A'}</span>
       </div>
       <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
        <span className="text-sm font-medium">Cvičení:</span>
        <span className="font-bold">{renderData.termin.cislo_cviceni || 'N/A'}</span>
       </div>
      </div>
      <div className="flex items-center gap-2">
       <Users className="h-5 w-5 text-purple-400" aria-hidden="true" />
       <span className="text-sm font-medium">Kapacita:</span>
       <span className="font-bold">{renderData.termin.max_kapacita || 'N/A'}</span>
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
         <span className="font-medium">{formatDate(renderData.termin.datum_start)}</span>
        </div>
        <div className="flex items-center gap-2">
         <Clock className="h-4 w-4 text-orange-400" aria-hidden="true" />
         <span className="text-sm">Konec:</span>
         <span className="font-medium">{formatDate(renderData.termin.datum_konec)}</span>
        </div>
       </div>
      </div>
      <div className="space-y-2">
       <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        Popis
       </h3>
       <p className="text-sm dark:text-stone-300 pl-7">
        {renderData.termin.popis || 'Žádný popis není k dispozici.'}
       </p>
      </div>
     </CardContent>
    </Card>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead>Osobní číslo</TableHead>
       <TableHead>Jméno</TableHead>
       <TableHead>Příjmení</TableHead>
       <TableHead>Email</TableHead>
       <TableHead>
        <div className="w-full flex justify-center items-center">Stav </div>
       </TableHead>
       <TableHead className="w-full flex justify-center items-center">Označit splnění</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {renderData.studenti.map((student: tStudentPredmetuNaTerminu) => (
       <TableRow key={student.osCislo}>
        <TableCell className="font-medium">{student.osCislo}</TableCell>
        <TableCell>{student.jmeno}</TableCell>
        <TableCell>{student.prijmeni}</TableCell>
        <TableCell>{student.email}</TableCell>
        <TableCell>
         <div className="inline-flex justify-center w-full">
          {student.datum_splneni ? (
           <Chip type="success">Splněno</Chip>
          ) : (
           <Chip type="danger">Nesplněno</Chip>
          )}
         </div>
        </TableCell>
        <TableCell className="w-full justify-center inline-grid">
         {!student.datum_splneni ? (
          <Splnit osCislo={student.osCislo} termin={terminID} />
         ) : (
          <Odebrat osCislo={student.osCislo} termin={terminID} />
         )}
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </>
  )
}
