import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import { Vytvor } from '@/components/vytvor'
import Formular from '@/components/formular'
import PredmetyForm from '@/components/predmetyForm'
import ReloadProvider from '@/contexts/ReloadProvider'
import FormProvider from '@/contexts/FormProvider'
import FilterProvider from '@/contexts/FilterProvider'
import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'
import UserProvider from '@/contexts/UserProvider'
import { isAdmin } from '@/lib/functions'
import AdminProvider from '@/contexts/AdminProvider'
import { redirect } from 'next/navigation'
import { Get } from '@/app/actions'

export default async function RootLayout(props: {
 children: React.ReactNode
 params: Promise<{ vyID: string }>
}) {
 const params = await props.params

 const { children } = props

 const fetchUserInfo = async () => {
  try {
   const headers = new Headers()
   const cookies = {
    'x-svt': (await Get('x-svt'))?.value || '',
    'x-svh': (await Get('x-svh'))?.value || '',
   }
   headers.append('Cookie', `x-svt=${cookies['x-svt']}; x-svh=${cookies['x-svh']}`)

   const url = new URL(`${process.env.BASE}/api/auth/info`)
   const res = await fetch(url, {
    method: 'GET',
    headers: headers,
   })
   if (res.status == 403 || res.status == 401) {
    redirect('/logout')
   } else if (res.status == 200) {
    return (await res.json()) as tGetStagUserListForLoginTicketV2
   }
  } catch (e) {
   console.error(e)
  }
 }

 const userInfo = await fetchUserInfo()
 if (!userInfo) {
  redirect('/logout')
 }

 return (
  <>
   <Navbar id={params.vyID} />
   <ReloadProvider>
    <FormProvider>
     <FilterProvider>
      <UserProvider data={userInfo}>
       {isAdmin(userInfo) ? (
        <AdminProvider>
         <Content userInfo={userInfo}>{children}</Content>
        </AdminProvider>
       ) : (
        <Content userInfo={userInfo}>{children}</Content>
       )}
      </UserProvider>
     </FilterProvider>
    </FormProvider>
   </ReloadProvider>
  </>
 )
}

function Content({
 userInfo,
 children,
}: {
 userInfo: tGetStagUserListForLoginTicketV2
 children: React.ReactNode
}) {
 return (
  <>
   <main className="max-w-6xl mx-auto pt-20">{children}</main>
   <Vytvor />
   <Formular isAdmin={isAdmin(userInfo)} />
   {isAdmin(userInfo) && <PredmetyForm />}
  </>
 )
}
