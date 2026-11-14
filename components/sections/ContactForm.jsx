'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { useI18n } from '@/store/i18nStore'
import { FieldInput, FieldLabel, FieldTextarea } from '@/components/ui/Field'
import Button from '@/components/ui/Button'

export default function ContactForm() {
  const { t } = useI18n()
  const [sent, setSent] = useState(false)

  return (
    <div className="border border-text1 bg-surface p-6">
      <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
        <p className="arch-label text-text2">{t('contact.label')}</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">FORM · 01</span>
      </div>

      {sent ? (
        <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center border border-text1 bg-text1 text-bg">
            <Check size={18} aria-hidden="true" />
          </span>
          <p className="font-display text-[18px] font-bold text-text1">{t('contact.sent')}</p>
          <p className="max-w-[280px] text-[12px] leading-relaxed text-text2">{t('contact.sentDesc')}</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="space-y-4">
          <div>
            <FieldLabel htmlFor="contact-name">{t('contact.name')}</FieldLabel>
            <FieldInput id="contact-name" name="name" autoComplete="name" required placeholder="Nadia Pratama" />
          </div>
          <div>
            <FieldLabel htmlFor="contact-email">{t('contact.email')}</FieldLabel>
            <FieldInput id="contact-email" name="email" type="email" autoComplete="email" required placeholder="nama@email.com" />
          </div>
          <div>
            <FieldLabel htmlFor="contact-message">{t('contact.message')}</FieldLabel>
            <FieldTextarea id="contact-message" name="message" rows={4} required placeholder={t('contact.message')} />
          </div>
          <Button type="submit" variant="primary" className="w-full">{t('contact.send')}</Button>
        </form>
      )}
    </div>
  )
}
