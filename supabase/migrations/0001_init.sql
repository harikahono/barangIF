-- barangIF — schema + RLS + seed
-- Jalankan di SQL editor Supabase (atau via Supabase CLI).
-- Pastikan sudah buat project & copy env ke .env.local.

-- 1. Tabel entries (satu tabel, discriminator `kind`)
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('site', 'prompt')),
  title       text not null,
  url         text,
  description text,
  body        text,
  variables   text,
  category    text,
  has_chatbot boolean not null default false,
  meta        jsonb,
  upvotes     integer not null default 0,
  clicks      integer not null default 0,
  reports     integer not null default 0,
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists entries_kind_hidden_idx on public.entries (kind, hidden);
create index if not exists entries_created_at_idx on public.entries (created_at desc);

-- 2. RLS: anon bisa SELECT & INSERT, gak bisa UPDATE/DELETE (self-delete pakai service role lewat owner token)
alter table public.entries enable row level security;

drop policy if exists "anon can read visible entries" on public.entries;
create policy "anon can read visible entries"
  on public.entries for select
  using (hidden = false);

drop policy if exists "anon can insert" on public.entries;
create policy "anon can insert"
  on public.entries for insert
  with check (true);

-- 3. Seed (beberapa has_chatbot=true buat demo)
insert into public.entries (kind, title, url, description, category, has_chatbot, meta, upvotes, clicks)
values
  ('site', 'luvus.dev', 'https://luvus.dev', 'Portfolio builder buat anak IF yang males desain.', 'tools', true,
    '{"m_fitur":"Drag-drop section, export ke Vercel","m_usecase":"Bikin portofolio cepat","m_pricing":"Freemium","m_platform":"Web"}'::jsonb, 12, 30),
  ('site', 'orkata.co', 'https://orkata.co', 'Naruh ide & cerita panjang buat dibaca pelan-pelan.', 'writing', true,
    '{"m_fitur":"Editor fokus, word count","m_usecase":"Nulis catatan harian","m_pricing":"Gratis","m_platform":"Web"}'::jsonb, 8, 14),
  ('site', 'moldingflask.vercel.app', 'https://moldingflask.vercel.app', 'Koleksi prompt AI yang rapi dan bisa dicopy.', 'ai', false, null, 20, 55),
  ('site', 'pamerin.lol', 'https://pamerin.lol', 'Tempat pamer project receh sampai serius.', 'showcase', false, null, 5, 9),
  ('site', 'kuliahyuk.vercel.app', 'https://kuliahyuk.vercel.app', 'Ringkasan kuliah IF biar gak panik sebelum UTS.', 'edu', false, null, 3, 7),
  ('prompt', 'Bikin chatbot FAQ dari PDF', null, 'Prompt buat bikin bot tanya-jawab dari dokumen.', 'rag', true,
    '{"m_model":"GPT-4o","m_variables":"{{pdf}}","m_usecase":"Customer support otomatis","m_output":"List Q&A dari dokumen"}'::jsonb, 15, 40),
  ('prompt', 'Security audit assistant', null, 'Prompt buat review keamanan kode.', 'security', false, null, 9, 22),
  ('prompt', 'Threat model generator', null, 'Prompt buat susun threat model dari deskripsi sistem.', 'security', false, null, 6, 11);
