import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import { Vytvor } from '@/components/vytvor'
import ContextProviders from '@/contexts/providers'
import Formular from '@/components/formular'
import PredmetyForm from '@/components/predmetyForm'
import { Get } from '@/app/actions'

export default async function RootLayout(props: {
 children: React.ReactNode
 params: Promise<{ vyID: string }>
}) {
 const params = await props.params

 const { children } = props

 const ticket = (await Get('x-cvt'))?.value || ''

 return (
  <>
   <Navbar id={params.vyID} />
   <ContextProviders>
    <main className="max-w-6xl mx-auto pt-20">{children}</main>
    <Vytvor />
    <Formular isAdmin={ticket ? true : false} />
    {ticket && <PredmetyForm />}
   </ContextProviders>
  </>
 )
}
