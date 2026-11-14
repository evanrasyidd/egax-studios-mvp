'use client'
import { useI18n } from '@/store/i18nStore'

const SECTIONS = [
  { id: 'refund', titleKey: 'footer.refund' },
  { id: 'shipping', titleKey: 'footer.shipping' },
  { id: 'privacy', titleKey: 'footer.privacy' },
  { id: 'terms', titleKey: 'footer.terms' },
  { id: 'legal', titleKey: 'footer.legalNotice' },
  { id: 'cookies', titleKey: 'footer.cookie' },
]

export default function PoliciesPage() {
  const { t } = useI18n()
  return (
    <div className="bg-bg min-h-screen">
      <div className="px-6 md:px-10 pt-16 pb-20 max-w-3xl mx-auto">
        <p className="arch-label text-pink mb-4">{t('policies.label')}</p>
        <h1 className="mb-12 font-display text-[44px] font-bold leading-[0.95] tracking-[-0.02em] text-text1 md:text-[56px]">{t('policies.title')}</h1>

        <div data-reveal className="border border-border divide-y divide-border bg-surface mb-12">
          {SECTIONS.map((s) => (
            <details key={s.id} id={s.id} className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text1">{t(s.titleKey)}</span>
                <span className="font-mono text-[11px] text-text2 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[13px] text-text2 leading-relaxed space-y-3">
                {[1, 2].map((n) => (
                  <p key={n}>{t(`policies.${s.id}.p${n}`)}</p>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div data-reveal className="border border-text1 bg-text1">
          <div className="px-6 py-6">
            <p className="arch-label text-bg/60 mb-2">{t('policies.question')}</p>
            <a href="mailto:hello@egaxstudios.com" className="font-mono text-[15px] font-medium text-bg break-all hover:underline">
              hello@egaxstudios.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
