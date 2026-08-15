'use client'
import { EDITORIALS } from '@/constants/editorial'
import { useI18n } from '@/store/i18nStore'

const COLORS = ['#77736C','#4A4844','#222220','#5A5751','#3A3936','#2E2D2B']
export default function EditorialContent() {
  const { t, locale } = useI18n()
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-12">
      <div className="mb-10 pb-5 border-b border-border flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <span className="arch-label text-pink">{t('editorial.label')}</span>
          <h1 data-skew className="font-display text-[40px] font-bold tracking-[-0.01em] text-text1">{t('editorial.title')}</h1>
        </div>
        <span className="hidden sm:block font-mono text-[8px] uppercase tracking-[0.24em] text-text2/70">SS26 · {EDITORIALS.length} Docs</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {EDITORIALS.map((item,i) => (
          <div key={item.id} className="archive-tile group relative overflow-hidden" style={{aspectRatio:'3/4'}}>
            <div data-zoom className="w-full h-full flex flex-col items-center justify-center gap-3" style={{background:COLORS[i%COLORS.length]}}>
              <span className="font-display text-[44px] font-bold leading-none text-white/90">{(i+1).toString().padStart(2,'0')}</span>
              <span aria-hidden="true" className="w-10 h-px bg-white/40" />
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/60">{`DOC ${(i+1).toString().padStart(2,'0')} · SS26`}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-text1/75 group-hover:bg-text1/60 transition-all"/>
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex gap-1 mb-2 flex-wrap">
                {(locale === 'id' && item.tagsId ? item.tagsId : item.tags).map(tag=><span key={tag} className="arch-label border border-pink/70 text-pink px-1.5 py-0.5">{tag}</span>)}
              </div>
              <p className="arch-label text-pink mb-1">{locale === 'id' && item.subtitleId ? item.subtitleId : item.subtitle}</p>
              <p className="font-display text-[22px] font-bold tracking-[-0.01em] text-white">{locale === 'id' && item.titleId ? item.titleId : item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
