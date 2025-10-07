'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type ReloadContextType = {
 reload: boolean
 setReload: Dispatch<SetStateAction<boolean>>
}

const ReloadCtx = createContext<ReloadContextType | undefined>(undefined)

export const useReloadContext = (): ReloadContextType => {
 const context = React.useContext(ReloadCtx)
 if (!context) {
  throw new Error('useReloadContext must be used within a ReloadProvider')
 }
 return context
}

export default function ReloadProvider({ children }: { children: React.ReactNode }) {
 const [reload, setReload] = useState<boolean>(false)
 return <ReloadCtx.Provider value={{ reload, setReload }}>{children}</ReloadCtx.Provider>
}
