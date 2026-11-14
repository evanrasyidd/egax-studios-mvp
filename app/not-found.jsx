'use client'
import Link from 'next/link'
import { useI18n } from '@/store/i18nStore'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <main id="main" className="flex min-h-[70vh] flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-display text-[clamp(96px,20vw,220px)] font-bold leading-none tracking-[-0.02em] text-text1">404</p>
      <p className="arch-label mb-2 text-text2">{t('notFound.title')}</p>
      <p className="mb-8 max-w-xs font-body text-sm text-text2">{t('notFound.desc')}</p>
      <Link href="/"
        className="border border-text1 bg-text1 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-bg transition-colors hover:border-text2 hover:bg-text2 active:translate-y-px">
        {t('notFound.back')}
      </Link>
    </main>
  )
}
