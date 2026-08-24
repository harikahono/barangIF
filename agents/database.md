# Database — barangIF

## Sekarang (dev lokal): file JSON
- Store: `data/entries.json` (gitignored, auto-seed dari `lib/seed.ts` kalau kosong).
- Semua akses lewat `lib/db.ts`. Jangan baca/tulis JSON dari luar file itu.
- `score(entry) = upvotes*3 + clicks`.
- **Limitasi:** per-process & gak persist di serverless (Vercel). Cukup buat demo
  & kolaborasi lokal.

## Nanti (prod): Supabase Postgres
1. Buat project Supabase (free) → jalankan `supabase/migrations/0001_init.sql`
   di SQL editor.
2. Isi `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_POOLER_URL` (port 6543).
3. **Ganti isi `lib/db.ts`** ke `@supabase/ssr` (pola `cookies()` di server action).
   Function-nya tetap sama (`listEntries`, `getEntry`, `insertEntry`,
   `incrementUpvotes`, `incrementClicks`), jadi `app/actions.ts` & UI utuh.
4. `lib/moderation.ts` bisa diisi panggilan OpenAI beneran (sudah ada stub).

## Skema (ringkas, lihat 0001_init.sql)
Tabel `entries`:
`id uuid pk · kind text ('site'|'prompt') · title · url? · description? ·
body? · variables? · category? · has_chatbot bool · meta jsonb? ·
upvotes int · clicks int · reports int · hidden bool · created_at timestamptz`

RLS: anon `SELECT` (filter `hidden=false`) & `INSERT`. Gak ada `UPDATE`/`DELETE`
anon — self-delete pakai service role lewat owner token (Phase 2).

## Rate limit
Sekarang: in-memory `lib/rateLimit.ts` (5 submit / 10 menit / IP).
Kalau butuh lintas instance → Redis/KV (ganti implementasi di file itu).
