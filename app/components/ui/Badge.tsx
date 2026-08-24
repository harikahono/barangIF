import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300',
        className,
      )}
      {...props}
    />
  )
}
