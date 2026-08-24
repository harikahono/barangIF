# barangIF Architecture: Next.js + Supabase, two boards, opt-in chatbot, no auth

barangIF is a public showcase with two leaderboards (Situs, Prompt), an opt-in per-Barang mini-RAG chatbot, and no user accounts. We chose Next.js 15 (App Router) + TypeScript + Tailwind for the frontend, Supabase Postgres (free tier) for storage, deployed on Vercel.

Decisions and why:

- **One `entries` table with a `kind` discriminator** instead of two tables, because the two boards share identical behavior (submit, vote, click, rank). One table avoids duplicated server actions and duplicated RLS policies.
- **Chatbot is opt-in per Barang via `has_chatbot`**, with `meta` required-and-complete when true, so we never show a chatbot that would hallucinate on an entry lacking grounded context.
- **No auth / no admin.** Safety is enforced by (1) submit-time OpenAI Moderation API (free) rejecting sexual / hate / violence content, (2) honeypot + per-IP rate limit + server-side validation against spam and DB bloat, (3) community Report auto-hide, and (4) an owner token for self-delete/edit. This keeps the portfolio project dependency-light yet safe for public use.
- **Mini-RAG uses inline context** (`meta` + description/body in the LLM prompt) rather than a vector DB, because one Barang's content is small enough to fit inline; embeddings are deferred until cross-entry retrieval is needed.
- **Supabase pooler (port 6543)** for server connections, to avoid exhausting Postgres connections under Vercel's serverless model.
