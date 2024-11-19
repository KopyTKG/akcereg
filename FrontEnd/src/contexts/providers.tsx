import * as React from 'react'
import ReloadProvider from '@/contexts/ReloadProvider'
import FilterProvider from '@/contexts/FilterProvider'
import FormProvider from '@/contexts/FormProvider'
import AdminProvider from './AdminProvider'
import { Get } from '@/app/actions'

export default async function ContextProviders({ children }: { children: React.ReactNode }) {
 const ticket = (await Get('x-cvt'))?.value || ''
 return (
  <>
   <ReloadProvider>
    <FormProvider>
     <FilterProvider>
      {ticket ? <AdminProvider>{children}</AdminProvider> : <>{children}</>}
     </FilterProvider>
    </FormProvider>
   </ReloadProvider>
  </>
 )
}
