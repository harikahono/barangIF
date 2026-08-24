import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { seed } from './seed'
import type { Entry, Kind } from './types'

// ponytail: store lokal (file JSON). Ganti ke Supabase cukup rewrite file ini.
const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'entries.json')

async function readAll(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(raw) as Entry[]
  } catch {
    const seeded = seed()
    await writeAll(seeded)
    return seeded
  }
}

async function writeAll(entries: Entry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8')
}

/** Score = upvotes*3 + clicks (lihat SPEC §2) */
export function score(e: Entry): number {
  return e.upvotes * 3 + e.clicks
}

export async function listEntries(kind?: Kind): Promise<Entry[]> {
  let entries = (await readAll()).filter((e) => !e.hidden)
  if (kind) entries = entries.filter((e) => e.kind === kind)
  return entries.sort((a, b) => score(b) - score(a))
}

export async function getEntry(id: string): Promise<Entry | null> {
  const entries = await readAll()
  return entries.find((e) => e.id === id && !e.hidden) ?? null
}

export async function insertEntry(
  input: Omit<Entry, 'id' | 'upvotes' | 'clicks' | 'reports' | 'hidden' | 'created_at'>,
): Promise<Entry> {
  const entries = await readAll()
  const entry: Entry = {
    ...input,
    id: crypto.randomUUID(),
    upvotes: 0,
    clicks: 0,
    reports: 0,
    hidden: false,
    created_at: new Date().toISOString(),
  }
  entries.push(entry)
  await writeAll(entries)
  return entry
}

export async function incrementUpvotes(id: string): Promise<void> {
  const entries = await readAll()
  const e = entries.find((x) => x.id === id)
  if (!e) return
  e.upvotes += 1
  await writeAll(entries)
}

export async function incrementClicks(id: string): Promise<void> {
  const entries = await readAll()
  const e = entries.find((x) => x.id === id)
  if (!e) return
  e.clicks += 1
  await writeAll(entries)
}
