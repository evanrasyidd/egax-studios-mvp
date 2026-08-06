'use client'
import ContactForm from '@/components/sections/ContactForm'
import { useI18n } from '@/store/i18nStore'

export default function ContactContent() {
  const { t } = useI18n()
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-xl">
        <p className="arch-label text-pink mb-4">{t('contact.label')}</p>
        <h1 className="font-display text-[34px] md:text-[38px] font-bold tracking-[-0.01em] leading-tight text-text1 mb-8">{t('contact.title')}</h1>
        <ContactForm />
        <div className="mt-12 pt-8 border-t border-border">
          <p className="arch-label text-pink mb-3">{t('contact.direct')}</p>
          <p className="font-mono text-[13px] text-text1">hello@egaxstudios.com</p>
          <p className="font-mono text-[12px] text-text2 mt-1">Jakarta Selatan, Indonesia</p>
        </div>
      </div>
    </div>
  )
}
