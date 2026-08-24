export type Kind = 'site' | 'prompt'

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
  created_at: string
}
