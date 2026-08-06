'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import GarmentIcon from '@/components/product/GarmentIcon'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const GARMENT_TONES = ['#F0EFEA', '#E4E2DC', '#D8D6CF', '#C6C3BB', '#A6A29A', '#77736C', '#4A4844', '#222220']

export default function HeroSection() {
  const root = useRef(null)
  const hydrated = useHydrated()
  const { t, productName: productNameOf } = useI18n()
  const { products, heroPreOrderBadge } = useAdminStore()
  const dropCount = hydrated && heroPreOrderBadge ? products.filter(p => p.preOrder).length : 0
  const featured = hydrated ? products.find(p => p.featured) : null
  const productName = productNameOf(featured) || 'Duck Chore Jacket'
  const productPrice = featured ? `IDR ${featured.price.toLocaleString('id-ID')}` : 'IDR 698K'
  const productCategory = featured?.category ?? 'Jacket'
  const serial = String([...productName].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7)).padStart(4, '0')
  const toneIdx = parseInt(featured?.id?.replace('p', '') || '1') % GARMENT_TONES.length

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const headline = q('.hero-headline')
      const split = SplitText.create(headline, { type: 'lines,words' })
      const words = split.words
      const card = q('.hero-card')

      const cleanups = []

      // Entrance hero mulai SETELAH preloader selesai (event global),
      // biar gak ada intro dobel / muncul di atas hero.
      let started = false
      const play = () => {
        if (started) return
        started = true
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.fromTo(words, { yPercent: 118, rotation: 3 }, {
          yPercent: 0, rotation: 0, duration: 0.9, stagger: 0.05,
        }, 0.1)
          .fromTo(q('.hero-badge'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.3)
          .fromTo(q('.hero-sub'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.5)
          .fromTo(q('.hero-cta'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, 0.6)
          .fromTo(card, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.65)
          // Scroll-out dibuat SETELAH intro selesai + start state eksplisit —
          // kalau dibuat barengan, ScrollTrigger nyomot state kata yang lagi
          // setengah animasi jadi start value → kata nyangkut & konflik tween.
          .add(() => {
            gsap.fromTo(words, { yPercent: 0, opacity: 1 }, {
              yPercent: 85,
              opacity: 0,
              ease: 'none',
              stagger: 0.03,
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
            })
            gsap.fromTo(card, { yPercent: 0 }, {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
            })
            gsap.fromTo(headline, { yPercent: 0 }, {
              yPercent: -8,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
            })
          })
      }

      if (window.__egaxIntroDone) {
        play()
      } else {
        window.addEventListener('egax-intro-done', play)
        const fallback = setTimeout(play, 2500)
        cleanups.push(() => {
          clearTimeout(fallback)
          window.removeEventListener('egax-intro-done', play)
        })
      }

      // Magnetic buttons — desktop + pointer halus doang
      const listeners = []
      if (window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
        gsap.utils.toArray('.hero-cta').forEach((btn) => {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' })
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' })
          const move = (e) => {
            const r = btn.getBoundingClientRect()
            xTo((e.clientX - r.left - r.width / 2) * 0.22)
            yTo((e.clientY - r.top - r.height / 2) * 0.34)
          }
          const leave = () => { xTo(0); yTo(0) }
          btn.addEventListener('mousemove', move)
          btn.addEventListener('mouseleave', leave)
          listeners.push([btn, move, leave])
        })
      }

      return () => {
        split.revert()
        cleanups.forEach((fn) => fn())
        listeners.forEach(([btn, move, leave]) => {
          btn.removeEventListener('mousemove', move)
          btn.removeEventListener('mouseleave', leave)
        })
      }
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} className="relative bg-bg min-h-[92vh] min-h-[560px] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-10 py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20 items-center">
            {/* Kiri: headline */}
            <div>
              <div className="hero-badge flex items-center gap-4 mb-10">
                {dropCount > 0 ? (
                  <span className="arch-label text-text1 border border-text1 px-3 py-1.5">{t('hero.preorderOpen', { n: dropCount })}</span>
                ) : (
                  <span className="arch-label text-text1 border border-text1 px-3 py-1.5">{t('hero.fallbackBadge')}</span>
                )}
                <span className="hidden sm:block text-[11px] font-medium uppercase tracking-[0.2em] text-text2">{t('hero.dropInfo')}</span>
              </div>

              <h1 className="hero-headline font-display font-black uppercase leading-[0.88] text-text1 tracking-[-0.03em]">
                <span className="block text-[clamp(64px,10.5vw,128px)]">WEAR</span>
                <span className="block text-[clamp(56px,9vw,110px)] mt-2">EVERYDAY.</span>
              </h1>

              <p className="hero-sub text-sm text-text2 font-medium mt-8 tracking-wide max-w-[400px]">
                {t('hero.productLine', { name: productName, category: productCategory, drop: dropCount > 0 ? `${dropCount} PRE-ORDER` : t('tag.limited') })}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-10">
                <Link href="/catalog"
                  className="hero-cta group relative inline-flex items-center gap-3 overflow-hidden bg-text1 text-bg px-8 py-4">
                  <span aria-hidden="true" className="btn-sweep-fill absolute inset-0 bg-bg translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 arch-label transition-colors duration-300 group-hover:text-text1">{t('hero.shop')}</span>
                  <ArrowRight size={12} className="relative z-10 transition-all duration-300 group-hover:text-text1 group-hover:translate-x-1" />
                </Link>
                <Link href="/editorial"
                  className="hero-cta group relative inline-flex items-center gap-3 overflow-hidden border border-text1 text-text1 px-8 py-4">
                  <span aria-hidden="true" className="btn-sweep-fill absolute inset-0 bg-text1 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 arch-label transition-colors duration-300 group-hover:text-bg">{t('hero.lookbook')}</span>
                  <ArrowRight size={12} className="relative z-10 transition-all duration-300 group-hover:text-bg group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Kanan: archive product card */}
            <div className="hero-card flex justify-center lg:justify-end">
              <div className="w-full max-w-[340px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="arch-label text-text1">Nº {serial}</span>
                  <span className="arch-label text-text2">{t('tag.limited')}</span>
                </div>
                <div className="border border-border bg-white">
                  {/* Header strip ala tag/archive card */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="arch-label text-text1">EGAX Studios</span>
                    <span className="arch-label text-text2">SS 2026</span>
                  </div>
                  <div className="flex items-center justify-center border-b border-border" style={{ aspectRatio: '1/1', background: GARMENT_TONES[toneIdx % GARMENT_TONES.length] }}>
                    <GarmentIcon category={productCategory} fill="rgba(255,255,255,0.9)" shade="rgba(0,0,0,0.16)" detail="#111111" scale={7} />
                  </div>
                  <div className="flex items-end justify-between px-5 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-text1 leading-snug">{productName}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-text2 mt-1">{productCategory}</p>
                    </div>
                    <span className="text-[14px] font-bold text-text1 shrink-0 ml-4">{productPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip hero */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text2">{t('hero.corner')}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-text2">Jakarta · Drop 01</span>
        </div>
      </div>
    </section>
  )
}
