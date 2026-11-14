'use client'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Motion storefront, satu bahasa:
 * - [data-reveal] masuk sekali, halus
 * - .product-card / .archive-tile masuk sekali, stagger
 * - tidak ada drift, skew, zoom, atau parallax yang jalan terus
 * Pin + scrub yang berat cuma di Hero, ScrubReel, dan StackShowcase.
 * Admin/POS dilewati total.
 */
export default function ScrollAnimations() {
  const pathname = usePathname()
  const disabled = Boolean(pathname?.startsWith('/admin') || pathname?.startsWith('/pos'))

  useGSAP(() => {
    if (disabled) return
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      ScrollTrigger.batch('.product-card', {
        start: 'top 94%',
        once: true,
        onEnter: (els) => {
          els.forEach((el, i) => {
            gsap.fromTo(el, { y: 26, opacity: 0 }, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: Math.min(i * 0.05, 0.25),
              ease: 'power3.out',
            })
          })
        },
      })

      ScrollTrigger.batch('.archive-tile', {
        start: 'top 94%',
        once: true,
        onEnter: (els) => {
          els.forEach((el, i) => {
            gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.8,
              ease: 'power3.inOut',
              delay: Math.min(i * 0.07, 0.28),
            })
          })
        },
      })

      // Font swap bisa menggeser tinggi heading. Refresh sekali setelah font siap.
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh())
      }
    })

    return () => mm.revert()
  }, { dependencies: [pathname, disabled] })

  return null
}
