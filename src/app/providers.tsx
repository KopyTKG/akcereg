// app/providers.tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children, ...props }: ThemeProviderProps) {
 return (
  <NextThemesProvider {...props}>
   <Toaster />
   {children}
  </NextThemesProvider>
 )
}
