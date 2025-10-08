import { Get } from '@/app/actions'
import { Header } from '@/components/ui/header'
import { decrypt } from '@/lib/crypto'
import { isAdmin } from '@/lib/functions'
import { getUserInfo } from '@/lib/stag'
import { prisma } from '@/prisma'
import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableBody,
 TableCell,
} from '@/components/ui/table'
import { tPredmet } from '@/types/next_response_types'
import { DeletePredmet, EditPredmet, PrintEmails } from './csr'

export default async function Page() {
 const ticket = await Get('x-svt')
 if (!ticket) return
 const rawTicket = decrypt(ticket.value)
 if (!rawTicket) return

 const userInfo = await getUserInfo(rawTicket)
 if (!userInfo) return

 const predmety = await prisma.predmet.findMany({
  where: {
   predmet_role: { some: { role: { ucitIdno: `${userInfo?.stagUserInfo[0].ucitIdno}` } } },
  },
  orderBy: { katedra: 'asc' },
 })

 return (
  <div className="w-max mx-auto flex flex-col items-center gap-2">
   <Header underline="fade" className="w-max">
    Předměty
   </Header>
   <Table>
    <TableHeader>
     <TableRow>
      <TableHead>Katedra</TableHead>
      <TableHead>Zkratka</TableHead>
      <TableHead>Počet cvičení</TableHead>
      <TableHead>Operace</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {predmety &&
      predmety.map((predmet: tPredmet) => (
       <TableRow key={predmet.kod_predmetu}>
        <TableCell>{predmet.katedra}</TableCell>
        <TableCell>{predmet.zkratka_predmetu}</TableCell>
        <TableCell align="center">{predmet.pocet_cviceni}</TableCell>
        <TableCell align="center">
         <div className="flex gap-1 items-center">
          <PrintEmails predmet={predmet} />
          {isAdmin(userInfo) && (
           <>
            <EditPredmet predmet={predmet} />
            <DeletePredmet predmet={predmet} />
           </>
          )}
         </div>
        </TableCell>
       </TableRow>
      ))}
    </TableBody>
   </Table>
  </div>
 )
}
