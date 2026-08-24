# Routing — barangIF

| Route | Tipe | Komponen | Keterangan |
|---|---|---|---|
| `/` | Server | `app/page.tsx` | Board. Tab via `?board=site\|prompt` (default `site`). Fetch `listEntries(kind)`, sort by `score`. |
| `/entry/[id]` | Server | `app/entry/[id]/page.tsx` | Detail barang. `getEntry(id)`, `notFound()` kalau hidden/gak ada. |
| `_actions_` | Server Action | `app/actions.ts` | `submitEntry`, `upvoteEntry`, `registerClick` — dipanggil dari client component, bukan route terpisah. |

## Catatan
- Tab gak pakai state URL beda, cuma search param → mudah di-share & back-button aman.
- Belum ada route `/manage/[token]` (owner self-manage = Phase 2) dan
  `/api/chat` (chatbot = Phase 3).
