'use client'

import { useEffect } from 'react'
import { preventDevTools } from '@/lib/prevent-devtools'

export function DevToolsProtection() {
 useEffect(() => {
  const cleanup = preventDevTools()
  return () => {
   if (cleanup) cleanup()
  }
 }, [])

 return null
}
