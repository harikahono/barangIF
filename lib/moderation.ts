export interface ModerationResult {
  ok: boolean
  reason?: string
}

// ponytail: stub kalau gak ada OPENAI_API_KEY (demo lokal).
// Pas key sudah ada, panggil OpenAI Moderation (gratis). Fail-open kalau API error.
export async function moderate(text: string): Promise<ModerationResult> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return { ok: true }

  try {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model: 'omni-moderation-latest', input: text }),
    })
    const data = await res.json()
    if (data?.results?.[0]?.flagged) {
      return { ok: false, reason: 'Konten ditandai moderasi.' }
    }
    return { ok: true }
  } catch {
    return { ok: true }
  }
}
