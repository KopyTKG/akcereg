'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DefaultForm, useFormContext } from '@/contexts/FormProvider'
import { fetchPredmetyData } from '@/lib/functions'
import { useReloadContext } from '@/contexts/ReloadProvider'

export function Vytvor() {
 const [loading, setLoading] = useState<boolean>(true)

 const { setOpen, setPredmety, setFormData, setType, predmety } = useFormContext()
 const { reload } = useReloadContext()

 const fetchPredmety = useCallback(async () => {
  try {
   const data = await fetchPredmetyData()
   if (data) {
    setPredmety(data.predmety)
    setLoading(false)
   }
  } catch (e) {
   console.error(e)
  }
 }, [setPredmety, reload])

 useEffect(() => {
  fetchPredmety()
 }, [fetchPredmety])

 return (
  <Button
   size="icon"
   className="fixed bottom-6 right-6 h-14 w-14 rounded-full"
   disabled={loading || predmety.length == 0}
   onClick={() => {
    setOpen(true)
    setFormData(DefaultForm)
    setType('create')
   }}>
   <Plus className="h-6 w-6" />
  </Button>
 )
}
