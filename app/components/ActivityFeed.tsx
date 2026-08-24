import Link from 'next/link'
import type { Entry } from '@/lib/types'

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

export function ActivityFeed({ entries }: { entries: Entry[] }) {
  const recent = [...entries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)

  if (recent.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold text-neutral-700">Aktivitas terbaru</h2>
      <ul className="space-y-1 text-sm">
        {recent.map((e) => (
          <li key={e.id} className="flex items-center gap-2">
            <Link href={`/entry/${e.id}`} className="truncate text-neutral-700 hover:underline">
              {e.title}
            </Link>
            <span className="ml-auto shrink-0 text-xs text-neutral-400">{timeAgo(e.created_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
