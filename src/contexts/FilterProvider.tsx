'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type FilterContextType = {
 filter: string[]
 setFilter: Dispatch<SetStateAction<string[]>>
 showHidden: boolean
 setShowHidden: Dispatch<SetStateAction<boolean>>
}

const FilterCtx = createContext<FilterContextType | undefined>(undefined)

export const useFilterContext = (): FilterContextType => {
 const context = React.useContext(FilterCtx)
 if (!context) {
  throw new Error('useFilterContext must be used within a FilterProvider')
 }
 return context
}

export default function FilterProvider({ children }: { children: React.ReactNode }) {
 const [filter, setFilter] = useState<string[]>([])
 const [showHidden, setShowHidden] = useState<boolean>(false)
 return (
  <FilterCtx.Provider value={{ filter, setFilter, showHidden, setShowHidden }}>
   {children}
  </FilterCtx.Provider>
 )
}
