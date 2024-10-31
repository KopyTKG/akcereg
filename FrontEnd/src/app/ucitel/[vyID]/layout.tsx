import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import { Vytvor } from '@/components/vytvor'
import ContextProviders from '@/contexts/providers'
import Formular from '@/components/formular'
import PredmetyForm from '@/components/predmetyForm'
import { Get } from '@/app/actions'
import { getUserInfo } from '@/lib/stag'
import { isAdmin } from '@/lib/functions'

export default async function RootLayout(props: {
 children: React.ReactNode
 params: Promise<{ vyID: string }>
}) {
 const params = await props.params

 const { children } = props

 const ticket = (await Get('stagUserTicket'))?.value || ''
 const info = await getUserInfo(ticket)
 if (!info) return null

 return (
  <>
   <Navbar id={params.vyID} />
   <ContextProviders>
    <main className="max-w-6xl mx-auto pt-20">{children}</main>
    <Vytvor />
    <Formular isAdmin={isAdmin(info)} />
    {isAdmin(info) && <PredmetyForm />}
   </ContextProviders>
  </>
 )
}
