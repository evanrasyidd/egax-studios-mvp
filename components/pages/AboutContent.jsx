'use client'
import Link from 'next/link'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useI18n } from '@/store/i18nStore'

export default function AboutContent() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { products } = useAdminStore()
  const productCount = hydrated ? products.length : 0
  const catCount = hydrated ? new Set(products.map((p) => p.category)).size : 0

  const points = [
    { k: '01', v: 'Duck canvas · 12oz', label: t('about.point1') },
    { k: '02', v: 'Made in Jakarta', label: t('about.point2') },
    { k: '03', v: 'Limited runs', label: t('about.point3') },
  ]

  return (
    <div className="bg-bg min-h-screen">
      <div className="px-6 md:px-10 pt-16 pb-20 max-w-6xl mx-auto">
        <p className="arch-label text-pink mb-4">{t('about.label')}</p>
        <h1 className="mb-8 font-display text-[44px] font-bold leading-[0.95] tracking-[-0.02em] text-text1 md:text-[72px]">MADE FOR<br/>EVERYDAY.</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-5 border-t border-text1 pt-6 text-[15px] leading-relaxed text-text2">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </div>

          <div data-reveal className="border border-text1 bg-surface h-fit">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('about.sheet')}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bg/60">SS 2026</span>
            </div>
            <div className="divide-y divide-border">
              {points.map((p) => (
                <div key={p.k} className="flex items-center gap-5 px-5 py-4">
                  <span className="arch-label text-text2">{p.k}</span>
                  <div>
                    <p className="font-mono text-[13px] font-medium text-text1">{p.v}</p>
                    <p className="text-[11px] text-text2 mt-0.5">{p.label}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-5 px-5 py-4">
                <span className="arch-label text-text2">00</span>
                <p className="font-mono text-[13px] font-medium text-text1">
                  {catCount} {t('about.categories')} · {productCount} {t('about.products')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-20 grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border bg-surface">
          {[
            { k: 'A', v: 'EST. 2026', l: t('about.est') },
            { k: 'B', v: 'JAKARTA', l: t('about.city') },
            { k: 'C', v: '100% COTTON', l: t('about.cotton') },
            { k: 'D', v: 'SMALL BATCH', l: t('about.batch') },
          ].map((s) => (
            <div key={s.k} className="px-5 py-6">
              <p className="arch-label text-text2 mb-2">{s.k}</p>
              <p className="font-display text-[16px] md:text-[20px] font-bold text-text1 tracking-[-0.01em]">{s.v}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text2 mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-16 text-center">
          <Link href="/catalog" className="arch-label text-bg bg-text1 border border-text1 px-8 py-4 hover:bg-text2 transition-colors">
            {t('about.cta')}
          </Link>
        </div>
      </div>
    </div>
  )
}
