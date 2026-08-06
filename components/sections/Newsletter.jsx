'use client'
import { useState } from 'react'
import { useI18n } from '@/store/i18nStore'
export default function Newsletter() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section className="bg-bg border-t border-border py-16 px-6 md:px-10">
      <div data-reveal className="max-w-xl mx-auto text-center">
        <p className="arch-label text-pink mb-3">{t('newsletter.kicker')}</p>
        <h2 className="font-display text-[38px] md:text-[42px] font-bold tracking-[-0.01em] text-text1 mb-2">{t('newsletter.title')}</h2>
        <p className="text-[13px] text-text2 mb-8">{t('newsletter.sub')}</p>
        {done ? (
          <p className="text-[13px] text-text2 border border-text1 bg-surface px-4 py-3 arch-label">{t('newsletter.success')}</p>
        ) : (
          <form onSubmit={e=>{e.preventDefault();setDone(true)}} className="flex max-w-md mx-auto border border-text1 bg-surface overflow-hidden">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={t('newsletter.placeholder')} required
              className="flex-1 bg-transparent px-4 py-3 text-[13px] text-text1 placeholder:text-text2/50 outline-none"/>
            <button type="submit" className="border-l border-text1 px-5 text-text2 hover:text-bg hover:bg-text1 transition-colors font-mono text-[10px] uppercase tracking-[0.18em]">→</button>
          </form>
        )}
      </div>
    </section>
  )
}
