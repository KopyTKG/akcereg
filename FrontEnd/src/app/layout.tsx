import React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { headers } from 'next/headers'
import Script from 'next/script'
import { DevToolsProtection } from '@/components/devtools-protection'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
 const nonce = (await headers()).get('x-nonce')

 if (!nonce) {
  return <b>Loading ....</b>
 }

 return (
  <html lang="cs">
   <head>
    <link rel="icon" href="/favicon.ico" sizes="any" />
   </head>
   <body className={GeistSans.className}>
    <DevToolsProtection />
    <Providers attribute="class" defaultTheme="light" disableTransitionOnChange>
     <main
      id="main"
      className="min-h-[100vh] h-max pb-3 text-black bg-white dark:text-stone-50 dark:bg-black"
     >
      {children}
     </main>
    </Providers>
    <Script
     nonce={nonce}
     id="my-script"
     dangerouslySetInnerHTML={{
      __html: `console.log('This inline script is allowed because it has the correct nonce')`,
     }}
    />
    
   </body>
  </html>
 )
}
