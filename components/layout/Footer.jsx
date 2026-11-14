'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function Footer() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const wordmark = q('.footer-wordmark')[0]
      if (!wordmark) return
      const split = SplitText.create(wordmark, { type: 'chars' })
      gsap.fromTo(split.chars, { yPercent: 110 }, {
        yPercent: 0,
        ease: 'none',
        stagger: 0.03,
        scrollTrigger: { trigger: q('.footer-wordmark-wrap')[0], start: 'top bottom', end: 'top 68%', scrub: 0.6 },
      })
      gsap.fromTo(wordmark, { opacity: 0.3 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: q('.footer-wordmark-wrap')[0], start: 'top bottom', end: 'top 68%', scrub: 0.6 },
      })
      return () => split.revert()
    })
    return () => mm.revert()
  }, { scope: root })

  const columns = [
    {
      title: t('footer.customerCare'),
      links: [
        { l: t('footer.contact'), h: '/contact' },
        { l: t('footer.refund'), h: '/policies' },
        { l: t('footer.privacy'), h: '/policies' },
        { l: t('footer.shipping'), h: '/policies' },
      ],
    },
    {
      title: t('footer.brand'),
      links: [
        { l: t('footer.aboutUs'), h: '/about' },
        { l: t('footer.editorial'), h: '/editorial' },
        { l: t('footer.gallery'), h: '/gallery' },
        { l: t('footer.catalog'), h: '/catalog' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { l: t('footer.terms'), h: '/policies' },
        { l: t('footer.legalNotice'), h: '/policies' },
        { l: t('footer.cookie'), h: '/policies' },
      ],
    },
  ]

  return (
    <footer ref={root} className="border-t border-border bg-bg">
      <div className="overflow-hidden border-b border-border">
        <div className="footer-wordmark-wrap overflow-hidden px-4 pb-2 pt-10 md:px-10 md:pt-14">
          <div aria-hidden="true" className="footer-wordmark whitespace-nowrap font-display text-[clamp(42px,10.4vw,168px)] font-black uppercase leading-[0.82] tracking-[-0.04em] text-text1">
            EGAX STUDIOS
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-10 md:px-10">
        <div className="mb-10 grid grid-cols-1 gap-8 border-b border-border pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-6 max-w-[240px] text-[13px] leading-relaxed text-text2">{t('footer.tagline')}</p>

            {subscribed ? (
              <p role="status" className="max-w-[280px] border border-text1 bg-surface px-4 py-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-text1">
                {t('footer.subscribed')}
              </p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true) }} className="flex max-w-[300px] border border-text1 bg-surface">
                <label htmlFor="footer-email" className="sr-only">{t('footer.newsletterLabel')}</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletterPlaceholder')}
                  className="min-h-11 flex-1 bg-transparent px-3 py-2.5 text-[12px] text-text1 placeholder:text-text2"
                />
                <button type="submit" className="min-h-11 border-l border-text1 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-text1 transition-colors hover:bg-text1 hover:text-bg">
                  {t('footer.join')}
                </button>
              </form>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title} data-reveal>
              <p className="arch-label mb-4 text-text2">{col.title}</p>
              {col.links.map((l) => (
                <Link key={l.l} href={l.h} className="mb-2.5 block text-[13px] text-text2 transition-colors hover:text-text1">
                  {l.l}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] text-text2">{t('footer.rights')}</p>
            <p className="mt-0.5 text-[11px] text-text2">
              Built by{' '}
              <a href="https://github.com/evanrasyidd" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text1">
                Evan Rasyid Ega Pratama
              </a>
            </p>
          </div>
          <p className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
            {t('footer.demo')}
          </p>
        </div>
      </div>
    </footer>
  )
}
