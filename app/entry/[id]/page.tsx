import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntry, score } from '@/lib/db'
import { Card } from '@/app/components/ui/Card'
import { Badge } from '@/app/components/ui/Badge'
import { UpvoteButton } from '@/app/components/UpvoteButton'
import { ClickLink } from '@/app/components/ClickLink'

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = await getEntry(id)
  if (!entry) notFound()

  const isSite = entry.kind === 'site'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-neutral-600 hover:underline">
        ← Board
      </Link>

      <Card className="mt-4">
        <div className="flex items-start gap-4">
          <UpvoteButton id={entry.id} initial={entry.upvotes} />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{entry.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge>{isSite ? 'Situs' : 'Prompt'}</Badge>
              {entry.category && <Badge>{entry.category}</Badge>}
              <span className="text-xs text-neutral-500">Score {score(entry)}</span>
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

            {isSite && entry.url && (
              <ClickLink
                id={entry.id}
                url={entry.url}
                className="mt-3 inline-block text-neutral-700 underline"
              >
                Buka situs ↗
              </ClickLink>
            )}

            {entry.has_chatbot && (
              <div className="mt-4 rounded-lg border border-dashed border-neutral-300 p-3 text-sm text-neutral-600">
                Chatbot penjelas (mini-RAG) menyusul di Phase 3.
              </div>
            )}
          </div>
        </div>
      </Card>
    </main>
  )
}
