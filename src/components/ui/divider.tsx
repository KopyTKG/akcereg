import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const dividerVariants = cva('shrink-0', {
 variants: {
  variant: {
   default: 'dark:bg-stone-400/50 bg-stone-700/50',
   ghost: 'dark:bg-stone-600/40 bg-stone-800/40',
   fade: 'from-transparent dark:via-gray-700 via-gray-400  to-transparent',
  },
  orientation: {
   horizontal: 'h-[0.1rem] w-full bg-gradient-to-r',
   vertical: 'h-full w-[0.1rem] bg-gradient-to-b ',
  },
  margin: {
   default: 'm-auto',
   my0: 'my-0 py-0',
   my2: 'my-2',
   my4: 'my-4',
   mb4: 'mb-4',
  },
 },
 defaultVariants: {
  variant: 'default',
  orientation: 'horizontal',
  margin: 'default',
 },
})

export interface DividerProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof dividerVariants> {}

function Divider({ className, variant, orientation, margin, ...props }: DividerProps) {
 return (
  <div className={cn(dividerVariants({ variant, orientation, margin }), className)} {...props} />
 )
}

export { Divider, dividerVariants }
