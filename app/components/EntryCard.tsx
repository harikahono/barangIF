'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { UpvoteButton } from './UpvoteButton'
import { ClickLink } from './ClickLink'
import type { Entry } from '@/lib/types'

export function EntryCard({ entry }: { entry: Entry }) {
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

      <div className="relative z-10 flex gap-4 pointer-events-none">
        <UpvoteButton
          id={entry.id}
          initial={entry.upvotes}
          className="pointer-events-auto"
          onChange={(d) => setUps((u) => Math.max(0, u + d))}
        />
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
      </div>
    </Card>
  )
}
