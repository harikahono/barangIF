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

## Naming
- Tipe: `Entry`, `Kind` (`'site' | 'prompt'`) di `lib/types.ts`.
- Meta field chatbot pakai prefix `m_` di formData (`m_fitur`, `m_model`, ...).
- Function data: `listEntries`, `getEntry`, `insertEntry`, `incrementUpvotes`,
  `incrementClicks`, `score`.

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

## Doc discipline
Tiap ubah kode, update md terkait (lihat `AGENTS.md`). Jangan biarin md stale.
