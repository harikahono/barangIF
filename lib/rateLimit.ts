// ponytail: rate-limit in-memory per process. Cukup buat demo lokal;
// ganti ke Redis/KV kalau butuh lintas instance (lihat agents/database.md).
const hits = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX = 5

export function rateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (rec.count >= MAX) return true
  rec.count += 1
  return false
}
