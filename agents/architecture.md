# Architecture — barangIF

## Folder structure
```
barangIF/
├── app/
│   ├── layout.tsx              # root layout + metadata + globals
│   ├── globals.css             # Tailwind v4 entry
│   ├── page.tsx                # board (server fetch, tab via ?board=)
│   ├── entry/[id]/page.tsx     # detail barang
│   ├── actions.ts              # 'use server' mutations
│   └── components/
│       ├── BoardTabs.tsx       # tab Situs/Prompt (link ke ?board=)
│       ├── EntryCard.tsx       # satu baris di board
│       ├── UpvoteButton.tsx    # client, localStorage dedup + useOptimistic
│       ├── ClickLink.tsx       # client, register click lalu buka url
│       ├── SubmitForm.tsx      # client form (useActionState)
│       └── ui/                 # Button, Card, Input, Textarea, Badge
├── lib/
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── types.ts                # Entry, Kind
│   ├── db.ts                   # SEAM data (JSON sekarang, Supabase nanti)
│   ├── seed.ts                 # data awal
│   ├── rateLimit.ts            # in-memory per-IP (5/10mnt)
│   └── moderation.ts           # env-gated stub OpenAI
├── supabase/migrations/0001_init.sql   # schema + RLS + seed (siap)
├── data/                       # store lokal (gitignored)
└── agents/                     # konteks & aturan main
```

## Routing
- `/` → board. Tab pakai search param `?board=site|prompt` (default `site`).
  Server fetch list sesuai kind, sort by score.
- `/entry/[id]` → detail. `params.id` di cek ke `getEntry`, `notFound()` kalau gak ada.

## Data flow
```
Browser
  └─ SubmitForm (client) ──form action──▶ submitEntry()        [app/actions.ts]
  └─ UpvoteButton (client) ──▶ upvoteEntry(id)                  [app/actions.ts]
  └─ ClickLink (client)    ──▶ registerClick(id)               [app/actions.ts]
                                              │
                                  lib/db.ts (read/write JSON)
                                              │
                                  data/entries.json
  Server Component (page/entry) ──▶ listEntries()/getEntry() ──▶ lib/db.ts
```
- Mutasi lewat **Server Actions** (`'use server'`).
- Setelah mutasi: `revalidatePath('/')` (dan detail) biar board ke-refresh.
- Upvote pakai `useOptimistic` biar kerasa instan; deduplikasi per visitor via
  `localStorage` key `up_<id>`.

## DB seam (kunci)
Semua akses data lewat `lib/db.ts`:
`listEntries(kind?)` · `getEntry(id)` · `insertEntry(input)` ·
`incrementUpvotes(id)` · `incrementClicks(id)` · `score(entry)`.
Ganti ke Supabase = **rewrite 1 file ini** (lihat `agents/database.md`).
Sisanya (actions, UI) utuh.

## Simplicity (ponytail) di arsitektur
- Gak ada store global (Redux/Zustand): state lokal = `useState`, persisten =
  `localStorage`, server = DB.
- Gak ada API route terpisah buat P1 (cukup Server Actions).
- 1 tabel `entries` dengan discriminator `kind` (bukan 2 tabel).
