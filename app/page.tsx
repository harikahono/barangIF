import type { Kind } from '@/lib/types'
import { listEntries } from '@/lib/db'
import { BoardTabs } from '@/app/components/BoardTabs'
import { EntryCard } from '@/app/components/EntryCard'
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
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Belum ada yang pamer di board {active === 'prompt' ? 'Prompt' : 'Situs'}. Jadi yang
          pertama!
        </p>
      ) : (
        entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}
    </main>
  )
}
