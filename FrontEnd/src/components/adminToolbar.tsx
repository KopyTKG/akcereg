'use client'
import { useContext } from 'react'
import { AdminCtx, DefaultPredmet } from '@/contexts/AdminProvider'
import { Button } from './ui/button'
import { Grid2x2Plus } from 'lucide-react'

export default function AdminToolbar() {
 const AdminContext = useContext(AdminCtx)
 if (!AdminContext) {
  throw new Error('Missing AdminProvider')
 }
 const { open, setOpen, setStorage } = AdminContext

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
