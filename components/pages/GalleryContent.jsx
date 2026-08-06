'use client'
import { LOOKBOOK } from '@/constants/lookbook'
import { useI18n } from '@/store/i18nStore'

const COLORS = ['#77736C','#4A4844','#222220','#5A5751','#3A3936','#2E2D2B','#6E6A63','#8F8B84','#111111','#4A4844','#222220','#77736C']
export default function GalleryContent() {
  const { t } = useI18n()
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-12">
      <div className="mb-10 pb-5 border-b border-border flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <span className="arch-label text-pink">{t('gallery.label')}</span>
          <h1 className="font-display text-[40px] font-bold tracking-[-0.01em] text-text1">{t('gallery.title')}</h1>
        </div>
        <span className="hidden sm:block font-mono text-[8px] uppercase tracking-[0.24em] text-text2/70">SS26 · {LOOKBOOK.length} Frames</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
        {LOOKBOOK.map((item,i) => (
          <div key={item.id} className="archive-tile group relative overflow-hidden hover:border-pink transition-colors" style={{aspectRatio:'3/4'}}>
            <div data-zoom className="w-full h-full flex flex-col items-center justify-center gap-2" style={{background:COLORS[i%COLORS.length]}}>
              <span className="font-display text-[36px] font-bold text-white/70">{(i+1).toString().padStart(2,'0')}</span>
              <span data-speed="0.45" className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/50">{`FRAME ${(i+1).toString().padStart(2,'0')}`}</span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"/>
          </div>
        ))}
      </div>
    </div>
  )
}
