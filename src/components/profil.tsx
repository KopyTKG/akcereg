'use client'
import { useLayoutEffect, useState } from 'react'
import { tPredmetSekce } from '@/lib/types'
import Predmet from './tabulkaPredmet'

export default function Profil() {
 const [predmety, setPredmety] = useState<tPredmetSekce[]>([])
 useLayoutEffect(() => {
  async function loader() {
   try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/profil`)

    const res = await fetch(url.toString(), {
     method: 'GET',
     credentials: 'include',
    })
    if (res.status != 200) {
     window.location.href = '/logout'
    } else if (res.status == 200) {
     const jsonParsed = await res.json()
     const p = jsonParsed.data as tPredmetSekce[]
     setPredmety(p)
    }
   } catch {
    window.location.href = '/logout'
   }
  }

  loader()
 }, [])

 return (
  <>
   <div className="w-full mt-1">
    {predmety.map((predmet: tPredmetSekce, key: number) => {
     return <Predmet predmet={predmet} key={key + Date.now()} lenght={predmety.length - 1} />
    })}
   </div>
  </>
 )
}
