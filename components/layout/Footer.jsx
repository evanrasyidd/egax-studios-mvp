'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Instagram } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Footer() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const root = useRef(null)

  // Giant wordmark — "EGAX STUDIOS" raksasa slide-up reveal pas footer masuk
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.footer-wordmark'), { yPercent: 100 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: q('.footer-wordmark-wrap'), start: 'top bottom', end: 'top 68%', scrub: 0.6 },
      })
      gsap.fromTo(q('.footer-wordmark'), { opacity: 0.3 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: q('.footer-wordmark-wrap'), start: 'top bottom', end: 'top 68%', scrub: 0.6 },
      })
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <footer ref={root} className="bg-bg border-t border-border">
      {/* Giant wordmark */}
      <div className="overflow-hidden border-b border-border">
        <div className="footer-wordmark-wrap px-6 md:px-10 pt-10 md:pt-14 overflow-hidden">
          <div className="footer-wordmark font-display font-black uppercase tracking-[-0.03em] leading-[0.82] text-[clamp(64px,13.5vw,220px)] text-text1 whitespace-nowrap select-none pointer-events-none">
            EGAX STUDIOS
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-border">
          <div>
            <p className="text-[12px] text-text2 tracking-wider mb-6">{t('footer.tagline')}</p>
            <form onSubmit={e=>e.preventDefault()} className="flex border border-text1 bg-surface overflow-hidden">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 bg-transparent px-3 py-2.5 text-[12px] text-text1 placeholder:text-text2/50 outline-none"/>
              <button type="submit" className="border-l border-text1 px-3 text-text2 hover:text-bg hover:bg-text1 transition-colors"><ArrowRight size={13}/></button>
            </form>
          </div>
          {[
            { title: t('footer.customerCare'), links: [{ l: t('footer.contact'), h: '/contact' }, { l: t('footer.refund'), h: '/contact' }, { l: t('footer.privacy'), h: '/contact' }, { l: t('footer.shipping'), h: '/contact' }] },
            { title: t('footer.brand'), links: [{ l: t('footer.aboutUs'), h: '/about' }, { l: t('footer.editorial'), h: '/editorial' }, { l: t('footer.gallery'), h: '/gallery' }, { l: t('footer.catalog'), h: '/catalog' }] },
            { title: t('footer.legal'), links: [{ l: t('footer.terms'), h: '/contact' }, { l: t('footer.legalNotice'), h: '/contact' }, { l: t('footer.cookie'), h: '/contact' }] },
          ].map(col => (
            <div key={col.title}>
              <p className="arch-label text-text2 mb-4">{col.title}</p>
              {col.links.map(l => <Link key={l.l} href={l.h} className="block text-[13px] text-text2 hover:text-pink mb-2 transition-colors">{l.l}</Link>)}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-text2">{t('footer.rights')}</p>
            <p className="text-[10px] text-text2/70">Built by <a href="https://github.com/evanrasyidd" target="_blank" rel="noopener noreferrer" className="hover:text-pink transition-colors">Evan Rasyid Ega Pratama</a></p>
          </div>
          <div className="flex items-center gap-2">
            {['QRIS','BCA','BNI','Mandiri','OVO'].map(p => (
              <span key={p} className="font-mono text-[8px] font-medium uppercase tracking-[0.16em] text-text2 border border-border px-2 py-0.5 hover:border-pink transition-colors">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
