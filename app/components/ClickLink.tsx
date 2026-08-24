'use client'

import { registerClick } from '@/app/actions'

export function ClickLink({
  id,
  url,
  className,
  children,
}: {
  id: string
  url: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        void registerClick(id)
      }}
    >
      {children}
    </a>
  )
}
