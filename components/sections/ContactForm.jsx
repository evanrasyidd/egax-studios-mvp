'use client'
import { useState } from 'react'
import { useI18n } from '@/store/i18nStore'
import { Check } from 'lucide-react'

export default function ContactForm() {
  const { t } = useI18n()
  const [sent, setSent] = useState(false)
  return (
    <div className="bg-surface border border-text1 p-6 shadow-ink">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
        <p className="arch-label text-pink">{t('contact.label')}</p>
        <span className="font-mono text-[8px] uppercase tracking-widest text-text2/60">Form · 01</span>
      </div>
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="w-10 h-10 flex items-center justify-center border border-text1 bg-text1 text-bg"><Check size={16}/></span>
          <p className="font-display text-[18px] font-bold text-text1">{t('contact.sent')}</p>
          <p className="text-[12px] text-text2 max-w-[280px]">{t('contact.sentDesc')}</p>
        </div>
      ) : (
        <form onSubmit={e=>{e.preventDefault(); setSent(true)}} className="space-y-4">
          <div>
            <label className="arch-label text-text2 block mb-1.5">{t('contact.name')}</label>
            <input required className="w-full bg-bg border border-border px-3 py-2.5 text-[13px] text-text1 placeholder:text-text2/50 outline-none focus:border-text1" />
          </div>
          <div>
            <label className="arch-label text-text2 block mb-1.5">{t('contact.email')}</label>
            <input type="email" required className="w-full bg-bg border border-border px-3 py-2.5 text-[13px] text-text1 placeholder:text-text2/50 outline-none focus:border-text1" />
          </div>
          <div>
            <label className="arch-label text-text2 block mb-1.5">{t('contact.message')}</label>
            <textarea required rows="4" className="w-full bg-bg border border-border px-3 py-2.5 text-[13px] text-text1 placeholder:text-text2/50 outline-none focus:border-text1 resize-none" />
          </div>
          <button type="submit" className="w-full font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-bg bg-text1 py-3 hover:bg-text2 transition-colors">
            {t('contact.send')}
          </button>
        </form>
      )}
    </div>
  )
}
