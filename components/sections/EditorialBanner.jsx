'use client'
import Link from 'next/link'
import { useI18n } from '@/store/i18nStore'
import SectionHeading from '@/components/ui/SectionHeading'
import { EDITORIALS } from '@/constants/editorial'

const COLORS = ['#D8D6CF', '#C6C3BB', '#A6A29A']

export default function EditorialBanner() {
  const { t, locale } = useI18n()
  const items = EDITORIALS.slice(0, 3)
  return (
    <section className="bg-surface py-14 px-6 md:px-10 border-b border-border">
      <SectionHeading no="05" title={t('editorial.title')} href="/editorial" linkLabel={t('sections.viewAll')} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {items.map((item, i) => (
          <Link key={item.id} href="/editorial" className="archive-tile group relative block overflow-hidden border-b border-border md:border-b-0" style={{aspectRatio:'3/4'}}>
            <div data-zoom className="w-full h-full flex flex-col items-center justify-center gap-3" style={{background: COLORS[i % COLORS.length]}}>
              <span className="font-display text-[44px] font-bold leading-none text-text1/80">{(i+1).toString().padStart(2,'0')}</span>
              <span aria-hidden="true" className="w-10 h-px bg-text1/30" />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text2">{`ED ${(i+1).toString().padStart(2,'0')} · SS26`}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-5 w-full bg-bg border-t border-border">
              <p className="arch-label text-pink mb-1">{locale === 'id' && item.subtitleId ? item.subtitleId : item.subtitle}</p>
              <p className="font-display text-[20px] font-bold tracking-tight text-text1">{locale === 'id' && item.titleId ? item.titleId : item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
