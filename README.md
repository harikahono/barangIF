# barangIF

> Tempat pamer "barang" buat anak IF — showcase board untuk **Situs** & **Prompt**, di-rank by vote. Tiap barang bisa punya chatbot mini-RAG penjelas (opt-in). Tanpa login.

## Apa ini?

barangIF = *barang* (thing yang lo pamerin) + **IF** (Informatika). Dua leaderboard:
- **Situs** — pamer link website/produk (jiwa pamerin.lol)
- **Prompt** — pamer prompt/playbook AI (jiwa moldingflask)

Tiap entri di-rank by **Score = upvotes×3 + klik**. Submitternya bisa pilih: mau ada chatbot penjelas (mini-RAG, jiwa orkata) atau nggak.

## Struktur repo

```
barangIF/
├── CONTEXT.md              # glossary domain
├── SPEC.md                 # rencana produk lengkap
├── AGENTS.md               # aturan main agent + konteks
├── agents/                 # konteks & aturan (architecture, commands, dll)
├── docs/adr/0001-*.md      # keputusan arsitektur
├── supabase/migrations/    # schema SQL + seed (target prod)
├── app/                    # Next.js App Router (board, detail, actions, api/chat)
├── lib/                    # db seam, moderation, rate limit, cn, seed, types
├── data/                   # store lokal (gitignored, auto-seed)
├── public/                 # aset statis
└── README.md
```

## Cara jalanin lokal

```bash
bun install
cp .env.example .env.local   # isi SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY
bun dev                      # http://localhost:3000
# build: bun run build  (jangan pakai --turbo saat pakai Bun)
```

Env vars (lihat `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dari Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — hanya untuk operasi privileged (owner token delete), jangan dibagi
- `OPENAI_API_KEY` — moderasi (free) + chatbot Phase 3

## Database

Phase 1 dev jalan di **local JSON store** lewat `lib/db.ts` (data di `data/`, gitignored, auto-seed) — gak butuh Supabase buat lokal. `supabase/migrations/0001_init.sql` sudah ada sebagai **target prod** (bikin tabel `entries` + RLS + seed) tapi belum diwire di dev; nanti tinggal ganti seam `lib/db.ts` ke Supabase.

## Deploy

Push ke GitHub → import ke Vercel → set env vars → deploy. (Supabase×Vercel integration bisa auto-set env.)

## Status

Phase 1 (MVP) sedang dibangun. Lihat `SPEC.md` untuk detail.
