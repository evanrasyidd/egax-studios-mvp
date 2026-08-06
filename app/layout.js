import { Archivo } from 'next/font/google'
import StoreHydration from '@/components/providers/StoreHydration'
import LanguageSync from '@/components/providers/LanguageSync'
import ScrollAnimations from '@/components/providers/ScrollAnimations'
import Preloader from '@/components/providers/Preloader'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'EGAX Studios · Everyday Workwear',
    template: '%s · EGAX Studios',
  },
  description: 'Jakarta-based clothing brand for everyday wear. Duck chore jackets, trucker denim, flannel, chinos, tees. Regular, loose fit and wide leg jeans.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'EGAX Studios · Everyday Workwear',
    description: 'Jakarta-based clothing brand for everyday wear. Duck chore jackets, trucker denim, flannel, chinos, tees.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'EGAX Studios',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={archivo.variable}>
      <body>
        <StoreHydration>{children}</StoreHydration>
        <LanguageSync />
        <ScrollAnimations />
        <Preloader />
      </body>
    </html>
  )
}
