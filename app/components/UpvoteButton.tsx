'use client'

import { useEffect, useState, useOptimistic, useTransition } from 'react'
import { ArrowBigUp } from 'lucide-react'
import { upvoteEntry } from '@/app/actions'
import { cn } from '@/lib/cn'

export function UpvoteButton({ id, initial }: { id: string; initial: number }) {
  const [upvoted, setUpvoted] = useState(false)
  const [optimistic, addOptimistic] = useOptimistic(initial, (s, d: number) => s + d)
  const [, start] = useTransition()

  useEffect(() => {
    setUpvoted(localStorage.getItem(`up_${id}`) === '1')
  }, [id])

  function onClick() {
    if (upvoted) return
    localStorage.setItem(`up_${id}`, '1')
    setUpvoted(true)
    start(async () => {
      addOptimistic(1)
      await upvoteEntry(id)
    })
  }

  return (
    <button
      onClick={onClick}
      disabled={upvoted}
      aria-label="Upvote"
      className={cn(
        'flex shrink-0 flex-col items-center rounded-lg border px-3 py-2 text-sm transition',
        upvoted
          ? 'border-neutral-700 text-neutral-300'
          : 'border-neutral-800 text-neutral-400 hover:border-neutral-500 hover:text-neutral-100',
      )}
    >
      <ArrowBigUp className="h-5 w-5" />
      {optimistic}
    </button>
  )
}
