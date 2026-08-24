# Architecture — barangIF

## Folder structure
```
barangIF/
├── app/
│   ├── layout.tsx              # root layout + metadata + globals
│   ├── globals.css             # Tailwind v4 entry
│   ├── page.tsx                # board (server fetch, tab via ?board=)
│   ├── entry/[id]/page.tsx     # detail barang
│   ├── entry/[id]/EntryVotePanel.tsx  # 'use client', panel vote di detail
│   ├── actions.ts              # 'use server' mutations
│   └── components/
│       ├── BoardTabs.tsx       # tab Situs/Prompt (SegmentedToggle controlled)
│       ├── EntryCard.tsx       # 'use client', baris board + state ups
│       ├── UpvoteButton.tsx    # 'use client', TOGGLE vote/cancel + onChange
│       ├── ClickLink.tsx       # client, register click lalu buka url
│       ├── SubmitForm.tsx      # 'use client', COLLAPSIBLE (default tutup)
│       └── ui/                 # Button, Card, Input, Textarea, Badge, SegmentedToggle
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
  └─ UpvoteButton (client, TOGGLE)
        klik 1 → upvoteEntry(id)   (delta +1)
        klik 2 → cancelVote(id)    (delta -1)
        └─ onChange(delta) ─▶ parent update state ups
  └─ ClickLink (client)    ──▶ registerClick(id)               [app/actions.ts]
                                               │
                                   lib/db.ts (read/write JSON)
                                               │
                                   data/entries.json
  Server Component (page/entry) ──▶ listEntries()/getEntry() ──▶ lib/db.ts
```
- Mutasi lewat **Server Actions** (`'use server'`).
- Setelah mutasi: `revalidatePath('/')` (dan detail) biar board ke-refresh.
- **Upvote sekarang toggle:** klik pertama naik (+1), klik lagi batal (-1).
  Dedup per visitor via `localStorage` key `up_<id>`. Perubahan dilempar ke
  parent lewat `onChange(delta)` biar Score update instan tanpa tunggu server.
- **EntryCard & EntryVotePanel pegang state `ups` sendiri**; Score dihitung
  INLINE `ups*3 + entry.clicks`. Jangan impor `score` dari `@/lib/db` di client
  (db pakai `fs` → bundle client rusak).

## DB seam (kunci)
Semua akses data lewat `lib/db.ts`:
`listEntries(kind?)` · `getEntry(id)` · `insertEntry(input)` ·
`incrementUpvotes(id)` · `decrementUpvotes(id)` · `incrementClicks(id)` ·
`score(entry)`.
Action di `app/actions.ts`: `submitEntry`, `upvoteEntry`, `cancelVote`,
`registerClick`.
Ganti ke Supabase = **rewrite 1 file ini** (lihat `agents/database.md`).
Sisanya (actions, UI) utuh.

## UI patterns
- **Toggle halus:** `SegmentedToggle` (sliding pill) dipakai di 3 tempat (form
  kind, form chat, BoardTabs). Jangan kasih `key` yang berubah ke child-nya —
  bikin remount & ilang transisi CSS.
- **Collapsible tanpa dep:** CSS grid `grid-template-rows: 0fr → 1fr` +
  `transition-[grid-template-rows]`, inner `overflow-hidden`. SubmitForm default
  tutup, tombol "Pamerin barang" buka, auto-lipat (`inert` pas tertutup) setelah
  submit sukses. Gak pakai max-height hack / JS measuring / library.

## Simplicity (ponytail) di arsitektur
- Gak ada store global (Redux/Zustand): state lokal = `useState`, persisten =
  `localStorage`, server = DB.
- Gak ada API route terpisah buat P1 (cukup Server Actions).
- 1 tabel `entries` dengan discriminator `kind` (bukan 2 tabel).
