import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const markerVariants = cva('rounded-full border-transparent', {
 variants: {
  size: {
   small: 'h-[.5rem] w-[.5rem]',
   medium: 'h-[.75rem] w-[.75rem]',
   large: 'h-[1rem] w-[1rem]',
  },
  status: {
   default: 'bg-neutral-200 shadow ',
   done: 'bg-rose-600 shadow',
   progress: 'bg-amber-500 shadow',
  },
 },
 defaultVariants: {
  status: 'default',
  size: 'medium',
 },
})

export interface MarkerProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof markerVariants> {}

function Marker({ className, size, status, ...props }: MarkerProps) {
 return (
  <div>
   <div
    className={cn(
     markerVariants({ size, status }),
     `${className} animate-ping absolute inline-flex opacity-85`,
    )}
   />
   <div className={cn(markerVariants({ size, status }), className)} {...props} />
  </div>
 )
}

export { Marker, markerVariants }
