import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

// ponytail: light card mirroring opensourceui.in's neutral surface
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm', className)}
      {...props}
    />
  )
}
