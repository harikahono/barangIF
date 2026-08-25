import Link from 'next/link'
import { listEntries, score } from '@/lib/db'
import { AnnotatedText } from '../components/ui/AnnotatedText'

export default async function StatistikPage() {
  const entries = await listEntries()
  const total = entries.length
  const totalKlik = entries.reduce((s, e) => s + e.clicks, 0)
  const totalUp = entries.reduce((s, e) => s + e.upvotes, 0)
  const totalScore = entries.reduce((s, e) => s + score(e), 0)
  const situs = entries.filter((e) => e.kind === 'site').length
  const prompt = entries.filter((e) => e.kind === 'prompt').length

  const situsPct = total ? Math.round((situs / total) * 100) : 0
  const avgKlik = total ? Math.round(totalKlik / total) : 0
  const avgUp = total ? Math.round(totalUp / total) : 0
  const avgScore = total ? Math.round(totalScore / total) : 0

  const topKlik = [...entries].sort((a, b) => b.clicks - a.clicks).slice(0, 10)
  const topScore = [...entries].sort((a, b) => score(b) - score(a)).slice(0, 10)
  const juara = topScore[0]

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Statistik</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        Angka apa adanya, langsung dari <AnnotatedText variant="underline">database</AnnotatedText>.
      </p>

      {juara ? (
        <section className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-100 p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Juara <AnnotatedText variant="wavy">score</AnnotatedText>
          </div>
          <Link
            href={`/entry/${juara.id}`}
            className="mt-1 block truncate text-lg font-semibold text-neutral-900 hover:underline"
          >
            {juara.title}
          </Link>
          <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-neutral-900">
            {score(juara).toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-neutral-500">
            {juara.upvotes} upvote · {juara.clicks} klik
          </div>
        </section>
      ) : null}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          label="Listing aktif"
          value={total}
          caption={total ? `Situs ${situs} · Prompt ${prompt}` : 'kosong'}
        />
        <Stat label="Total klik" value={totalKlik} caption={`≈ ${avgKlik}/listing`} />
        <Stat label="Total upvote" value={totalUp} caption={`≈ ${avgUp}/listing`} />
        <Stat label="Total score" value={totalScore} caption={`≈ ${avgScore}/listing`} />
        <Stat label="Situs" value={situs} caption={`${situsPct}% dari total`} />
        <Stat label="Prompt" value={prompt} caption={`${100 - situsPct}% dari total`} />
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Komposisi</h2>
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-200"
          role="img"
          aria-label={`Komposisi: Situs ${situsPct}%, Prompt ${100 - situsPct}%`}
        >
          <div className="h-full bg-neutral-800" style={{ width: `${situsPct}%` }} />
          <div className="h-full bg-neutral-400" style={{ width: `${100 - situsPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-neutral-500">
          <span>Situs {situs}</span>
          <span>Prompt {prompt}</span>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Paling banyak diklik</h2>
        <ol className="space-y-1 text-sm">
          {topKlik.map((e, i) => (
            <li key={e.id} className="flex items-center gap-2">
              <span className="w-5 text-neutral-400">{i + 1}</span>
              <Link
                href={`/entry/${e.id}`}
                className="truncate text-neutral-700 hover:underline"
              >
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
              <Link
                href={`/entry/${e.id}`}
                className="truncate text-neutral-700 hover:underline"
              >
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

function Stat({
  label,
  value,
  caption,
}: {
  label: string
  value: number
  caption?: string
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm">
      <div className="font-mono text-2xl font-semibold tabular-nums text-neutral-900">
        {value.toLocaleString()}
      </div>
      <div className="mt-0.5 text-xs text-neutral-500">{label}</div>
      {caption ? <div className="mt-0.5 text-[11px] text-neutral-400">{caption}</div> : null}
    </div>
  )
}
