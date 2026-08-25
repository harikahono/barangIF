'use client'

import { useMemo, useState } from 'react'
import { EntryCard } from './EntryCard'
import type { Entry } from '@/lib/types'

const PAGE = 10

export function Board({ entries }: { entries: Entry[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const e of entries) if (e.category) set.add(e.category)
    return Array.from(set).slice(0, 8)
  }, [entries])

  const [cat, setCat] = useState('Semua')
  const [visible, setVisible] = useState(PAGE)

  const filtered = cat === 'Semua' ? entries : entries.filter((e) => e.category === cat)
  const shown = filtered.slice(0, visible)

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Chip active={cat === 'Semua'} onClick={() => { setCat('Semua'); setVisible(PAGE) }}>
            Semua
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => { setCat(c); setVisible(PAGE) }}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-sm text-neutral-500">Belum ada listing di sini.</p>
      ) : (
        shown.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}

      {visible < filtered.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE)}
          className="mt-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
        >
          Tampilkan {Math.min(PAGE, filtered.length - visible)} listing lainnya
        </button>
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
        (active
          ? 'border-brand bg-brand text-white'
          : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-50')
      }
    >
      {children}
    </button>
  )
}
