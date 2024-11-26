import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function StandByScreen() {
 return (
  <div className="min-h-screen bg-background p-8">
   <div className="max-w-6xl mx-auto space-y-8">
    <Card className="w-full">
     <CardHeader>
      <CardTitle className="text-3xl flex flex-row justify-between h-8">
       <div>
        Vítejte na <span className="font-bold dark:text-sky-200 text-sky-800">AkceReg</span>
       </div>
       <a
        href="https://ujep.cz"
        target="_blank"
        rel="noreferrer"
        className="dark:bg-stone-50 bg-stone-950 rounded-lg px-2 py-1 w-[22.6rem] h-[5rem] relative logo"
       />
      </CardTitle>
     </CardHeader>
     <CardContent>
      <p className="text-muted-foreground mb-4">Registrační systém na mimorozvrhové akce.</p>
      <Button asChild className="w-full sm:w-auto">
       <Link href="/login">Přihlásit se</Link>
      </Button>
     </CardContent>
    </Card>

    <div className="grid gap-8 md:grid-cols-2">
     <Card>
      <CardHeader>
       <CardTitle>O projektu</CardTitle>
      </CardHeader>
      <CardContent>
       <p className="text-muted-foreground">
        Projekt vznikl vrámci předmětu KI/PSI1 a KI/PSI2 pod katedrou Informatiky. Má řešit
        problématiku jednorázových a mimorozvrhových akcí.
       </p>
       <h3 className="font-bold mb-2 mt-4">Použité technologie</h3>
       <ul className="list-disc list-inside text-muted-foreground">
        <li>PostgresSQL</li>
        <li>FastAPI</li>
        <li>SQLAlchemy</li>
        <li>Next.JS</li>
       </ul>
      </CardContent>
     </Card>

     <Card>
      <CardHeader>
       <CardTitle>Projektový tým</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="space-y-4">
        {[
         { name: 'Adam Legner', role: 'Back-end dev', avatar: 'AL' },
         { name: 'Alex Schönfelder', role: 'Product owner, Back-end dev', avatar: 'AS' },
         { name: 'Daniel Říha', role: 'Back-end dev', avatar: 'DŘ' },
         { name: 'Martin Kopecký', role: 'Techlead, Front-end dev, UI/UX dev', avatar: 'MK' },
        ].map((member) => (
         <div key={member.name} className="flex items-center space-x-4">
          <Avatar>
           <AvatarFallback>{member.avatar}</AvatarFallback>
          </Avatar>
          <div>
           <p className="font-medium">{member.name}</p>
           <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
         </div>
        ))}
       </div>
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 )
}
