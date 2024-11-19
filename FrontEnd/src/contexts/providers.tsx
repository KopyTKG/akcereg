import * as React from 'react'
import ReloadProvider from '@/contexts/ReloadProvider'
import FilterProvider from '@/contexts/FilterProvider'
import FormProvider from '@/contexts/FormProvider'
import AdminProvider from './AdminProvider'
import { Get } from '@/app/actions'
import { getUserInfo } from '@/lib/stag'
import { isAdmin } from '@/lib/functions'
import { error } from 'console'

export default async function ContextProviders({ children }: { children: React.ReactNode }) {
 const ticket = (await Get('x-svt'))?.value || ''
 if (!ticket) console.error('missing ticket')
 const info = await getUserInfo(ticket)
 if (!info) throw error('missing ticket')
 return (
  <>
   <ReloadProvider>
    <FormProvider>
     <FilterProvider>
      {isAdmin(info) ? <AdminProvider>{children}</AdminProvider> : <>{children}</>}
     </FilterProvider>
    </FormProvider>
   </ReloadProvider>
  </>
 )
}
