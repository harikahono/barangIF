import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { Kind } from '@/lib/types'

const TABS: { key: Kind; label: string }[] = [
  { key: 'site', label: 'Situs' },
  { key: 'prompt', label: 'Prompt' },
]

export function BoardTabs({ active }: { active: Kind }) {
  return (
    <div className="mb-4 flex gap-1 rounded-lg border border-neutral-800 p-1">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/?board=${t.key}`}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition',
            active === t.key
              ? 'bg-neutral-100 text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-200',
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  )
}
