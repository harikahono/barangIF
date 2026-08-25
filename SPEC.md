# barangIF — Product Spec

> Single source of truth for the barangIF build. Derived from planning conversation. Owner: builder. Status: Phase 1 (MVP) in progress.

## 1. Vision

A place for Informatika (IF) students and builders to **pamer** ("show off") interesting things they made or found — **Situs** (websites/products) and **Prompt** (AI prompts/playbooks) — ranked by community votes. Every entry can optionally carry a **mini-RAG chatbot** that explains what it is, grounded only in info the submitter provided (so it never hallucinates).

Name: **barangIF** = *barang* (thing you show off) + **IF** (Informatika, the builder's major).

## 2. Core mechanics

- **Two boards** (tabs): `Situs` and `Prompt`. Each is a ranked list.
- **Score** = `upvotes × 3 + clicks`. Higher score = higher on the board.
- **Upvote**: increments `upvotes`. Deduped per visitor via `localStorage` (no account needed).
- **Click**: opening a Barang's destination link increments `clicks` and `Score`.
- **Submit (pamer)**: a form. User picks kind (Situs/Prompt), fills basics, then a toggle **"Mo ada chatbot penjelas? [Ya / Gak]"**:
  - **Ya** → structured info fields appear and are **required** (with instruction: "Lengkapi biar bot gak ngablu"):
    - Situs: fitur utama, use case, pricing, platform
    - Prompt: model, variables, use case, contoh output
    - Stored in `meta` (jsonb) → becomes the mini-RAG corpus.
  - **Gak** → no extra fields, no chatbot on the detail page.
- **Detail page**: shows full info. If `has_chatbot`, a **floating chat widget** (Phase 3) explains the Barang. If not, the page is clean (no widget).

## 3. Tech stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase Postgres** (free tier: 2 projects, 500 MB DB) — target production storage
- **@supabase/ssr** — server-side DB access (`await cookies()` pattern) for prod
- **DB seam `lib/db.ts`** — Phase 1 dev runs on a local JSON store (`data/`, gitignored, auto-seed); Supabase wired in later by swapping the seam, no call-site changes
- **Vercel** — deploy (native Next.js, preview per PR)
- **Supabase pooler** (port 6543) for server connections
- **OpenAI Moderation API** (`omni-moderation-latest`, free) — submit-time content check
- **LLM API** (OpenAI/Anthropic, free tier available) — Phase 3 chatbot

## 4. Data model

Table `entries`:

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `kind` | text | `'site'` \| `'prompt'` |
| `title` | text | required |
| `url` | text | site only; must be http(s) |
| `description` | text | site: tagline/desc; prompt: short note |
| `body` | text | prompt only; the prompt text |
| `variables` | text | prompt only; e.g. `{{file}}` |
| `category` | text | optional |
| `has_chatbot` | bool | default false |
| `meta` | jsonb | structured info; required & complete when `has_chatbot=true`; null otherwise |
| `upvotes` | int | default 0 |
| `clicks` | int | default 0 |
| `reports` | int | default 0 (distinct-IP count) |
| `hidden` | bool | default false (auto-set when reports ≥ threshold) |
| `created_at` | timestamptz | default now() |

RLS: `anon` can `SELECT` and `INSERT` on `entries`. No `UPDATE`/`DELETE` for anon (self-delete uses owner token via a privileged path or a `DELETE` guarded by token). Filter board queries by `hidden = false`.

## 5. Pages & server actions

- `app/page.tsx` — board with tab Situs / Prompt (server fetch, client toggle). Lists ranked Barang with favicon, score, upvote button, click link.
- `app/entry/[id]/page.tsx` — detail. Situs: description + link + (Phase 3) chat. Prompt: body + variables + Copy button + (Phase 3) chat. Chat widget rendered **only if `has_chatbot`**.
- `app/actions.ts`:
  - `submitEntry(formData)` — validates, honeypot check, rate-limit check, moderation check, inserts row; if `has_chatbot` requires complete `meta`.
  - `upvoteEntry(id)` — increments `upvotes`.
  - `registerClick(id)` — increments `clicks`.
  - `reportEntry(id)` — increments `reports` (per-IP guard); sets `hidden` if threshold crossed.
- `app/api/chat/route.ts` — Phase 3 mini-RAG: takes entry context + question, calls LLM with grounding system prompt.
- `lib/db.ts` — DB seam: local JSON store in dev, Supabase in prod.
- `lib/moderation.ts` — OpenAI Moderation call.
- `lib/rateLimit.ts` — per-IP counter (Supabase table or KV).
- `supabase/migrations/0001_init.sql` — schema + RLS + seed.

## 6. Safety (no auth / no admin)

- **Validation**: URL must be http(s); all text fields length-capped; HTML escaped (no stored XSS).
- **Honeypot**: hidden field; if filled → reject (catches bots).
- **Rate limit**: max 5 submits / 10 min / IP.
- **Moderation**: submit text → OpenAI Moderation; if `flagged` (sexual/hate/violence/self-harm) → reject.
- **Community Report**: visitor can report; `reports` counts distinct IPs; `hidden=true` past threshold → auto-removed from board.
- **Owner token**: returned once at submit; `/manage/[token]` lets submitter delete/edit own Barang.
- Trade-off: automated + community moderation is not 100% (esp. subtle SARA nuance) but sufficient for a portfolio demo; a real admin can be added later via an env-gated route.

## 7. Phasing

- **Phase 1 (MVP)**: two boards + submit (toggle + validation + honeypot + rate limit + moderation) + upvote/click + persist + seed data.
- **Phase 2 (optional)**: search/filter, copy-prompt button, owner token self-manage, report auto-hide.
- **Phase 3**: chatbot mini-RAG on entries with `has_chatbot=true`.

## 8. Seed data

- **Situs**: luvus.dev, orkata.co, moldingflask.vercel.app, pamerin.lol (+ a few more).
- **Prompt**: "Bikin chatbot FAQ dari PDF", "Security audit assistant", "Threat model generator".
- Some entries `has_chatbot=true` for demo.

## 9. Deploy

1. Create Supabase project (free) → run `0001_init.sql` → copy env. (Dev lokal gak butuh Supabase — pakai JSON store lewat `lib/db.ts`.)
2. `bun install` → `bun dev` → test submit / upvote / click (`bun run build` untuk produksi, jangan `--turbo`).
3. Push to GitHub → import to Vercel → set env vars (or use Supabase×Vercel integration) → deploy.
4. Domain: `barangif.vercel.app` (or buy `barangif.dev`).
