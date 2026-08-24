import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntry } from '@/lib/db'
import { Card } from '@/app/components/ui/Card'
import { EntryVotePanel } from './EntryVotePanel'

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = await getEntry(id)
  if (!entry) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-neutral-600 hover:underline">
        ← Board
      </Link>

      <Card className="mt-4">
        <EntryVotePanel entry={entry} />
      </Card>
    </main>
  )
}
