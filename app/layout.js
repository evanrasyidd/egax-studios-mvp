import { Anton, Bangers, Inter } from 'next/font/google'
import StoreHydration from '@/components/providers/StoreHydration'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-comic',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'EGAX Studios — Loud on the Streets.',
  description: 'Bold streetwear brand. Limited drops, no volume.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${anton.variable} ${bangers.variable} ${inter.variable}`}>
      <body>
        <StoreHydration>{children}</StoreHydration>
      </body>
    </html>
  )
}
