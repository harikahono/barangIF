# AGENTS.md

Aturan main buat agent (dan manusia) yang ngoding di repo ini. Baca ini sebelum mulai.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Bun.
Lihat `agents/overview.md` untuk detail.

## Doc discipline (WAJIB)
Setiap ada perubahan kode → **UPDATE md terkait biar gak stale**:
- struktur / routing / data flow berubah → `agents/architecture.md`
- script / cara run berubah → `agents/commands.md`
- style / naming / Server-Client rule berubah → `agents/conventions.md`
- fitur / keputusan baru → `agents/changelog.md` (format: `YYYY-MM-DD · apa · kenapa`)
- stack / tujuan berubah → `agents/overview.md`
- DB / auth berubah → `agents/database.md` / `agents/auth.md`
- kerja backend / serah-terima ke ALIM → baca `handoff for ALIM.md` (root)

Jangan biarin md dan kode menyimpang. Kalau ngerjain satu fitur, update md di akhir, bukan nanti.

## Simplicity mandate (ponytail)
Ikuti prinsip malas tapi efektif — lihat `agents/conventions.md` §Simplicity.
Singkatnya: YAGNI dulu, reuse kode yang ada, stdlib/native platform dulu,
dependency cuma kalau emang perlu, shortest diff menang.
Pengecualian (jgn dilazy-in): validasi di trust boundary, error handling anti
data loss, security, a11y, & apa pun yang explicitly diminta.

## Structure
```
app/            # Next.js App Router (page, detail, actions, components)
lib/            # db seam, types, seed, rateLimit, moderation, cn
supabase/       # migrations (siap, belum dipakai di dev lokal)
agents/         # konteks & aturan main (baca folder ini)
data/           # store lokal (gitignored, auto-seed)
handoff for ALIM.md  # serah-terima BE ke ALIM (root, baca kalau kerja backend)
```
Penjelasan lengkap di `agents/architecture.md`.

## Commands
`bun install` · `bun dev` (http://localhost:3000) · `bun run build` · `bun start`.
Lihat `agents/commands.md`.
