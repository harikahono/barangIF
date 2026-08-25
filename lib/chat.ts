import type { Entry } from '@/lib/types'

export type ChatRole = 'user' | 'bot'
export interface ChatMessage {
  role: ChatRole
  content: string
}

// ponytail: mock seam — ganti body getChatReply ke fetch('/api/chat') pas LLM disambungin.
function mockReply(entry: Entry, message: string): string {
  const m = message.toLowerCase()
  const name = entry.title

  if (/(apa|buat|fungsi|guna|kegunaan|pake buat)/.test(m)) {
    return `“${name}” ${entry.description ? `adalah ${entry.description}` : 'adalah barang yang dipamerin di sini'}.${entry.body ? ` ${entry.body}` : ''}`
  }
  if (/(cara|pakai|pake|gunakan|gunain)/.test(m)) {
    return entry.kind === 'site'
      ? `Buka langsung di ${entry.url ?? 'link barangnya'} buat nyobain. Masih bingung sesuatu?`
      : `Copy prompt-nya terus tempel ke tool AI-mu. Butuh bantuan ngeracik promptnya?`
  }
  if (/(umur|batas|usia|age|limit)/.test(m)) {
    return `Gak ada batasan umur khusus buat “${name}” — bebas dipakai.`
  }
  if (/(gratis|harga|price|biaya|bayar|cost)/.test(m)) {
    return `Soal harga/biaya, cek detail di halaman barangnya ya. Ada lagi yang ditanyain?`
  }
  return `Itu soal “${name}”.${entry.description ? ` ${entry.description}` : ''} Coba tanya lebih spesifik — misal "buat apa" atau "cara pakainya".`
}

export async function getChatReply(entry: Entry, message: string): Promise<string> {
  // ponytail: simulasi "thinking" biar kerasa hidup (gak lama).
  await new Promise((r) => setTimeout(r, 500))
  return mockReply(entry, message)
}

export function welcomeMessage(entry: Entry): string {
  return `Hai! Ini chatbot penjelas buat “${entry.title}”. Tanya apa pun soal barang ini 👇`
}

export function suggestedPrompts(): string[] {
  return ['Ini buat apa?', 'Cara pakainya?', 'Ada batasan umur?']
}
