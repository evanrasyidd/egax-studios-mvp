'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function SectionHeading({ no, title, href, linkLabel }) {
  const root = useRef(null)
  const titleRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const split = SplitText.create(titleRef.current, { type: 'lines,words' })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
      })
      tl.fromTo(q('.sh-no'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.045 }, '-=0.25')
        .fromTo(q('.sh-link'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.5')

      return () => split.revert()
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [title] })

  return (
    <div ref={root} className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
      <div className="flex items-baseline gap-4">
        <span className="sh-no arch-label text-text2">{no}</span>
        <h2 ref={titleRef} className="font-display text-[30px] md:text-[34px] font-bold tracking-[-0.01em] text-text1">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="sh-link hidden sm:inline-flex items-center gap-2 arch-label text-text2 hover:text-text1 group">
          {linkLabel}
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}
