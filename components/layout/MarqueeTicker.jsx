'use client'
import { useI18n } from '@/store/i18nStore'

export default function MarqueeTicker() {
  const { t } = useI18n()
  const text = t('ticker')
  return (
    <div className="sticky top-0 z-50 overflow-hidden h-8 flex items-center bg-text1 border-b border-border">
      <div className="ticker-track">
        {[...Array(6)].map((_,i) => (
          <span key={i} className="font-mono text-[9px] uppercase font-medium tracking-[0.22em] text-bg/80 px-8">
            <span className="mr-8 text-bg/40">/</span>{text}
          </span>
        ))}
      </div>
    </div>
  )
}
