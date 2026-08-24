# Overview — barangIF

## Apa ini?
Tempat pamer "barang" buat anak IF (Informatika): showcase board untuk **Situs**
(website/produk) dan **Prompt** (prompt AI), di-rank by vote. Tiap barang bisa
punya chatbot mini-RAG penjelas (opt-in, Phase 3). Tanpa login.

Nama: **barangIF** = *barang* (thing yang dipamerin) + **IF** (Informatika).

## Tujuan
- Dua leaderboard: **Situs** & **Prompt**, rank by `Score = upvotes×3 + clicks`.
- Submit ("pamer") gampang, aman dari spam tanpa akun.
- (Phase 3) chatbot yang cuma jawab dari info submitter, gak halu.

## Stack
| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI lib | React 19 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, no config file) |
| Package mgr | Bun |
| Ikon | lucide-react |
| UI components | gaya opensourceui.in (copy-paste ke `app/components/ui/`) |
| Data (dev) | file JSON lokal (`data/entries.json`) via `lib/db.ts` |
| Data (prod) | Supabase Postgres (lihat `supabase/migrations/0001_init.sql`) |
| Moderasi | OpenAI Moderation (gratis), di-stub kalau gak ada key |

## Phasing (dari SPEC.md)
- **Phase 1 (ini yang dibuild sekarang):** 2 board, submit (validasi + honeypot +
  rate-limit + moderasi), upvote, click, seed.
- **Phase 2 (optional):** search/filter, copy-prompt, owner token self-manage,
  report auto-hide.
- **Phase 3:** chatbot mini-RAG per barang.

## Status
Scaffold MVP jalan lokal tanpa akun eksternal. Lihat `agents/changelog.md`.
