import React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'

import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
 title: 'UJEP AkceReg - registrační systém na mimorozvrhové akce',
 description: 'akcereg.ujep.cz',
 manifest: '/manifest.json',
 icons: {
  icon: [
   { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
   { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
   { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
   { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
   { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
  ],
 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en">
   <body className={GeistSans.className}>
    <Providers attribute="class" defaultTheme="light" disableTransitionOnChange>
     <main
      id="main"
      className="min-h-[100vh] h-max pb-3 text-black bg-white dark:text-stone-50 dark:bg-black"
     >
      {children}
     </main>
    </Providers>
   </body>
  </html>
 )
}
