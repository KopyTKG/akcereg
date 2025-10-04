import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const skeletonVariants = cva('animate-pulse rounded-md', {
 variants: {
  variant: {
   default:
    'dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-700 dark:shadow-neutral-950',
  },
 },

 defaultVariants: {
  variant: 'default',
 },
})

export interface SkeletonProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
 return <div className={cn(skeletonVariants({ variant }), className)} {...props} />
}

export { Skeleton, skeletonVariants }
