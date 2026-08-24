# Changelog — barangIF

Format: `YYYY-MM-DD · apa · kenapa`

- 2026-08-25 · scaffold Phase 1 (Next 15 + React 19 + Tailwind v4 + Bun) · mulai dari repo dokumen doang, sekarang udah jalan lokal tanpa akun · board Situs/Prompt, submit (validasi+honeypot+rate-limit+moderasi stub), upvote (localStorage dedup), click, seed · lib/db.ts sebagai seam (JSON kini, Supabase nanti) · UI gaya opensourceui di app/components/ui · AGENTS.md + folder agents/ dibuat biar aturan main gak stale.
- 2026-08-25 · makeover UI pakai komponen opensourceui.in + light theme · bikin board gak kelihatan template/default, vibe "pamer" lebih dapet.
- 2026-08-25 · 4 halaman + nav global (Aturan/Tentang/Statistik/Masukan) · lengkapi struktur kayak pamerin.lol, board gak cuma satu halaman.
- 2026-08-25 · wiring detail + restruktur home · EntryCard jadi stretched-link ke /entry/[id], Board punya chip kategori + load-more, ActivityFeed baru · board nyambung ke detail & home lebih informatif.
- 2026-08-25 · form toggle slide + BoardTabs gak scroll ke atas · toggle form tadi ngelag karena `key` bikin remount (ilang transisi CSS); BoardTabs `router.push` default auto-scroll ke atas pas ganti tab.
- 2026-08-25 · BoardTabs slide (prop `active` di SegmentedToggle) · chip filter & tab board belum smooth kayak toggle form, sekarang pakai controlled active + sliding pill.
- 2026-08-25 · cancel-vote (toggle) + collapsible submit form + backfill md · user minta vote bisa dibatalin & form gak harus kelihatan terus; sekalian benerin md biar gak stale (changelog/architecture/conventions/commands).
- 2026-08-25 · fix toggle /masukan + form beda per tipe · toggle Fitur/Bug/Lainnya tadinya snap back (key={type} bikin remount); sekarang controlled via prop `active`. Bug → +Langkah reproduksi (wajib) + URL; Fitur → +URL referensi. Feedback type dapat `steps`/`url`.
- 2026-08-25 · navbar kapsul + logo back-to-top · user mau navbar beda (kapsul overlap, logo melayang pas scroll buat balik atas), netral ikut palet barangIF. Kapsul gak sticky (ikut scroll hilang); logo terpisah muncul pas scrollY>300px, klik = balik ke atas.
