'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { UpvoteButton } from './UpvoteButton'
import { ClickLink } from './ClickLink'
import type { Entry } from '@/lib/types'

export function EntryCard({ entry, rank }: { entry: Entry; rank?: number }) {
  const isSite = entry.kind === 'site'
  const [ups, setUps] = useState(entry.upvotes)

  return (
    <Card className="relative mb-3">
      {/* seluruh card → detail (stretched link di belakang) */}
      <Link
        href={`/entry/${entry.id}`}
        aria-label={`Detail ${entry.title}`}
        className="absolute inset-0 z-0 rounded-2xl"
      />

      <div className="relative z-10 flex items-center gap-4 pointer-events-none">
        {rank != null &&
          (rank <= 3 ? (
            <span
              className={
                'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums text-neutral-900 pointer-events-none ' +
                (rank === 1 ? 'bg-neutral-300' : rank === 2 ? 'bg-neutral-200' : 'bg-neutral-100')
              }
            >
              {rank}
            </span>
          ) : (
            <span className="w-6 shrink-0 text-center font-mono text-sm tabular-nums text-neutral-400 pointer-events-none">
              {rank}
            </span>
          ))}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isSite && entry.url ? (
              <ClickLink
                id={entry.id}
                url={entry.url}
                className="pointer-events-auto truncate font-semibold text-neutral-900 hover:underline"
              >
                {entry.title}
              </ClickLink>
            ) : (
              <span className="truncate font-semibold text-neutral-900">{entry.title}</span>
            )}
            {entry.has_chatbot && (
              <Badge>
                <MessageSquare className="mr-1 inline h-3 w-3" />
                chat
              </Badge>
            )}
          </div>

          {entry.description && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{entry.description}</p>
          )}
          {!isSite && entry.body && (
            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-neutral-600">
              {entry.body}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
            <Badge>{isSite ? 'Situs' : 'Prompt'}</Badge>
            {entry.category && <Badge>{entry.category}</Badge>}
            <span>Score {ups * 3 + entry.clicks}</span>
          </div>
        </div>
        <UpvoteButton
          id={entry.id}
          initial={entry.upvotes}
          className="pointer-events-auto"
          onChange={(d) => setUps((u) => Math.max(0, u + d))}
        />
      </div>
    </Card>
  )
}
