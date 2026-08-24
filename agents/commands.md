# Commands — barangIF

## Setup
```bash
bun install
cp .env.example .env.local   # isi kalau sudah punya Supabase / OpenAI (opsional)
```

## Run (dev)
```bash
bun dev        # http://localhost:3000
```
Buka `/` → board. Submit / upvote / click langsung jalan (store lokal di
`data/entries.json`, auto-seed kalau kosong).

## Build & start (prod)
```bash
bun run build  # jangan pakai --turbo
bun start
```
> Catatan: store `data/entries.json` gak persist di Vercel serverless. Buat
> produksi, pindah ke Supabase (lihat `agents/database.md`).

## Lint / typecheck
Next menyertakan `next lint` & type-check saat `build`. Belum ada CI terpisah.

## Env vars (lihat `.env.example`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase (prod)
- `SUPABASE_SERVICE_ROLE_KEY` — operasi privileged (owner token, P2)
- `SUPABASE_POOLER_URL` — pooler port 6543 buat server
- `OPENAI_API_KEY` — moderasi submit (kalau kosong, dilewati)
