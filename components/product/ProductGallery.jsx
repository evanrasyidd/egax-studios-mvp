'use client'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

const VIEWS = ['front', 'detail', 'label']

export default function ProductGallery({ product }) {
  const [view, setView] = useState('front')
  const { t } = useI18n()
  const plateRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(plateRef.current, { opacity: 0, scale: 1.012 }, {
        opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out',
      })
    })
    return () => mm.revert()
  }, { dependencies: [view] })

  return (
    <div className="flex flex-col gap-3">
      <div ref={plateRef} className="border border-border">
        <GarmentPlate
          product={product}
          view={view}
          className="aspect-[3/4] w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            aria-label={`${product.name}: ${t(`plate.${v}`)}`}
            className={cn(
              'border bg-surface p-0.5 transition-colors',
              view === v ? 'border-text1' : 'border-border hover:border-text2'
            )}
          >
            <GarmentPlate product={product} view={v} showMeta={false} compact className="aspect-[3/4] w-full" />
            <span className={cn(
              'block border-t px-1 py-1.5 text-center font-mono text-[11px] uppercase leading-none tracking-[0.08em]',
              view === v ? 'border-text1 text-text1' : 'border-border text-text2'
            )}>
              {t(`plate.${v}`)}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-[11px] leading-relaxed text-text2">{t('plate.notPhoto')}</p>
    </div>
  )
}
