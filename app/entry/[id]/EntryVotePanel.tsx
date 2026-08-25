'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UpvoteButton } from '@/app/components/UpvoteButton'
import { Badge } from '@/app/components/ui/Badge'
import { ClickLink } from '@/app/components/ClickLink'
import type { Entry } from '@/lib/types'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5">
      <div className="text-lg font-semibold tabular-nums">{value.toLocaleString()}</div>
      <div className="text-[10px] uppercase tracking-tight text-neutral-500">{label}</div>
    </div>
  )
}

export function EntryVotePanel({ entry }: { entry: Entry }) {
  const isSite = entry.kind === 'site'
  const [ups, setUps] = useState(entry.upvotes)
  const clicks = entry.clicks

  return (
    <div className="flex items-center gap-4">
      <UpvoteButton
        id={entry.id}
        initial={entry.upvotes}
        onChange={(d) => setUps((u) => Math.max(0, u + d))}
      />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{entry.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge>{isSite ? 'Situs' : 'Prompt'}</Badge>
          {entry.category && <Badge>{entry.category}</Badge>}
        </div>

        {/* stats — mirror "Peringkat/Sponsor/Klik" pamerin */}
        <div className="mt-3 flex gap-3 text-sm">
          <Stat label="Score" value={ups * 3 + clicks} />
          <Stat label="Upvotes" value={ups} />
          <Stat label="Klik" value={clicks} />
        </div>

        {entry.description && <p className="mt-3 text-neutral-700">{entry.description}</p>}
        {!isSite && entry.body && (
          <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-100 p-3 text-sm text-neutral-800">
            {entry.body}
          </pre>
        )}
        {!isSite && entry.variables && (
          <p className="mt-2 text-xs text-neutral-500">Variables: {entry.variables}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isSite && entry.url && (
            <ClickLink
              id={entry.id}
              url={entry.url}
              className="inline-block font-medium text-emerald-600 hover:underline"
            >
              Buka situs ↗
            </ClickLink>
          )}
          <Link
            href="/"
            className="inline-block rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Pamerin lagi
          </Link>
        </div>

        {entry.has_chatbot && (
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 p-3 text-sm text-neutral-600">
            Chatbot penjelas (mini-RAG) menyusul di Phase 3.
          </div>
        )}
      </div>
    </div>
  )
}
