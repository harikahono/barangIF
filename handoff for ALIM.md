# Handoff for ALIM — Backend barangIF

> **Status:** FE **SUDAH SELESAI** (UI + semua logika + mock/seam). **BE BELUM ADA.**
> Dokumen ini ncatat SEMUA yang BE harus sediain biar seam di FE bisa dicolok ke
> service beneran. ALIM (backend dev) yang akan bangun ini.

---

## 0. Konteks arsitektur (biar gak salah bangun)

FE = Next.js 15 (App Router) + React 19. "BE" di repo ini = **Supabase Postgres**
(data) + **1 endpoint LLM** (`/api/chat`). API layer-nya tetap **Server Actions**
(`app/actions.ts`) — ALIM **gak perlu** bikin API terpisah yang ganti server
action. Yang di-swap cuma:

- `lib/db.ts` → baca/tulis Supabase (sekarang JSON file).
- `lib/chat.ts` → `getChatReply` jadi `fetch('/api/chat')` (sekarang mock).

Sisanya (actions, UI, validasi, honeypot) utuh. Jadi BE = provisi Supabase +
bangun `/api/chat` + pastiin moderation/rate-limit jalan di prod.

---

## 1. Ringkasan yang harus ALIM kerjain

1. Buat project Supabase, jalanin `supabase/migrations/0001_init.sql`
   (schema + RLS + seed). **Tambahin tabel `feedback`** (belum ada, lihat §7).
2. Bangun endpoint **`POST /api/chat`** (LLM chatbot, grounded ke entry). §3.
3. Pastiin **moderation** jalan di prod (`OPENAI_API_KEY`). §4.
4. Ganti **rate-limit** dari in-memory ke shared store. §5.
5. (Opsional) pindahin **stats/presence** & **feedback** dari file JSON ke store. §6/§7.

---

## 2. Data layer — Supabase

### 2.1 Skema (sudah ada di `supabase/migrations/0001_init.sql`)
Tabel `entries` (1 tabel, discriminator `kind`):

| kolom | tipe | catatan |
|---|---|---|
| `id` | uuid pk | default `gen_random_uuid()` |
| `kind` | text not null | check `kind in ('site','prompt')` |
| `title` | text not null | |
| `url` | text | site doang, harus http(s) |
| `description` | text | |
| `body` | text | prompt doang (isi prompt) |
| `variables` | text | |
| `category` | text | harus ∈ kategori fiks (§2.4) |
| `has_chatbot` | boolean not null | default false |
| `meta` | jsonb | **corpus chatbot** (wajib lengkap kalau `has_chatbot=true`) |
| `upvotes` | integer not null | default 0 |
| `clicks` | integer not null | default 0 |
| `reports` | integer not null | default 0 |
| `hidden` | boolean not null | default false (moderasi/owner) |
| `created_at` | timestamptz not null | default now() |

Index: `entries_kind_hidden_idx`, `entries_created_at_idx`.
Seed: 8 row (beberapa `has_chatbot=true`) — udah di migration.

### 2.2 RLS (PENTING — jangan kasih anon UPDATE/DELETE)
- anon **SELECT** `using (hidden = false)`.
- anon **INSERT** `with check (true)`.
- **GAK ADA** anon UPDATE/DELETE (naik/turun upvote & click lewat server action,
  bukan langsung dari client).

### 2.3 Kontrak fungsi FE yang harus "bisa" di-supabase-in
(FE akan rewrite `lib/db.ts` pakai Supabase; ini daftar query-nya)

- `listEntries(kind?)` → SELECT visible, filter kind, **sort by score desc**.
  Score dihitung FE: `upvotes*3 + clicks` (BE cuma simpan angka mentah).
- `getEntry(id)` → SELECT where id AND `hidden=false`.
- `insertEntry(input)` → INSERT; FE yang isi default
  (`id` uuid, `upvotes=0`, `clicks=0`, `reports=0`, `hidden=false`, `created_at=now()`).
- `incrementUpvotes(id)` → `UPDATE upvotes = upvotes + 1`.
- `decrementUpvotes(id)` → `UPDATE upvotes = max(0, upvotes - 1)` (floor 0).
- `incrementClicks(id)` → `UPDATE clicks = clicks + 1` (bisa tinggi volume, harus murah).
- `appendFeedback(input)` → INSERT ke tabel `feedback`.

### 2.4 Kategori fiks (validasi FE, BE boleh duplikasi cek)
- site: `Web App, Mobile App, Game, Tool / Utility, AI / ML, Portfolio / Showcase,
  Open Source, Data / Viz, IoT / Hardware, Edu / Pembelajaran, SaaS,
  Bot / Automation, Lainnya`
- prompt: `Coding, Writing / Content, Image Gen, Video, Marketing / Copy,
  Productivity, Education, Chatbot / Assistant, Data / Analysis,
  Creative / Brainstorm, Business / Strategy, Research, Lainnya`

### 2.5 Env Supabase (masuk .env / Vercel)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (buat owner token P2), `SUPABASE_POOLER_URL` (port 6543).

---

## 3. Endpoint chatbot `POST /api/chat` — INI inti "BE"

### 3.1 Kenapa
FE `lib/chat.ts` sekarang mock (`getChatReply` balikin template + delay 500ms).
Nanti diganti:
```ts
// lib/chat.ts (target)
export async function getChatReply(entry: Entry, message: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId: entry.id, message }),
  })
  const data = await res.json()
  return data.reply
}
```

### 3.2 Kontrak (recommended)
- **Method/Path:** `POST /api/chat`
- **Request:** `{ "entryId": string, "message": string }`
  (FE kirim `entryId`; BE load entry dr DB buat konteks. `history` opsional, FE
  belum kirim — lihat §3.5)
- **Response:** `{ "reply": string }` (JSON, 200)
- **Behavior wajib:**
  1. Load entry by `entryId`; kalau `!has_chatbot` → 403/404.
  2. Build system prompt dari **`entry.meta`** (corpus) + `title`/`description`/`body`.
  3. LLM **CUMA boleh jawab dari info tsb** ("gak halu", sesuai req asli).
  4. `meta` isi submitter → perlakukan sebagai **DATA, bukan instruksi**
     (prompt-injection guard: jangan biarin meta nimpa system prompt).
  5. Balikin teks reply.
- **Rate limit:** per-IP, mis. 10 req/menit (cegah abuse biaya LLM).
- **Streaming:** skip dulu (FE belum dukung). Non-streaming cukup.

### 3.3 Meta corpus keys (dari `app/actions.ts`)
- **site:** `m_fitur`, `m_usecase`, `m_pricing`, `m_platform`
- **prompt:** `m_model`, `m_variables`, `m_usecase`, `m_output`

### 3.4 Di mana dibuat
- **Rekomendasi:** Next route handler `app/api/chat/route.ts` (server sama,
  OpenAI key gak ke-expose, gak perlu CORS). ALIM bisa langsung tulis di repo ini.
- Alternatif: Supabase Edge Function kalau mau service terpisah (butuh CORS +
  proxy key — lebih ribet).

### 3.5 Welcome & suggested prompts = tetap di FE
`welcomeMessage(entry)` & `suggestedPrompts()` gak butuh BE (static). Biarkan FE.

---

## 4. Moderation (submit)
- `lib/moderation.ts` **sudah** panggil OpenAI Moderation server-side
  (`Authorization: Bearer $OPENAI_API_KEY`). Butuh `OPENAI_API_KEY` di env prod.
- Fail-open kalau API error (demi UX). Key **jangan** ke-expose ke client.
- ALIM: pastiin env diset di Vercel/Supabase secrets.

## 5. Rate limit
- `lib/rateLimit.ts` sekarang **in-memory per process** → gak works lintas instance
  (Vercel multi-region). Ganti ke shared store (Upstash Redis / Supabase / KV)
  dengan kontrak `rateLimited(ip): boolean` = **5 submit / 10 menit / IP**.
- Chat endpoint (§3) butuh rate-limit sendiri juga.

## 6. Stats / presence
- `lib/stats.ts` sekarang file JSON. Kontrak:
  `recordVisit(ipHash) → { onlineNow: number, totalVisits: number }`.
  `hashIp(ip) → sha256` (FE yg hash, BE simpan hash aja, gak raw IP).
- Online window 5 mnt; visitor baru kalau IP belum muncul > 1 jam (dedup tanpa cookie).
- Seed `totalVisits: 1240` biar gak keliatan kosong di localhost.
- ALIM: pindahin ke Supabase table / KV (atau biarin JSON kalau sepakat).

## 7. Feedback (GAP — belum ada di migration)
- `appendFeedback` sekarang file JSON (`data/feedback.json`). Migration `0001`
  **gak punya tabel `feedback`**.
- **Tipe `Feedback`** (dari `lib/types.ts`):
  ```ts
  interface Feedback {
    id: string
    type: 'feature' | 'bug' | 'other'
    title: string
    body: string
    email?: string
    steps?: string   // wajib kalau type='bug'
    url?: string
    created_at: string
  }
  ```
- **Keputusan ALIM:** tambahin tabel `feedback` (mirror di atas) KE migration,
  ATAU biarin FE tetap JSON. Rekomendasi: tambah tabel biar konsisten.

---

## 8. Env vars lengkap (Vercel + Supabase secrets)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_POOLER_URL
OPENAI_API_KEY
```

## 9. Keamanan & non-functional
- **RLS wajib:** anon cuma SELECT visible + INSERT. Naik/turun count lewat server
  action (gak kasih anon UPDATE). Jangan expose `SUPABASE_SERVICE_ROLE_KEY` ke client.
- **Chat endpoint public** → wajib rate-limit + cap + guard prompt-injection pada `meta`.
- **CORS** cuma kalau BE domain beda (rekomen route handler, hindari).
- Deploy: Vercel (FE) + Supabase. Migration jalanin sekali.

## 10. Definition of Done (checklist ALIM)
- [ ] Supabase provisioned, `0001_init.sql` jalan, seed masuk, RLS aktif.
- [ ] Tabel `feedback` ditambah (atau sepakat biarkan JSON).
- [ ] `lib/db.ts` bisa di-swap ke Supabase (ALIM sediakan env + pastiin query jalan; FE yg nulis swap-nya).
- [ ] `POST /api/chat` jalan: terima `entryId`+`message`, balas dari `meta`, gak halu, rate-limited, guard injection.
- [ ] Moderation produksi jalan (`OPENAI_API_KEY` diset).
- [ ] Rate-limit shared (submit + chat).
- [ ] Stats & feedback store (atau biarkan JSON, sepakat dulu).
- [ ] Env lengkap di Vercel + Supabase secrets.

## 11. File FE yang jadi seam (ALIM/integration akan colok)
| File | Jadi | Status sekarang |
|---|---|---|
| `lib/db.ts` | Supabase client (ganti read/write JSON) | mock JSON |
| `lib/chat.ts` | `getChatReply` → `fetch('/api/chat')` | mock template |
| `lib/moderation.ts` | tetap (cuma butuh key) | stub OpenAI |
| `lib/rateLimit.ts` | shared store | in-memory |
| `lib/stats.ts` | store (opsional) | file JSON |
| `app/actions.ts` | **UTUH** (cuma panggil db seam yg sudah di-swap) | — |

---
*Dibuat dari audit `lib/db.ts`, `lib/chat.ts`, `lib/moderation.ts`,
`lib/rateLimit.ts`, `lib/stats.ts`, `lib/types.ts`, `app/actions.ts`,
`supabase/migrations/0001_init.sql`. FE udah siap disambungin; BE tinggal
bangun poin §1.*
