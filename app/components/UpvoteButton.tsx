'use client'

import {
  forwardRef,
  useEffect,
  useState,
  useOptimistic,
  useTransition,
  type ComponentPropsWithoutRef,
} from 'react'

import { cn } from '@/lib/cn'
import { ArrowBigUp } from 'lucide-react'
import { upvoteEntry, cancelVote } from '@/app/actions'

const PARTICLES = [
  { x: 0, y: -22 },
  { x: 18, y: -14 },
  { x: 22, y: 4 },
  { x: 13, y: 20 },
  { x: -13, y: 20 },
  { x: -22, y: 4 },
  { x: -18, y: -14 },
]

function Burst({ color }: { color: string }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const id = globalThis.requestAnimationFrame(() => setOut(true))
    return () => globalThis.cancelAnimationFrame(id)
  }, [])
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 size-1.5 rounded-full transition-all duration-500 ease-out"
          style={{
            backgroundColor: color,
            opacity: out ? 0 : 1,
            transform: out
              ? `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) scale(0.2)`
              : 'translate(-50%, -50%) scale(1)',
          }}
        />
      ))}
    </span>
  )
}

export type UpvoteButtonProps = Readonly<
  { id: string; initial: number; onChange?: (delta: number) => void } & Omit<
      ComponentPropsWithoutRef<'button'>,
      'onChange'
    >
>

// Upvote — ArrowBigUp pops + bursts on vote; toggle off (cancel) via localStorage + server action.
export const UpvoteButton = forwardRef<HTMLButtonElement, UpvoteButtonProps>(
  ({ className, id, initial, onClick, onChange, ...props }, ref) => {
    const [upvoted, setUpvoted] = useState(false)
    const [count, setCount] = useState(initial)
    const [optimistic, addOptimistic] = useOptimistic(count, (s, d: number) => s + d)
    const [burstKey, setBurstKey] = useState(0)
    const [, start] = useTransition()

    useEffect(() => {
      setUpvoted(localStorage.getItem(`up_${id}`) === '1')
    }, [id])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (upvoted) {
        localStorage.removeItem(`up_${id}`)
        setUpvoted(false)
        setCount((c) => Math.max(0, c - 1))
        start(async () => {
          addOptimistic(-1)
          await cancelVote(id)
        })
        onChange?.(-1)
      } else {
        localStorage.setItem(`up_${id}`, '1')
        setUpvoted(true)
        setCount((c) => c + 1)
        setBurstKey((k) => k + 1)
        start(async () => {
          addOptimistic(1)
          await upvoteEntry(id)
        })
        onChange?.(1)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={upvoted}
        aria-label="Upvote"
        data-slot="upvote-button"
        onClick={handleClick}
        className={cn(
          'inline-flex shrink-0 flex-col items-center gap-0.5 rounded-full px-3 py-2 font-sans text-sm font-medium select-none',
          'transition-[background-color,box-shadow,color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.08),inset_0_-2px_4px_rgba(0,0,0,0.08)]',
          upvoted
            ? 'bg-emerald-50 text-emerald-600 active:bg-emerald-100'
            : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 active:bg-neutral-100',
          className,
        )}
        {...props}
      >
        <span className="relative flex size-5 items-center justify-center">
           {upvoted && <Burst key={burstKey} color="#ff7a3c" />}
          <ArrowBigUp
            size={18}
            strokeWidth={2}
            aria-hidden
            className={cn(
              'relative z-10 transition-[transform,fill,color,filter] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
              upvoted
                ? 'scale-110 fill-emerald-500 text-emerald-500'
                : 'scale-100 fill-transparent text-current',
            )}
          />
        </span>
        <span className="tabular-nums">{optimistic.toLocaleString()}</span>
      </button>
    )
  },
)
UpvoteButton.displayName = 'UpvoteButton'
