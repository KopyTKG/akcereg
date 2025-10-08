'use client'
import { tPredmetBody } from '@/lib/types'
import { Pencil } from 'lucide-react'
import { useAdminContext } from '@/contexts/AdminProvider'
import { tPredmet } from '@/types/next_response_types'

export function ToolkitAdmin({ predmet }: { predmet: tPredmet }) {
 const { open, setOpen, setStorage } = useAdminContext()

 return (
  <>
   <button
    className="text-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded-full p-1"
    aria-label="Edit"
    onClick={() => {
     setOpen(!open)
     setStorage({
      kod: predmet.kod_predmetu,
      zkratka: predmet.zkratka_predmetu,
      katedra: predmet.katedra,
      cviceni: predmet.pocet_cviceni,
     } as tPredmetBody)
    }}>
    <Pencil className="w-5 h-5" aria-hidden="true" />
   </button>
  </>
 )
}
