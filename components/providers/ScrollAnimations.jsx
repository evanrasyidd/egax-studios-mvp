'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE = 'power3.out'

/**
 * Scroll reveal global — satu bahasa gerak buat semua halaman:
 * - [data-reveal]          → fade-up sekali masuk viewport
 * - .product-card          → batch stagger untuk grid produk
 * - .archive-tile          → batch stagger untuk editorial/gallery tiles
 * - [data-speed]           → parallax halus (nilai positif = naik pelan)
 * - [data-zoom]            → settle dari scale 1.12 ke 1 pas masuk viewport
 * Reduced-motion: semua animasi dimatikan (matchMedia).
 */
export default function ScrollAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Fade-up generic
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 32, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Grid produk & tiles — batch stagger
      ScrollTrigger.batch('.product-card', {
        start: 'top 92%',
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: EASE, stagger: 0.07 }),
      })

      ScrollTrigger.batch('.archive-tile', {
        start: 'top 92%',
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: EASE, stagger: 0.07 }),
      })

      // Parallax elemen kecil (label nomor section, detail)
      gsap.utils.toArray('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.4
        gsap.fromTo(el, { y: 0 }, {
          y: speed * -90,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
        })
      })

      // Zoom settle blok visual (editorial/gallery/lookbook)
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
