'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type FilterContextType = {
 filter: string[]
 setFilter: Dispatch<SetStateAction<string[]>>
 all: boolean
 setAll: Dispatch<SetStateAction<boolean>>
}

export const FilterCtx = createContext<FilterContextType | undefined>(undefined)

export default function FilterProvider({ children }: { children: React.ReactNode }) {
 const [filter, setFilter] = useState<string[]>([])
 const [all, setAll] = useState<boolean>(false)
 return (
  <FilterCtx.Provider value={{ filter, setFilter, all, setAll }}>{children}</FilterCtx.Provider>
 )
}
