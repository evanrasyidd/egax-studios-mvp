'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function HeroSection() {
  const root = useRef(null)
  const hydrated = useHydrated()
  const { t, productName: productNameOf } = useI18n()
  const { products, heroPreOrderBadge } = useAdminStore()
  const dropCount = hydrated && heroPreOrderBadge ? products.filter(p => p.preOrder).length : 0
  const featured = hydrated ? products.find(p => p.featured) : null
  const productName = productNameOf(featured) || 'Duck Chore Jacket'
  const productPrice = featured ? formatPrice(featured.price) : 'Rp 698.000'
  const productCategory = featured?.category ?? 'Jacket'
  const serial = String([...productName].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7)).padStart(4, '0')
  const plateProduct = featured || {
    id: 'p001',
    name: productName,
    category: productCategory,
    fabric: 'Heavyweight duck canvas · 12oz',
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const headline = q('.hero-headline')
      // Char-level: "WEAR" & "EVERYDAY." kebuka huruf per huruf di dalam mask
      const split = SplitText.create(headline, { type: 'words', mask: 'lines' })
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
        tl.fromTo(words, { yPercent: 130 }, {
          yPercent: 0, duration: 0.9, stagger: 0.12,
        }, 0.1)
          .fromTo(q('.hero-badge'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.35)
          .fromTo(q('.hero-sub'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.6)
          .fromTo(q('.hero-cta'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, 0.75)
          // Kartu: kebuka dari bawah (clip), bukan fade polos
          .fromTo(card, { clipPath: 'inset(100% 0% 0% 0%)', y: 40 }, {
            clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.95, ease: 'power3.inOut',
          }, 0.8)
          // Ghost number naik pelan
          .fromTo(q('.hero-ghost'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }, 0.5)
          // Scroll-out dibuat SETELAH intro selesai + start state eksplisit —
          // kalau dibuat barengan, ScrollTrigger nyomot state kata yang lagi
          // setengah animasi jadi start value → kata nyangkut & konflik tween.
          .add(() => {
            gsap.fromTo(headline, { yPercent: 0, opacity: 1 }, {
              yPercent: 60,
              opacity: 0,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
            })
            gsap.fromTo(card, { yPercent: 0 }, {
              yPercent: 26,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
            })
            gsap.fromTo(q('.hero-ghost'), { yPercent: 0 }, {
              yPercent: -70,
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
    <section ref={root} className="relative bg-bg min-h-[92svh] flex flex-col overflow-hidden">
      {/* Ghost number — angka arsip raksasa di belakang, paralaks pas scroll */}
      <span aria-hidden="true" className="hero-ghost absolute top-24 right-6 md:right-16 font-display font-black leading-none text-[clamp(120px,22vw,260px)] text-text1/[0.04] tracking-[-0.04em] pointer-events-none select-none">
        001
      </span>
      <div className="flex-1 flex items-center">
        <div className="relative mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-16 lg:py-0">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            {/* Kiri: headline */}
            <div>
              <div className="hero-badge mb-6 flex items-center gap-4 md:mb-10">
                {dropCount > 0 ? (
                  <span className="arch-label text-text1 border border-text1 px-3 py-1.5">{t('hero.preorderOpen', { n: dropCount })}</span>
                ) : (
                  <span className="arch-label text-text1 border border-text1 px-3 py-1.5">{t('hero.fallbackBadge')}</span>
                )}
                <span className="hidden sm:block text-[11px] font-medium uppercase tracking-[0.14em] text-text2">{t('hero.dropInfo')}</span>
              </div>

              <h1 className="hero-headline font-display font-black uppercase leading-[0.88] text-text1 tracking-[-0.03em]">
                <span className="block text-[clamp(56px,10.5vw,128px)]">WEAR</span>
                <span className="mt-1 block text-[clamp(48px,9vw,110px)] md:mt-2">EVERYDAY.</span>
              </h1>

              <p className="hero-sub mt-6 max-w-[400px] text-sm font-medium tracking-wide text-text2 md:mt-8">
                {t('hero.productLine', { name: productName, category: productCategory, drop: dropCount > 0 ? `${dropCount} PRE-ORDER` : t('tag.limited') })}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10 md:gap-5">
                <Link href="/catalog"
                  className="hero-cta group relative inline-flex items-center overflow-hidden bg-text1 text-bg px-8 py-4">
                  <span aria-hidden="true" className="btn-sweep-fill absolute inset-0 bg-bg translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 arch-label transition-colors duration-300 group-hover:text-text1">{t('hero.shop')}</span>
                </Link>
                <Link href="/editorial"
                  className="hero-cta group relative inline-flex items-center overflow-hidden border border-text1 text-text1 px-8 py-4">
                  <span aria-hidden="true" className="btn-sweep-fill absolute inset-0 bg-text1 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 arch-label transition-colors duration-300 group-hover:text-bg">{t('hero.lookbook')}</span>
                </Link>
              </div>
            </div>

            {/* Kanan: archive product card */}
            <div className="hero-card flex justify-center lg:justify-end">
              <div className="w-full max-w-[320px] md:max-w-[340px]">
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
                  <div className="border-b border-border">
                    <GarmentPlate product={plateProduct} showMeta={false} className="aspect-[3/4]" />
                  </div>
                  <div className="flex items-end justify-between px-5 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-text1 leading-snug">{productName}</p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-text2 mt-1">{productCategory}</p>
                    </div>
                    <span className="tnum text-[14px] font-bold text-text1 shrink-0 ml-4">{productPrice}</span>
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
          <span className="text-[11px] uppercase tracking-[0.14em] text-text2">{t('hero.corner')}</span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-text2">Jakarta · Drop 01</span>
        </div>
      </div>
    </section>
  )
}
