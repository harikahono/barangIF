# Commands — barangIF

## Setup
```bash
bun install
cp .env.example .env.local   # isi kalau sudah punya Supabase / OpenAI (opsional)
```

## Run (dev) — perintah utama harian
```bash
bun dev        # http://localhost:3000
```
Buka `/` → board. Submit / upvote / click langsung jalan (store lokal di
`data/entries.json`, auto-seed kalau kosong).
- `next dev` bikin `.next` otomatis & hot-reload — **gak perlu `build` dulu**.
- Window server yang jalan itu wajar; stop pakai Ctrl+C.
- **JANGAN hapus `.next` sembarangan.** Cuma clear (hapus folder `.next`)
  kalau beneran kena stale-cache (gejalanya: `PageNotFoundError` / "Cannot find
  module for page" padahal file ada). Itu satu-satunya pengecualian.

## Build & start (prod)
```bash
bun run build  # jangan pakai --turbo
bun start
```
- `bun start` = `next start` = server **produksi** yang menyajikan hasil `build`.
  BUTUH `.next` dari `bun run build` dulu.
- Kalau dapat `ENOENT .next/routes-manifest.json` → `.next` kosong/kehapus.
  Jalankan `bun run build` dulu, baru `bun start`.
- Sebelum jalanin server baru, pastikan gak ada sisa proses `bun`/`next` yang
  nyangkut di port 3000 (kill dulu biar gak `exit 58` / port bentrok).

## Lint / typecheck
- `bun run build` **SUDAH** jalanin type-check (tsc internal) — pakai ini buat
  cek tipe & build sekaligus.
- `bunx tsc --noEmit` sendiri **PASTI error** kalau `.next` kosong, karena
  `tsconfig.json` `include` punya `.next/types/**/*.ts` yang cuma ada SETELAH
  `build`/`dev`. Itu *noise*, BUKAN bug kode. Jangan panik lihat
  `TS6053 ... .next/types/... not found`.
- `next lint` tersedia (belum di-setup CI terpisah).

## Env vars (lihat `.env.example`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase (prod)
- `SUPABASE_SERVICE_ROLE_KEY` — operasi privileged (owner token, P2)
- `SUPABASE_POOLER_URL` — pooler port 6543 buat server
- `OPENAI_API_KEY` — moderasi submit (kalau kosong, dilewati)
