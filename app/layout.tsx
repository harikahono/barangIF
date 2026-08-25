import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import CapsuleNavbar from './components/CapsuleNavbar'
import ThemeToggle from './components/ThemeToggle'

export const metadata: Metadata = {
  title: 'barangIF',
  description: 'Tempat pamer barang buat anak IF — Situs & Prompt, di-rank by vote.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
    <body className="min-h-screen bg-neutral-50 pt-14 text-neutral-900 antialiased">
      <script
        dangerouslySetInnerHTML={{
          __html: "(function(){try{var m=window.matchMedia('(max-width:640px)').matches;var t=m?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):(localStorage.getItem('theme')||'dark');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();",
        }}
      />
      <CapsuleNavbar />
      <ThemeToggle />
      {children}
    </body>
    </html>
  )
}
