import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

// ponytail: inline light badge (no absolute positioning — that was a marketing-page quirk)
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-tight text-neutral-600 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
