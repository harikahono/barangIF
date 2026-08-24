'use client'

import { useActionState, useState } from 'react'
import { submitEntry, type SubmitState } from '@/app/actions'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { cn } from '@/lib/cn'
import type { Kind } from '@/lib/types'

export function SubmitForm() {
  const [state, formAction] = useActionState(submitEntry, { ok: false } as SubmitState)
  const [kind, setKind] = useState<Kind>('site')
  const [chat, setChat] = useState(false)

  return (
    <form action={formAction} className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      {/* honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mb-3 flex gap-1 rounded-lg border border-neutral-800 p-1">
        {(['site', 'prompt'] as Kind[]).map((k) => (
          <button
            type="button"
            key={k}
            onClick={() => setKind(k)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition',
              kind === k ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400',
            )}
          >
            {k === 'site' ? 'Situs' : 'Prompt'}
          </button>
        ))}
      </div>
      <input type="hidden" name="kind" value={kind} />

      <label className="mb-1 block text-xs text-neutral-400">Judul</label>
      <Input name="title" required maxLength={200} className="mb-3" />

      {kind === 'site' ? (
        <>
          <label className="mb-1 block text-xs text-neutral-400">URL (http/https)</label>
          <Input name="url" type="url" required className="mb-3" />
          <label className="mb-1 block text-xs text-neutral-400">Deskripsi</label>
          <Textarea name="description" maxLength={500} className="mb-3" />
        </>
      ) : (
        <>
          <label className="mb-1 block text-xs text-neutral-400">Body (prompt-nya)</label>
          <Textarea name="body" required maxLength={5000} className="mb-3" />
          <label className="mb-1 block text-xs text-neutral-400">
            Variables (mis. {'{{file}}'})
          </label>
          <Input name="variables" maxLength={500} className="mb-3" />
        </>
      )}

      <label className="mb-1 block text-xs text-neutral-400">Kategori (opsional)</label>
      <Input name="category" maxLength={50} className="mb-3" />

      <label className="mb-1 block text-xs text-neutral-400">Mo ada chatbot penjelas?</label>
      <div className="mb-3 flex gap-1 rounded-lg border border-neutral-800 p-1">
        <button
          type="button"
          onClick={() => setChat(false)}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-sm transition',
            !chat ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400',
          )}
        >
          Gak
        </button>
        <button
          type="button"
          onClick={() => setChat(true)}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-sm transition',
            chat ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400',
          )}
        >
          Ya
        </button>
      </div>
      <input type="hidden" name="has_chatbot" value={chat ? 'yes' : 'no'} />

      {chat && (
        <div className="mb-3 space-y-3 rounded-lg border border-neutral-800 p-3">
          <p className="text-xs text-neutral-400">Lengkapi biar bot gak ngablu:</p>
          {kind === 'site' ? (
            <>
              <Input name="m_fitur" placeholder="Fitur utama" maxLength={300} />
              <Input name="m_usecase" placeholder="Use case" maxLength={300} />
              <Input name="m_pricing" placeholder="Pricing" maxLength={300} />
              <Input name="m_platform" placeholder="Platform" maxLength={300} />
            </>
          ) : (
            <>
              <Input name="m_model" placeholder="Model" maxLength={300} />
              <Input name="m_variables" placeholder="Variables" maxLength={300} />
              <Input name="m_usecase" placeholder="Use case" maxLength={300} />
              <Input name="m_output" placeholder="Contoh output" maxLength={300} />
            </>
          )}
        </div>
      )}

      {state.error && <p className="mb-2 text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="mb-2 text-sm text-green-400">Barang dipamerin! 🎉</p>}
      <Button type="submit">Pamerin!</Button>
    </form>
  )
}
