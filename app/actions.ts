'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { insertEntry, incrementUpvotes, decrementUpvotes, incrementClicks, appendFeedback } from '@/lib/db'
import { rateLimited } from '@/lib/rateLimit'
import { moderate } from '@/lib/moderation'
import type { Kind, FeedbackType } from '@/lib/types'

export interface SubmitState {
  ok: boolean
  error?: string
  id?: string
}

const META_SITE = ['m_fitur', 'm_usecase', 'm_pricing', 'm_platform']
const META_PROMPT = ['m_model', 'm_variables', 'm_usecase', 'm_output']

async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

export async function submitEntry(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // honeypot: field tersembunyi, kalau diisi = bot
  if (formData.get('website')) return { ok: false, error: 'Bot terdeteksi.' }

  if (rateLimited(await clientIp())) {
    return { ok: false, error: 'Terlalu banyak submit, coba lagi nanti.' }
  }

  const kind = formData.get('kind')
  if (kind !== 'site' && kind !== 'prompt') {
    return { ok: false, error: 'Kind gak valid.' }
  }

  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { ok: false, error: 'Judul wajib diisi.' }
  if (title.length > 200) return { ok: false, error: 'Judul kepanjangan (max 200).' }

  const description = String(formData.get('description') ?? '').trim().slice(0, 500)
  const body = String(formData.get('body') ?? '').trim().slice(0, 5000)
  const variables = String(formData.get('variables') ?? '').trim().slice(0, 500)
  const category = String(formData.get('category') ?? '').trim().slice(0, 50)

  let url: string | undefined
  if (kind === 'site') {
    url = String(formData.get('url') ?? '').trim()
    if (!/^https?:\/\//.test(url)) return { ok: false, error: 'URL harus http(s).' }
  } else if (!body) {
    return { ok: false, error: 'Body prompt wajib diisi.' }
  }

  const has_chatbot = formData.get('has_chatbot') === 'yes'
  let meta: Record<string, string> | null = null
  if (has_chatbot) {
    const fields = kind === 'site' ? META_SITE : META_PROMPT
    meta = {}
    for (const f of fields) {
      const v = String(formData.get(f) ?? '').trim()
      if (!v) return { ok: false, error: 'Lengkapi semua info chatbot biar gak ngablu.' }
      meta[f] = v
    }
  }

  const mod = await moderate(`${title}\n${description}\n${body}`)
  if (!mod.ok) return { ok: false, error: mod.reason ?? 'Konten ditolak.' }

  const entry = await insertEntry({
    kind: kind as Kind,
    title,
    url,
    description: description || undefined,
    body: body || undefined,
    variables: variables || undefined,
    category: category || undefined,
    has_chatbot,
    meta,
  })

  revalidatePath('/')
  return { ok: true, id: entry.id }
}

export async function upvoteEntry(id: string): Promise<void> {
  await incrementUpvotes(id)
  revalidatePath('/')
  revalidatePath(`/entry/${id}`)
}

export async function cancelVote(id: string): Promise<void> {
  await decrementUpvotes(id)
  revalidatePath('/')
  revalidatePath(`/entry/${id}`)
}

export async function registerClick(id: string): Promise<void> {
  await incrementClicks(id)
  revalidatePath('/')
}

export interface FeedbackState {
  ok: boolean
  error?: string
}

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const type = formData.get('type')
  if (type !== 'feature' && type !== 'bug' && type !== 'other') {
    return { ok: false, error: 'Pilih jenis masukan.' }
  }
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { ok: false, error: 'Judul wajib diisi.' }
  if (title.length > 120) return { ok: false, error: 'Judul kepanjangan (max 120).' }
  const body = String(formData.get('body') ?? '').trim()
  if (!body) return { ok: false, error: 'Penjelasan wajib diisi.' }
  if (body.length > 2000) return { ok: false, error: 'Penjelasan kepanjangan (max 2000).' }
  const email = String(formData.get('email') ?? '').trim().slice(0, 200) || undefined

  await appendFeedback({ type: type as FeedbackType, title, body, email })
  revalidatePath('/masukan')
  return { ok: true }
}
