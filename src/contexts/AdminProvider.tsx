'use client'
import { tPredmetBody } from '@/lib/types'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type AdminContextType = {
 open: boolean
 setOpen: Dispatch<SetStateAction<boolean>>
 storage: tPredmetBody
 setStorage: Dispatch<SetStateAction<tPredmetBody>>
}

export const DefaultPredmet: tPredmetBody = {
 kod: '',
 zkratka: '',
 katedra: '',
 cviceni: 0,
}

const AdminCtx = createContext<AdminContextType | undefined>(undefined)

export const useAdminContext = (): AdminContextType => {
 const context = React.useContext(AdminCtx)
 if (!context) {
  throw new Error('useAdminContext must be used within a AdminProvider')
 }
 return context
}

export default function AdminProvider({ children }: { children: React.ReactNode }) {
 const [open, setOpen] = useState<boolean>(false)
 const [storage, setStorage] = useState<tPredmetBody>(DefaultPredmet)

 return (
  <AdminCtx.Provider
   value={{
    open,
    setOpen,
    storage,
    setStorage,
   }}>
   {children}
  </AdminCtx.Provider>
 )
}
