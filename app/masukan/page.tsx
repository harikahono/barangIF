'use client'

import { useActionState, useState } from 'react'
import { submitFeedback, type FeedbackState } from '@/app/actions'
import { Button } from '@/app/components/ui/Button'
import { TextFieldInput } from '@/app/components/ui/text-field-input'
import { TextareaFieldInput } from '@/app/components/ui/textarea-field-input'
import { SegmentedToggleButton } from '@/app/components/ui/SegmentedToggle'

const TYPE_OPTS = ['Fitur', 'Bug', 'Lainnya'] as const
const TYPE_VAL: Record<string, string> = { Fitur: 'feature', Bug: 'bug', Lainnya: 'other' }

export default function MasukanPage() {
  const [state, formAction] = useActionState(submitFeedback, { ok: false } as FeedbackState)
  const [type, setType] = useState('feature')

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Masukan</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-600">
        Punya ide fitur, nemu bug, atau ada yang bisa diperbaiki? Kirim ke sini.
      </p>

      <form
        action={formAction}
        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-medium text-neutral-900">Jenis masukan</span>
          <SegmentedToggleButton
            key={type}
            options={TYPE_OPTS}
            defaultIndex={0}
            className="!w-full"
            onChange={(_i, v) => setType(TYPE_VAL[v] ?? 'other')}
          />
        </div>
        <input type="hidden" name="type" value={type} readOnly />

        <TextFieldInput
          label="Judul"
          name="title"
          required
          maxLength={120}
          containerClassName="!max-w-none w-full mb-4"
        />
        <TextareaFieldInput
          label="Penjelasan"
          name="body"
          required
          maxLength={2000}
          containerClassName="!max-w-none w-full mb-4"
        />
        <TextFieldInput
          label="Email (opsional)"
          name="email"
          type="email"
          maxLength={200}
          containerClassName="!max-w-none w-full mb-4"
        />

        {state.error && <p className="mb-2 text-sm font-medium text-red-600">{state.error}</p>}
        {state.ok && (
          <p className="mb-2 text-sm font-medium text-emerald-600">Makasih, masukan terkirim! 🎉</p>
        )}
        <Button type="submit">Kirim masukan</Button>
      </form>
    </main>
  )
}
