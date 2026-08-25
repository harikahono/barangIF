'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import type { Entry } from '@/lib/types'
import { getChatReply, welcomeMessage, suggestedPrompts, type ChatMessage } from '@/lib/chat'

export function ChatWidget({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)

  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => setOpen(false)

  // ponytail: fokus masuk ke input pas buka, balik ke launcher pas tutup.
  useEffect(() => {
    if (open) {
      setMessages([{ role: 'bot', content: welcomeMessage(entry) }])
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      launcherRef.current?.focus()
    }
  }, [open, entry])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  const send = async (text: string) => {
    const t = text.trim()
    if (!t || typing) return
    setMessages((prev) => [...prev, { role: 'user', content: t }])
    setInput('')
    setTyping(true)
    const reply = await getChatReply(entry, t)
    setTyping(false)
    setMessages((prev) => [...prev, { role: 'bot', content: reply }])
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  if (!entry.has_chatbot) return null

  const showSuggestions = messages.filter((m) => m.role === 'user').length === 0

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        aria-label="Buka chat penjelas"
        aria-hidden={open}
        inert={open}
        onClick={() => setOpen(true)}
        className={
          'fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-nav-active-text shadow-lg transition-[transform,opacity] duration-200 ease-[var(--ease-smooth)] hover:scale-105 active:scale-95 motion-reduce:transition-none ' +
          (open ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100')
        }
      >
        <MessageSquare size={22} />
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-label={`Chat penjelas ${entry.title}`}
        aria-hidden={!open}
        inert={!open}
        className={
          'fixed bottom-4 right-4 z-50 flex h-[28rem] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-xl max-sm:inset-0 max-sm:h-[100dvh] max-sm:w-full max-sm:max-w-full origin-bottom-right transition-[transform,opacity] duration-200 ease-[var(--ease-smooth)] motion-reduce:transition-none ' +
          (open ? 'scale-100 translate-y-0 opacity-100' : 'pointer-events-none scale-95 translate-y-2 opacity-0')
        }
      >
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">{entry.title}</p>
              <p className="text-xs text-neutral-500">Chatbot penjelas</p>
            </div>
            <button
              type="button"
              aria-label="Tutup chat"
              onClick={close}
              className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-hover">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <span
                  className={
                    'max-w-[75%] animate-[messageIn_0.18s_var(--ease-smooth)] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm motion-reduce:animate-none ' +
                    (msg.role === 'user'
                      ? 'bg-accent text-nav-active-text'
                      : 'bg-neutral-200 text-neutral-900')
                  }
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="inline-flex animate-[messageIn_0.18s_var(--ease-smooth)] items-center gap-1 rounded-2xl bg-neutral-200 px-3 py-3 text-neutral-500 motion-reduce:animate-none">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500" />
                </span>
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {suggestedPrompts().map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => void send(p)}
                  className="rounded-full border border-neutral-200 bg-neutral-200 px-3 py-1 text-xs text-neutral-900 hover:bg-neutral-300"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-neutral-200 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soal barang ini…"
              className="min-w-0 flex-1 rounded-full bg-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-300"
            />
            <button
              type="submit"
              aria-label="Kirim"
              disabled={!input.trim()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-nav-active-text transition-opacity disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
      </div>
    </>
  )
}
