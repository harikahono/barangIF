import { MessageSquare } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { UpvoteButton } from './UpvoteButton'
import { ClickLink } from './ClickLink'
import { score } from '@/lib/db'
import type { Entry } from '@/lib/types'

export function EntryCard({ entry }: { entry: Entry }) {
  const isSite = entry.kind === 'site'

  return (
    <Card className="mb-3 flex gap-4">
      <UpvoteButton id={entry.id} initial={entry.upvotes} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {isSite && entry.url ? (
            <ClickLink
              id={entry.id}
              url={entry.url}
              className="truncate font-semibold text-neutral-100 hover:underline"
            >
              {entry.title}
            </ClickLink>
          ) : (
            <span className="truncate font-semibold text-neutral-100">{entry.title}</span>
          )}
          {entry.has_chatbot && (
            <Badge>
              <MessageSquare className="mr-1 inline h-3 w-3" />chat
            </Badge>
          )}
        </div>

        {entry.description && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{entry.description}</p>
        )}
        {!isSite && entry.body && (
          <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-neutral-400">
            {entry.body}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <Badge>{isSite ? 'Situs' : 'Prompt'}</Badge>
          {entry.category && <Badge>{entry.category}</Badge>}
          <span>Score {score(entry)}</span>
          {isSite && entry.url && (
            <ClickLink
              id={entry.id}
              url={entry.url}
              className="ml-auto text-neutral-400 hover:underline"
            >
              Buka ↗
            </ClickLink>
          )}
        </div>
      </div>
    </Card>
  )
}
