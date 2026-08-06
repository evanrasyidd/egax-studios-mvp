'use client'
import { useI18n } from '@/store/i18nStore'

export default function AboutContent() {
  const { t } = useI18n()
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-2xl">
        <p className="arch-label text-pink mb-4">{t('about.label')}</p>
        <h1 className="font-display text-[52px] md:text-[64px] font-bold leading-[0.95] tracking-[-0.02em] text-text1 mb-8">MADE FOR<br/>EVERYDAY.</h1>
        <div className="space-y-5 text-[15px] text-text2 leading-relaxed border-l border-pink pl-6">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>
        <div className="mt-10 inline-block bg-text1 text-bg font-mono text-[10px] font-semibold uppercase tracking-[0.22em] border border-text1 px-6 py-3">
          KEEP IT CASUAL.
        </div>
      </div>
    </div>
  )
}
