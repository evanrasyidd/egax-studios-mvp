import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import StoreHydration from '@/components/providers/StoreHydration'
import LanguageSync from '@/components/providers/LanguageSync'
import ScrollAnimations from '@/components/providers/ScrollAnimations'
import Preloader from '@/components/providers/Preloader'
import SkipLink from '@/components/layout/SkipLink'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://egax-studios.vercel.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EGAX Studios · Everyday Workwear',
    template: '%s · EGAX Studios',
  },
  description: 'Jakarta-based clothing brand for everyday wear. Duck chore jackets, trucker denim, flannel, chinos, tees. Regular, loose fit and wide leg jeans.',
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'EGAX Studios · Everyday Workwear',
    description: 'Jakarta-based clothing brand for everyday wear. Duck chore jackets, trucker denim, flannel, chinos, tees.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['id_ID'],
    siteName: 'EGAX Studios',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EGAX Studios · Everyday Workwear',
    description: 'Jakarta-based clothing brand for everyday wear. Duck chore jackets, trucker denim, flannel, chinos, tees.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <SkipLink />
        <StoreHydration>{children}</StoreHydration>
        <LanguageSync />
        <ScrollAnimations />
        <Preloader />
      </body>
    </html>
  )
}
