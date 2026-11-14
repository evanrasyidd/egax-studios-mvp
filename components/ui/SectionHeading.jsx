'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function SectionHeading({ no, title, href, linkLabel }) {
  const root = useRef(null)
  const titleRef = useRef(null)
  const ruleRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const split = SplitText.create(titleRef.current, { type: 'lines,words', mask: 'lines' })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
      })
      tl.fromTo(q('.sh-no'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.045 }, '-=0.25')
        .fromTo(q('.sh-link'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.5')

      // Rule bawah heading tumbuh dari kiri — nyambung sama bahasa hairline
      gsap.fromTo(ruleRef.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 45%', scrub: 0.4 },
      })

      return () => split.revert()
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [title] })

  return (
    <div ref={root} className="mb-8 pb-3 border-b border-border relative">
      <div ref={ruleRef} aria-hidden="true" className="absolute bottom-[-1px] left-0 h-px w-full bg-text1 origin-left scale-x-0" />
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <span className="sh-no arch-label text-text2">{no}</span>
          <h2 ref={titleRef} className="font-display text-[30px] md:text-[34px] font-bold tracking-[-0.01em] text-text1">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="sh-link hidden border-b border-text2/40 pb-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text2 transition-colors hover:border-text1 hover:text-text1 sm:inline-flex">
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
