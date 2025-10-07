'use client'
import { DefaultPredmet, useAdminContext } from '@/contexts/AdminProvider'
import { Button } from '@/components/ui/button'
import { Grid2x2Plus } from 'lucide-react'

export default function AdminToolbar() {
 const { open, setOpen, setStorage } = useAdminContext()

 return (
  <div className="w-full flex justify-end">
   <Button
    variant="ghost"
    onClick={() => {
     setOpen(!open)
     setStorage(DefaultPredmet)
    }}
    className="flex gap-2">
    <Grid2x2Plus className="w-4" /> Přidat
   </Button>
  </div>
 )
}
