import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headerVariants = cva('', {
 variants: {
  type: {
   h1: 'text-3xl',
   h2: 'text-xl',
   h3: 'text-lg',
   h4: 'text-md',
  },
  thickness: {
   bold: 'font-bold',
   medium: 'font-semibold',
   normal: 'font-normal',
   light: 'font-light',
  },
  underline: {
   none: 'bg-transparent',
   default: 'dark:bg-stone-400/50 bg-stone-700/50',
   ghost: 'dark:bg-stone-600/40 bg-stone-800/40',
   fade: 'bg-gradient-to-r from-transparent dark:via-gray-700 via-gray-400  to-transparent',
  },
 },
 defaultVariants: {
  underline: 'none',
  type: 'h1',
  thickness: 'medium',
 },
})

export interface HeaderProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof headerVariants> {}

function Header({ className, underline, type, thickness, ...props }: HeaderProps) {
 return (
  <div className={cn(headerVariants({ type, thickness }), className)} {...props}>
   {props.children}
   <div className={cn('w-full h-[.1rem] ', headerVariants({ underline }))} />
  </div>
 )
}

export { Header, headerVariants }
