'use client'
import Link from 'next/link'
import { useI18n } from '@/store/i18nStore'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="min-h-[70vh] bg-bg flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[clamp(96px,20vw,220px)] font-bold leading-none text-text1 tracking-[-0.02em]">404</p>
      <p className="arch-label text-pink mb-2">{t('notFound.title')}</p>
      <p className="font-body text-sm text-text2 mb-8 max-w-xs">{t('notFound.desc')}</p>
      <Link href="/"
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-bg bg-text1 border border-text1 px-6 py-3 transition-all hover:bg-text2 hover:border-text2 active:translate-y-px">
        {t('notFound.back')}
      </Link>
    </div>
  )
}
