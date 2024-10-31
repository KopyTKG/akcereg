import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const chipVariants = cva('px-2 rounded-full py-1 border-transparent text-sm w-max', {
 variants: {
  type: {
   default:
    'border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80',
   danger: 'bg-rose-600 text-neutral-50 shadow-sm',
   success: 'bg-green-600 text-neutral-50 shadow-sm',
   warning: 'bg-amber-500 text-neutral-900 shadow-sm',
  },
 },
 defaultVariants: {
  type: 'default',
 },
})

export interface ChipProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof chipVariants> {}

function Chip({ className, type, ...props }: ChipProps) {
 return <div className={cn(chipVariants({ type }), className)} {...props} />
}

export { Chip, chipVariants }
