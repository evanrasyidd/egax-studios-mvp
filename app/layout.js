import { Press_Start_2P, Bebas_Neue, Inter } from 'next/font/google'
import StoreHydration from '@/components/providers/StoreHydration'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'EGAX Studios — Built in the Dark. Worn in the Streets.',
  description: 'Dark editorial streetwear brand. Limited drops, pixel aesthetic.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${pressStart.variable} ${bebas.variable} ${inter.variable}`}>
      <body>
        <StoreHydration>{children}</StoreHydration>
      </body>
    </html>
  )
}
