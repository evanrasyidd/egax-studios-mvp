'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = 'power3.out'

/**
 * Scroll reveal global — SEMUA gerakan scrub dua arah: scroll bolak-balik
 * bikin elemen ikut bergerak, bukan cuma entrance sekali jalan.
 * - [data-reveal]          → fade/slide scrub (masuk & keluar viewport)
 * - .product-card          → "archive sheet" masuk + drift pelan scrub
 * - .archive-tile          → clip reveal dari bawah (scrub)
 * - [data-ghost]           → angka arsip raksasa nge-drift sepanjang section
 * - [data-speed]           → parallax halus
 * - [data-zoom]            → settle scale scrub
 * Reduced-motion: semua mati (matchMedia).
 */
export default function ScrollAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Fade/slide scrub — dua arah (bolak-balik scroll ikut bergerak)
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 44, opacity: 0 }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 52%', scrub: 0.5 },
        })
      })

      // Grid produk — archive sheet masuk bergantian, lalu drift pelan
      ScrollTrigger.batch('.product-card', {
        start: 'top 94%',
        once: true,
        onEnter: (els) => {
          els.forEach((el, i) => {
            gsap.fromTo(el, { y: 36, opacity: 0, rotate: i % 2 === 0 ? -2.5 : 2.5 }, {
              y: 0, opacity: 1, rotate: 0, duration: 0.7, ease: EASE, delay: i * 0.06,
            })
            // Drift scrub dua arah (yPercent beda property dari reveal y)
            gsap.fromTo(el, { yPercent: -4 }, {
              yPercent: 4, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            })
          })
        },
      })

      // Editorial/gallery tiles — clip reveal scrub dua arah
      ScrollTrigger.batch('.archive-tile', {
        start: 'top 94%',
        once: true,
        onEnter: (els) => {
          els.forEach((el, i) => {
            gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)', y: 26 }, {
              clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.85, ease: 'power3.inOut', delay: i * 0.09,
            })
          })
        },
      })

      // Ghost section numbers — drift dua arah
      gsap.utils.toArray('[data-ghost]').forEach((el) => {
        gsap.fromTo(el, { yPercent: 18, xPercent: -6 }, {
          yPercent: -18, xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })

      // Judul halaman — skew halus dua arah pas scroll (efek editorial)
      gsap.utils.toArray('[data-skew]').forEach((el) => {
        gsap.fromTo(el, { skewY: 3 }, {
          skewY: -3, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })

      // Parallax elemen kecil — dua arah
      gsap.utils.toArray('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.4
        gsap.fromTo(el, { y: 0 }, {
          y: speed * -90,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
        })
      })

      // Zoom settle blok visual — dua arah
      gsap.utils.toArray('[data-zoom]').forEach((el) => {
        gsap.fromTo(el, { scale: 1.12 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: 0.5 },
        })
      })
    })

    return () => mm.revert()
  })

  return null
}
