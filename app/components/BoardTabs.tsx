'use client'

import { useRouter } from 'next/navigation'
import { SegmentedToggleButton } from './ui/SegmentedToggle'
import type { Kind } from '@/lib/types'

const OPTIONS = ['Situs', 'Prompt'] as const

export function BoardTabs({ active }: { active: Kind }) {
  const router = useRouter()
  const defaultIndex = active === 'prompt' ? 1 : 0
  return (
    <div className="mb-4">
      <SegmentedToggleButton
        key={active}
        options={OPTIONS}
        defaultIndex={defaultIndex}
        className="!w-full"
        onChange={(_i, value) => {
          const board = value === 'Prompt' ? 'prompt' : 'site'
          router.push(`/?board=${board}`)
        }}
      />
    </div>
  )
}
