'use client'

import { useActionState, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { submitEntry, type SubmitState } from '@/app/actions'
import { Button } from './ui/Button'
import { TextFieldInput } from './ui/text-field-input'
import { TextareaFieldInput } from './ui/textarea-field-input'
import { SegmentedToggleButton } from './ui/SegmentedToggle'
import { Card } from './ui/Card'
import { cn } from '@/lib/cn'
import type { Kind } from '@/lib/types'
import { categoriesFor } from '@/lib/types'

const KIND_OPTS = ['Situs', 'Prompt'] as const
const CHAT_OPTS = ['Gak', 'Ya'] as const

export function SubmitForm() {
  const [state, formAction] = useActionState(submitEntry, { ok: false } as SubmitState)
  const [kind, setKind] = useState<Kind>('site')
  const [chat, setChat] = useState(false)
  const [category, setCategory] = useState('')
  const [open, setOpen] = useState(false)

  // auto-lipat pas submit sukses
  useEffect(() => {
    if (state.ok) setOpen(false)
  }, [state.ok])

  return (
    <Card className="mb-6 overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="submit-form-body"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-neutral-900">Pamerin barang</span>
        <ChevronDown
          size={18}
          className={cn(
            'text-neutral-500 transition-transform duration-500',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        id="submit-form-body"
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div
          className={cn(
            'overflow-hidden transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          inert={!open}
        >
          <form action={formAction} className="border-t border-neutral-200 p-4">
            {/* honeypot — must stay hidden, name kept as `website` to match server check */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="mb-4">
              <span className="mb-1.5 block text-sm font-medium text-neutral-900">Jenis</span>
              <SegmentedToggleButton
                options={KIND_OPTS}
                defaultIndex={kind === 'prompt' ? 1 : 0}
                className="!w-full"
                onChange={(_i, value) => {
                  setKind(value === 'Prompt' ? 'prompt' : 'site')
                  setCategory('')
                }}
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

            <div className="mb-4">
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-neutral-900">
                Kategori <span className="ml-0.5 text-rose-500" aria-hidden>*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3.5 font-sans text-sm text-neutral-900 outline-none transition-[border-color] duration-200 focus:border-neutral-900"
              >
                <option value="" disabled>
                  Pilih kategori…
                </option>
                {categoriesFor(kind).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

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
        </div>
      </div>
    </Card>
  )
}
