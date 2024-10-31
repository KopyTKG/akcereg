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

export const AdminCtx = createContext<AdminContextType | undefined>(undefined)

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
