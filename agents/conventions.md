# Conventions — barangIF

## Code style
- TypeScript strict (`strict: true` di tsconfig).
- Tailwind utility classes; komponen pakai `cn()` (clsx + tailwind-merge) buat
  gabungin class, jangan template-string manual yang konflik.
- Import pakai alias `@/*` (mis. `@/lib/db`, `@/app/components/...`).
- File komponen: PascalCase, 1 komponen utama per file.
- Bahasa UI: Indonesia casual (sesuai vibe "pamer"), tapi identifier tetap English.

## Server vs Client Component
- Default: **Server Component** (board, detail, layout).
- Tandai `'use client'` hanya kalau butuh: state (`useState`), event handler,
  `localStorage`, `useOptimistic`/`useTransition`, `useActionState`.
- Komponen di `app/components/ui/` boleh client bila perlu, tapi sebisa mungkin
  presentational (bisa dipakai server & client).
- Server Action di `app/actions.ts` diawali `'use server'`.
- **Client components sejauh ini:** `EntryCard`, `EntryVotePanel`,
  `UpvoteButton`, `ClickLink`, `SubmitForm` (semua butuh state/event/localStorage).

## Naming
- Tipe: `Entry`, `Kind` (`'site' | 'prompt'`) di `lib/types.ts`.
- Meta field chatbot pakai prefix `m_` di formData (`m_fitur`, `m_model`, ...).
- Function data: `listEntries`, `getEntry`, `insertEntry`, `incrementUpvotes`,
  `decrementUpvotes`, `incrementClicks`, `score`.
- Action: `submitEntry`, `upvoteEntry`, `cancelVote`, `registerClick`.

## Simplicity mandate (ponytail)
Sebelum nambah kode, naik tangga ini dan berhenti di rung pertama yang menahan:
1. **Butuh beneran?** (YAGNI) — jangan bangun buat "nanti".
2. **Sudah ada di repo?** — reuse dulu sebelum nulis baru.
3. **Stdlib/platform native cukup?** — `<input type="date">` > lib picker, CSS > JS.
4. **Dependency sudah terpasang?** — pakai itu, jangan tambah baru buat 3 baris.
5. **Bisa 1 baris?** — 1 baris menang.
6. Baru tulis minimal yang works.

Pengecualian (jgn dilazy-in): validasi di trust boundary, error handling anti
data loss, security, a11y, & apa pun yang explicitly diminta user.

Tandai simplifikasi sengaja dengan komentar `// ponytail: ...` (sebutkan ceiling
& upgrade path kalau ada, mis. `// ponytail: in-memory, ganti Redis kalau perlu`).

## Patterns
- **Vote toggle:** `UpvoteButton` jadi toggle (vote/cancel) + `onChange(delta)`.
  Parent (`EntryCard` / `EntryVotePanel`) simpan `ups` di `useState`, hitung Score
  inline `ups*3 + entry.clicks`. Client component **GAK boleh** impor `score` dari
  `@/lib/db` (db pakai `fs` → bundle client rusak).
- **Collapsible:** pakai CSS grid `0fr/1fr` + `transition-[grid-template-rows]`
  (inner `overflow-hidden`). Jangan pakai max-height hack / JS measuring /
  library. Default tutup + `inert` pas tertutup biar gak focusable.
- **Build/typecheck:** pakai `bun run build` (udah type-check). Jangan jalanin
  `bunx tsc --noEmit` telanjang — bakal error karena `.next/types` belum ada.

## Doc discipline
Tiap ubah kode, update md terkait (lihat `AGENTS.md`). Jangan biarin md stale.
