import Node from '@/components/node'
import Predmet from '@/components/tabulkaPredmet'
import { Chip } from '@/components/ui/chip'
import { Header } from '@/components/ui/header'
import { addDays, addHours } from '@/lib/functions'
import { tNode, tPredmetSekce } from '@/lib/types'

export default function NavodSt() {
 return (
  <section className="flex flex-row">
   <main className="flex flex-col gap-10 w-full">
    <section>
     <Header underline="fade">Domovská stránka</Header>
     Stránka <span className="font-semibold">Domů</span> obsahuje seznam všech dostupných termínů.
     <br />
     <span className="text-red-800 dark:text-red-400">
      Upozornění: Po zápisu na termín předmětu se již nebudou zobrazovat termíny stejného typu
     </span>
     <Header type="h2" underline="fade" className="w-max">
      Volný termín
     </Header>
     <section className="pl-5 py-4">
      <Node
       props={
        {
         _id: '',
         ucebna: 'CP-1.02',
         start: addDays(new Date(Date.now()), 4).valueOf(),
         konec: addDays(new Date(Date.now()), 5).valueOf(),
         nazev: 'Předmět cvičení N',
         tema: 'Téma termínu',
         cviceni: 1,
         kapacita: 10,
         zapsany: 4,
         owned: false,
         nCviceni: 3,
         kod: 'Předmět',
         typ: 'student',
        } as tNode
       }
       demo={true}
      />
     </section>
     <Header type="h2" underline="fade" className="w-max">
      Obsazený termín
     </Header>
     <section className="pl-5 py-4">
      <Node
       props={
        {
         _id: '',
         ucebna: 'CP-1.02',
         start: addDays(new Date(Date.now()), 4).valueOf(),
         konec: addDays(new Date(Date.now()), 5).valueOf(),
         nazev: 'Předmět cvičení N',
         tema: 'Téma termínu',
         cviceni: 1,
         kapacita: 10,
         zapsany: 10,
         owned: false,
         nCviceni: 3,
         kod: 'Předmět',
         typ: 'student',
        } as tNode
       }
       demo={true}
      />
     </section>
    </section>
    <section>
     <Header underline="fade">Zapsané terminy</Header>
     Stránka <span className="font-semibold">Moje termíny</span> obsahuje seznam termínů, které máte
     zapsané. Zde se můžete odepsat z termínu. <br />
     <span className="text-red-800 dark:text-red-400">
      Upozornění: Odepsání z termínu je povoleno jen
      <span className="font-semibold">{process.env.NEXT_PUBLIC_TIME_GAP} hodin</span> před začátkem
      termínu.
     </span>
     <Header type="h2" underline="fade" className="w-max">
      Odepisovatelný termín
     </Header>
     <section className="pl-5 py-4">
      <Node
       props={
        {
         _id: '',
         ucebna: 'CP-1.02',
         start: addDays(new Date(Date.now()), 4).valueOf(),
         konec: addDays(new Date(Date.now()), 5).valueOf(),
         nazev: 'Předmět cvičení N',
         tema: 'Téma termínu',
         cviceni: 1,
         kapacita: 10,
         zapsany: 4,
         owned: true,
         nCviceni: 3,
         kod: 'Předmět',
         typ: 'student',
        } as tNode
       }
       demo={true}
      />
     </section>
     <Header type="h2" underline="fade" className="w-max">
      Blokovaný termín
     </Header>
     <section className="pl-5 py-4">
      <Node
       props={
        {
         _id: '',
         ucebna: 'CP-1.02',
         start: addHours(new Date(Date.now()), 4).valueOf(),
         konec: addHours(new Date(Date.now()), 6).valueOf(),
         nazev: 'Předmět cvičení N',
         tema: 'Téma termínu',
         cviceni: 1,
         kapacita: 10,
         zapsany: 4,
         owned: true,
         nCviceni: 3,
         kod: 'Předmět',
         typ: 'student',
        } as tNode
       }
       demo={true}
      />
     </section>
    </section>
    <section>
     <Header underline="fade">Profil studenta</Header>
     Stránka <span className="font-semibold">Profil</span> obsahuje seznam všech dostupných předmětů
     a jejich cvičení. Dále zde můžete najít tabulku pro každý dostupný předmět, která značí stav
     jednotlivých cvičení daného předmětu.
     <Header type="h2" underline="fade" className="w-max">
      Tabulka předmětu
     </Header>
     <section className="pl-5 py-4">
      <Predmet
       predmet={{ nazev: 'Název předmětu', cviceni: ['01-01-1997', 0, 0] } as tPredmetSekce}
      />
     </section>
     <Header type="h2" underline="fade" className="w-max">
      Stavy cvičení předmětu
     </Header>
     <section className="pl-5 py-4 flex flex-col gap-2">
      <span className="inline-flex gap-1">
       <span className="font-bold">Splněný termín: </span>
       <Chip type="success">{'01-01-1997'}</Chip>
       datum označuje den splnění či uznání
      </span>
      <div className="inline-flex gap-1">
       <span className="font-bold">Nesplněný termín: </span>
       <Chip type="danger">nesplnil</Chip>
       datum označuje den splnění či uznání
      </div>
     </section>
    </section>
   </main>
  </section>
 )
}
