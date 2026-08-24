import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'barangIF',
  description: 'Tempat pamer barang buat anak IF — Situs & Prompt, di-rank by vote.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center" aria-label="barangIF">
              <img src="/barangiflogo.webp" alt="barangIF" className="h-7 w-auto" />
            </Link>
            <nav className="flex items-center gap-4 text-sm text-neutral-600">
              <Link href="/aturan" className="hover:text-neutral-900">
                Aturan
              </Link>
              <Link href="/tentang" className="hover:text-neutral-900">
                Tentang
              </Link>
              <Link href="/statistik" className="hover:text-neutral-900">
                Statistik
              </Link>
              <Link href="/masukan" className="hover:text-neutral-900">
                Masukan
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
