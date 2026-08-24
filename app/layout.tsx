import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import CapsuleNavbar from './components/CapsuleNavbar'

export const metadata: Metadata = {
  title: 'barangIF',
  description: 'Tempat pamer barang buat anak IF — Situs & Prompt, di-rank by vote.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-neutral-50 pt-24 text-neutral-900 antialiased">
        <CapsuleNavbar />
        {children}
      </body>
    </html>
  )
}
