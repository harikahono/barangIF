import Link from 'next/link'
import { headers } from 'next/headers'
import type { Kind } from '@/lib/types'
import { listEntries, score } from '@/lib/db'
import { recordVisit, hashIp } from '@/lib/stats'
import { BoardTabs } from '@/app/components/BoardTabs'
import { Board } from '@/app/components/Board'
import { ActivityFeed } from '@/app/components/ActivityFeed'
import { SubmitForm } from '@/app/components/SubmitForm'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m} mnt lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const day = Math.floor(h / 24)
  return `${day} hr lalu`
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>
}) {
  const { board } = await searchParams
  const active: Kind = board === 'prompt' ? 'prompt' : 'site'
  const entries = await listEntries(active)
  const all = await listEntries() // global, buat pulse

  // presence: hitung IP + catat kunjungan (seam stats lokal)
  const fwd = (await headers()).get('x-forwarded-for')
  const ip = fwd?.split(',')[0]?.trim() || 'unknown'
  const { onlineNow, totalVisits } = await recordVisit(hashIp(ip))

  const totalBarang = all.length
  const totalUpvotes = all.reduce((s, e) => s + e.upvotes, 0)
  const totalKlik = all.reduce((s, e) => s + e.clicks, 0)
  const situs = all.filter((e) => e.kind === 'site').length
  const prompt = all.filter((e) => e.kind === 'prompt').length
  const ramai = [...all].sort((a, b) => score(b) - score(a))[0]
  const terbaru = [...all].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0]

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-center text-2xl font-bold text-neutral-900">
        Tempat pamer barang buat anak IF
      </h1>

      <div className="mb-6 text-center text-sm text-neutral-500">
        <p className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          {onlineNow} orang lagi ngecek · {totalVisits.toLocaleString()} kunjungan
        </p>
        <p className="mt-1">
          {totalBarang} barang · {totalUpvotes} upvotes · {totalKlik} klik · {situs} Situs / {prompt} Prompt
        </p>
        {(ramai || terbaru) && (
          <p className="mt-1">
            {ramai && (
              <>
                Lagi ramai:{' '}
                <Link href={`/entry/${ramai.id}`} className="text-neutral-700 hover:underline">
                  {ramai.title}
                </Link>
              </>
            )}
            {ramai && terbaru && ' · '}
            {terbaru && (
              <>
                Terbaru:{' '}
                <Link href={`/entry/${terbaru.id}`} className="text-neutral-700 hover:underline">
                  {terbaru.title}
                </Link>{' '}
                ({timeAgo(terbaru.created_at)})
              </>
            )}
          </p>
        )}
      </div>

      <SubmitForm />
      <BoardTabs active={active} />
      <Board entries={entries} />
      <ActivityFeed entries={entries} />
    </main>
  )
}
