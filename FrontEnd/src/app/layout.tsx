import React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import '../sass/index.scss'

import './globals.css'
import { Providers } from './providers'
import Promo from '@/components/promo'

export const metadata: Metadata = {
 title: 'AkceReg',
 description: 'akcereg.ujep.cz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en">
   <body className={GeistSans.className}>
    <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
     <main id="main" className="min-h-[100vh] h-max pb-3 text-black bg-white dark:text-stone-50 dark:bg-black">
      {children}
     </main>
    </Providers>
    <Promo/>
   </body>
  </html>
 )
}
