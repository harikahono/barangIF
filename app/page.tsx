import type { Kind } from '@/lib/types'
import { listEntries } from '@/lib/db'
import { BoardTabs } from '@/app/components/BoardTabs'
import { Board } from '@/app/components/Board'
import { ActivityFeed } from '@/app/components/ActivityFeed'
import { SubmitForm } from '@/app/components/SubmitForm'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>
}) {
  const { board } = await searchParams
  const active: Kind = board === 'prompt' ? 'prompt' : 'site'
  const entries = await listEntries(active)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">barangIF</h1>
      <p className="mb-4 text-sm text-neutral-600">
        Tempat pamer barang buat anak IF. Pamer Situs / Prompt, di-rank by vote.
      </p>
      <SubmitForm />
      <BoardTabs active={active} />
      <Board entries={entries} />
      <ActivityFeed entries={entries} />
    </main>
  )
}
