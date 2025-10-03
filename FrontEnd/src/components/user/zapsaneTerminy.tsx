'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import Node from '@/components/node'
import { useCallback, useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/ui/header'
import { useReloadContext } from '@/contexts/ReloadProvider'

const fetchTerminyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/terminy`)
  url.searchParams.set('t', 'zapsane')
  const res = await fetch(url, { method: 'GET', credentials: 'include' })
  if (res.status == 401) {
   window.location.href = '/logout'
  } else if (res.status == 200) {
   return await res.json()
  }
 } catch (e) {
  console.error(e)
 }
}

export default function ZapsaneTerminy() {
 const [Terminy, setTerminy] = useState<tTermin[]>([])

 const [fetching, setFetching] = useState<boolean>(true)

 // Destructure the context values
 const [reload] = useReloadContext()

 const fetchTerminy = useCallback(async () => {
  const data = await fetchTerminyData()
  if (data) {
   setTerminy(data.data)
  }

  setFetching(false)
 }, [reload])

 useLayoutEffect(() => {
  fetchTerminy()
 }, [fetchTerminy])

 if (Terminy?.length === 0 && fetching) {
  return (
   <div className="w-max h-[10rem] grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Array.from({ length: 3 }, (_, index) => (
     <Skeleton key={index} className="w-[25rem] h-[18rem] rounded-xl" />
    ))}
   </div>
  )
 } else if (!fetching && Terminy?.length === 0) {
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
    {Terminy.map((termin: tTermin) => (
     <Node key={termin._id} props={{ ...termin, typ: 'student', owned: true }} />
    ))}
   </div>
  </>
 )
}
