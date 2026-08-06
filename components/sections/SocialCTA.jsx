'use client'
import { Instagram } from 'lucide-react'
import { useI18n } from '@/store/i18nStore'
import SectionHeading from '@/components/ui/SectionHeading'

const COLORS = ['#E4E2DC', '#D8D6CF', '#C6C3BB']

export default function SocialCTA() {
  const { t } = useI18n()
  return (
    <section className="bg-bg border-b border-border grid grid-cols-1 md:grid-cols-[1fr_3fr]">
      <div data-reveal className="flex flex-col justify-center px-8 md:px-10 py-12 border-b md:border-b-0 md:border-r border-border">
        <p className="arch-label text-pink mb-4">{t('social.label')}</p>
        <h2 className="font-display text-[44px] md:text-[52px] font-bold leading-[0.95] tracking-[-0.01em] text-text1 mb-8">{t('social.title1')}<br/>{t('social.title2')}</h2>
        <a href="https://instagram.com/egaxstudios" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text1 border border-text1 px-5 py-3 hover:bg-text1 hover:text-bg transition-all w-fit">
          <Instagram size={14}/> @egaxstudios
        </a>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border p-px">
        {COLORS.map((c, i) => (
          <div key={i} className="archive-tile relative overflow-hidden border border-border hover:border-text1 transition-colors" style={{aspectRatio:'1', background:c}}>
            <div data-zoom className="w-full h-full flex flex-col items-center justify-center gap-1">
              <span className="font-display text-[28px] font-bold text-text1">{(i+1).toString().padStart(2,'0')}</span>
              <span data-speed="0.45" className="font-mono text-[7px] uppercase tracking-[0.2em] text-text2">DOC · SS26</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
