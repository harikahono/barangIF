import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

// ponytail: stats lokal (file JSON), seam kayak db.ts. Ganti ke Supabase nanti cukup rewrite file ini.
const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'stats.json')

const ONLINE_WINDOW = 5 * 60 * 1000 // ping dianggap "online" kalau < 5 mnt
const VISITOR_WINDOW = 60 * 60 * 1000 // visitor baru kalau IP belum muncul > 1 jam (dedup tanpa cookie)

type Stats = { totalVisits: number; pings: { ip: string; ts: number }[] }

async function read(): Promise<Stats> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Stats
  } catch {
    // ponytail: seed biar gak keliatan kosong di localhost (x-forwarded-for kosong)
    const seeded: Stats = { totalVisits: 1240, pings: [] }
    await write(seeded)
    return seeded
  }
}

async function write(s: Stats): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(s, null, 2), 'utf8')
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// Catat kunjungan: upsert ping IP (hashed), increment totalVisits kalau visitor baru.
// Return presence buat home. Race diabaikan (demo).
export async function recordVisit(ipHash: string): Promise<{ onlineNow: number; totalVisits: number }> {
  const s = await read()
  const now = Date.now()
  const prev = s.pings.find((p) => p.ip === ipHash)
  const isNewVisitor = !prev || now - prev.ts > VISITOR_WINDOW

  s.pings = s.pings.filter((p) => now - p.ts < ONLINE_WINDOW)
  const existing = s.pings.find((p) => p.ip === ipHash)
  if (existing) existing.ts = now
  else s.pings.push({ ip: ipHash, ts: now })

  if (isNewVisitor) s.totalVisits += 1
  await write(s)

  return { onlineNow: s.pings.length, totalVisits: s.totalVisits }
}
