import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'barangIF',
  description: 'Tempat pamer barang buat anak IF — Situs & Prompt, di-rank by vote.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">{children}</body>
    </html>
  )
}
