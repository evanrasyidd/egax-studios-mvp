'use client'
import { Mail, MapPin, Clock, Instagram } from 'lucide-react'
import ContactForm from '@/components/sections/ContactForm'
import { useI18n } from '@/store/i18nStore'

export default function ContactContent() {
  const { t } = useI18n()

  const channels = [
    { icon: Mail, k: 'A', label: t('contact.email'), value: 'hello@egaxstudios.com' },
    { icon: MapPin, k: 'B', label: t('contact.address'), value: 'Jakarta Selatan, Indonesia' },
    { icon: Clock, k: 'C', label: t('contact.hours'), value: t('contact.hoursValue') },
    { icon: Instagram, k: 'D', label: 'Instagram', value: '@egaxstudios' },
  ]

  return (
    <div className="bg-bg min-h-screen">
      <div className="px-6 md:px-10 pt-16 pb-20 max-w-6xl mx-auto">
        <p className="arch-label text-pink mb-4">{t('contact.label')}</p>
        <h1 data-skew className="font-display text-[52px] md:text-[72px] font-bold leading-[0.95] tracking-[-0.02em] text-text1 mb-12">{t('contact.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          <div>
            <div data-reveal className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border border-border bg-surface mb-12">
              {channels.map((c) => (
                <div key={c.k} className="px-5 py-6">
                  <c.icon size={15} className="text-text1 mb-3" />
                  <p className="arch-label text-text2 mb-1">{c.k} · {c.label}</p>
                  <p className="font-mono text-[11px] font-medium text-text1 leading-snug break-words">{c.value}</p>
                </div>
              ))}
            </div>

            <div data-reveal className="border border-text1 bg-text1">
              <div className="flex items-center justify-between px-5 py-2.5">
                <span className="arch-label text-bg">{t('contact.direct')}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-bg/60">JKT · SS 2026</span>
              </div>
              <div className="px-5 py-6 bg-bg border-t border-text1">
                <p className="font-mono text-[14px] font-medium text-text1 break-all">hello@egaxstudios.com</p>
                <p className="font-mono text-[12px] text-text2 mt-2">Jakarta Selatan, Indonesia</p>
                <p className="text-[13px] text-text2 mt-5 leading-relaxed max-w-md">{t('contact.reply')}</p>
              </div>
            </div>
          </div>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
