'use client'
import Node from '@/components/node'
import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/ui/header'
import { useReloadContext } from '@/contexts/ReloadProvider'
import { tUcitelBody, tTermin } from '@/types/next_response_types'

const fetchTerminyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/ucitel`)
  const res = await fetch(url, { method: 'GET', credentials: 'include' })
  if (res.status == 401) {
   window.location.href = '/logout'
  } else if (res.status == 200 || res.status == 404) {
   return (await res.json()) as tUcitelBody
  }
 } catch (e) {
  console.error(e)
 }
}

export default function UcitelHome({ demo }: { demo?: boolean }) {
 const [Terminy, setTerminy] = useState<tTermin[]>([])
 const [fetching, setFetching] = useState<boolean>(true)

 // Destructure the context values
 const { reload } = useReloadContext()

 const fetchTerminy = useCallback(async () => {
  const data = await fetchTerminyData()
  if (data) {
   setTerminy(data.terminy)
  }
  setFetching(false)
 }, [reload])

 useEffect(() => {
  fetchTerminy()
 }, [fetchTerminy])

 if (Terminy?.length === 0 && fetching) {
  return (
   <div className="w-max h-[10rem] grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    {Array.from({ length: 3 }, (_, index) => (
     <Skeleton key={index} className="w-[25rem] h-[18rem] rounded-xl" />
    ))}
   </div>
  )
 }
 if (!fetching && Terminy?.length === 0) {
  return (
   <span className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    <Header type="h2" thickness="bold" className="col-span-2 w-[25rem] lg:w-[50.75rem] text-center">
     Nebyl nalezen žádný termín
    </Header>
   </span>
  )
 }

 return (
  <>
   <div className="w-max grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    {Terminy?.map((termin: tTermin) => (
     <Node key={termin.id} props={{ ...termin }} typUzivatele={'teacher'} demo={demo || false} />
    ))}
   </div>
  </>
 )
}
