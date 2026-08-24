'use client'

import { useActionState, useState } from 'react'
import { submitEntry, type SubmitState } from '@/app/actions'
import { Button } from './ui/Button'
import { TextFieldInput } from './ui/text-field-input'
import { TextareaFieldInput } from './ui/textarea-field-input'
import { SegmentedToggleButton } from './ui/SegmentedToggle'
import type { Kind } from '@/lib/types'

const KIND_OPTS = ['Situs', 'Prompt'] as const
const CHAT_OPTS = ['Gak', 'Ya'] as const

export function SubmitForm() {
  const [state, formAction] = useActionState(submitEntry, { ok: false } as SubmitState)
  const [kind, setKind] = useState<Kind>('site')
  const [chat, setChat] = useState(false)

  return (
    <form
      action={formAction}
      className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      {/* honeypot — must stay hidden, name kept as `website` to match server check */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mb-4">
        <span className="mb-1.5 block text-sm font-medium text-neutral-900">Jenis</span>
        <SegmentedToggleButton
          options={KIND_OPTS}
          defaultIndex={kind === 'prompt' ? 1 : 0}
          className="!w-full"
          onChange={(_i, value) => setKind(value === 'Prompt' ? 'prompt' : 'site')}
        />
      </div>
      <input type="hidden" name="kind" value={kind} readOnly />

      <TextFieldInput label="Judul" name="title" required maxLength={200} containerClassName="!max-w-none w-full mb-4" />

      {kind === 'site' ? (
        <>
          <TextFieldInput label="URL (http/https)" name="url" type="url" required containerClassName="!max-w-none w-full mb-4" />
          <TextareaFieldInput label="Deskripsi" name="description" maxLength={500} containerClassName="!max-w-none w-full mb-4" />
        </>
      ) : (
        <>
          <TextareaFieldInput label="Body (prompt-nya)" name="body" required maxLength={5000} containerClassName="!max-w-none w-full mb-4" />
          <TextFieldInput label="Variables (mis. {{file}})" name="variables" maxLength={500} containerClassName="!max-w-none w-full mb-4" />
        </>
      )}

      <TextFieldInput label="Kategori (opsional)" name="category" maxLength={50} containerClassName="!max-w-none w-full mb-4" />

      <div className="mb-4">
        <span className="mb-1.5 block text-sm font-medium text-neutral-900">Mo ada chatbot penjelas?</span>
        <SegmentedToggleButton
          options={CHAT_OPTS}
          defaultIndex={chat ? 1 : 0}
          className="!w-full"
          onChange={(_i, value) => setChat(value === 'Ya')}
        />
      </div>
      <input type="hidden" name="has_chatbot" value={chat ? 'yes' : 'no'} readOnly />

      {chat && (
        <div className="mb-4 space-y-3 rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500">Lengkapi biar bot gak ngablu:</p>
          {kind === 'site' ? (
            <>
              <TextFieldInput label="Fitur utama" name="m_fitur" placeholder="Fitur utama" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Use case" name="m_usecase" placeholder="Use case" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Pricing" name="m_pricing" placeholder="Pricing" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Platform" name="m_platform" placeholder="Platform" maxLength={300} containerClassName="!max-w-none w-full" />
            </>
          ) : (
            <>
              <TextFieldInput label="Model" name="m_model" placeholder="Model" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Variables" name="m_variables" placeholder="Variables" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Use case" name="m_usecase" placeholder="Use case" maxLength={300} containerClassName="!max-w-none w-full" />
              <TextFieldInput label="Contoh output" name="m_output" placeholder="Contoh output" maxLength={300} containerClassName="!max-w-none w-full" />
            </>
          )}
        </div>
      )}

      {state.error && <p className="mb-2 text-sm font-medium text-red-600">{state.error}</p>}
      {state.ok && <p className="mb-2 text-sm font-medium text-emerald-600">Barang dipamerin! 🎉</p>}
      <Button type="submit">Pamerin!</Button>
    </form>
  )
}
