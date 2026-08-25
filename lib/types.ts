export type Kind = 'site' | 'prompt'

// ponytail: kategori fiks biar filter gak pecah. Per-kind, ada "Lainnya" catch-all.
export const SITE_CATEGORIES = [
  'Web App', 'Mobile App', 'Game', 'Tool / Utility', 'AI / ML',
  'Portfolio / Showcase', 'Open Source', 'Data / Viz', 'IoT / Hardware',
  'Edu / Pembelajaran', 'SaaS', 'Bot / Automation', 'Lainnya',
] as const

export const PROMPT_CATEGORIES = [
  'Coding', 'Writing / Content', 'Image Gen', 'Video', 'Marketing / Copy',
  'Productivity', 'Education', 'Chatbot / Assistant', 'Data / Analysis',
  'Creative / Brainstorm', 'Business / Strategy', 'Research', 'Lainnya',
] as const

export function categoriesFor(kind: Kind): readonly string[] {
  return kind === 'prompt' ? PROMPT_CATEGORIES : SITE_CATEGORIES
}

export interface Entry {
  id: string
  kind: Kind
  title: string
  url?: string
  description?: string
  body?: string
  variables?: string
  category?: string
  has_chatbot: boolean
  /** structured info (mini-RAG corpus); required & complete when has_chatbot=true, else null */
  meta: Record<string, unknown> | null
  upvotes: number
  clicks: number
  reports: number
  hidden: boolean
  created_at: string
}

export type FeedbackType = 'feature' | 'bug' | 'other'

export interface Feedback {
  id: string
  type: FeedbackType
  title: string
  body: string
  email?: string
  /** bug reports: langkah reproduksi */
  steps?: string
  /** URL halaman / link referensi (opsional, per tipe) */
  url?: string
  created_at: string
}
