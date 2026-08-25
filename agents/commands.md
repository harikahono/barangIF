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
  module for page" padahal file ada / build gagal prerender `/404` dengan error
  `<Html> should not be imported outside of pages/_document` padahal gak ada
  yang import `Html`). Itu satu-satunya pengecualian.

## Verifikasi cepat — JANGAN `bun run build` tiap edit
Build produksi berat & nulis ke `.next` (bisa nabrak dev server, lihat Catatan
`.next`). Buat cek hasil kerjaan, pakai ini — BUKAN build:
- **Runtime:** `bun dev` (nyalain sekali, biarin nyala) lalu `curl`/`buka` route.
  Dev compile on-demand, detik-an.
- **Tipe:** `bun run typecheck`.
- **Lint:** `bun run lint`.
- **Full `bun run build`** cuma jadi GATE TERAKHIR: sebelum commit/push (atau di
  CI). Bukan tiap kali ngedit.
- JANGAN `rm -rf .next` pas `bun dev` lagi jalan.

## Catatan .next (cache build)
- JANGAN jalanin `bun dev` dan `bun run build`/`bun start` barengan di folder
  `.next` yang sama — keduanya nulis ke `.next`, manifest jadi tabrakan
  (gejalanya: error *"Could not find the module … in React Client Manifest"* /
  `__webpack_modules__[moduleId] is not a function`).
- Sebelum ganti mode (dev ↔ produksi), selalu: (1) kill server `bun`/`next` yang
  jalan, (2) hapus `.next` (+ `node_modules/.cache`), (3) jalanin SATU perintah.
- Kalau kena error manifest di atas: itu cache basi, **bukan** bug kode. Clear
  `.next` + cache lalu restart, beres.

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

## Lint / typecheck (cepat, gak perlu build)
- `bun run typecheck` (= `next typegen && tsc --noEmit`) → cek tipe kilat
  (beberapa detik). `next typegen` generate `.next/types` TANPA full build,
  jadi gak perlu `bun run build` dulu.
- `bun run lint` → lint cepat (`next lint`).
- Kalau jalanin `tsc --noEmit` manual TANPA `next typegen` dulu, bisa dapat
  noise `TS6053 ... .next/types/... not found` — itu karena `.next/types`
  belum digenerate, BUKAN bug kode. Pakai `bun run typecheck` aja.

## Env vars (lihat `.env.example`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase (prod)
- `SUPABASE_SERVICE_ROLE_KEY` — operasi privileged (owner token, P2)
- `SUPABASE_POOLER_URL` — pooler port 6543 buat server
- `OPENAI_API_KEY` — moderasi submit (kalau kosong, dilewati)
