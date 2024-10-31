import React from 'react'
import { NavbarStudent as Navbar } from '@/components/navbars'
import ReloadProvider from '@/contexts/ReloadProvider'

export default async function RootLayout(props: {
 children: React.ReactNode
 params: Promise<{ stID: string }>
}) {
 const params = await props.params

 const { children } = props

 return (
  <>
   <Navbar id={params.stID} />
   <ReloadProvider>
    <main className="max-w-4xl mx-auto pt-20">{children}</main>
   </ReloadProvider>
  </>
 )
}
