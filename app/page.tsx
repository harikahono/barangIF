import { listEntries } from '@/lib/db'
import { BoardTabs } from '@/app/components/BoardTabs'
import { EntryCard } from '@/app/components/EntryCard'
import { SubmitForm } from '@/app/components/SubmitForm'
import type { Kind } from '@/lib/types'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>
}) {
  const { board } = await searchParams
  const kind: Kind = board === 'prompt' ? 'prompt' : 'site'
  const entries = await listEntries(kind)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">barangIF</h1>
      <p className="mb-4 text-sm text-neutral-400">
        Tempat pamer barang buat anak IF — Situs &amp; Prompt, di-rank by vote.
      </p>

      <SubmitForm />
      <BoardTabs active={kind} />

      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">Belum ada barang di board ini. Pamerin dulu! 🔥</p>
      ) : (
        entries.map((e) => <EntryCard key={e.id} entry={e} />)
      )}
    </main>
  )
}
