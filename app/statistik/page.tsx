import Link from 'next/link'
import { listEntries, score } from '@/lib/db'

export default async function StatistikPage() {
  const entries = await listEntries()
  const total = entries.length
  const totalKlik = entries.reduce((s, e) => s + e.clicks, 0)
  const totalUp = entries.reduce((s, e) => s + e.upvotes, 0)
  const totalScore = entries.reduce((s, e) => s + score(e), 0)
  const situs = entries.filter((e) => e.kind === 'site').length
  const prompt = entries.filter((e) => e.kind === 'prompt').length

  const topKlik = [...entries].sort((a, b) => b.clicks - a.clicks).slice(0, 10)
  const topScore = [...entries].sort((a, b) => score(b) - score(a)).slice(0, 10)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Statistik</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        Angka apa adanya, langsung dari database.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Listing aktif" value={total} />
        <Stat label="Total klik" value={totalKlik} />
        <Stat label="Total upvote" value={totalUp} />
        <Stat label="Total score" value={totalScore} />
        <Stat label="Situs" value={situs} />
        <Stat label="Prompt" value={prompt} />
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Paling banyak diklik</h2>
        <ol className="space-y-1 text-sm">
          {topKlik.map((e, i) => (
            <li key={e.id} className="flex items-center gap-2">
              <span className="w-5 text-neutral-400">{i + 1}</span>
              <Link href={`/entry/${e.id}`} className="truncate text-neutral-700 hover:underline">
                {e.title}
              </Link>
              <span className="ml-auto text-neutral-500">{e.clicks} klik</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Tertinggi score</h2>
        <ol className="space-y-1 text-sm">
          {topScore.map((e, i) => (
            <li key={e.id} className="flex items-center gap-2">
              <span className="w-5 text-neutral-400">{i + 1}</span>
              <Link href={`/entry/${e.id}`} className="truncate text-neutral-700 hover:underline">
                {e.title}
              </Link>
              <span className="ml-auto text-neutral-500">{score(e)}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold tabular-nums">{value.toLocaleString()}</div>
      <div className="mt-0.5 text-xs text-neutral-500">{label}</div>
    </div>
  )
}
