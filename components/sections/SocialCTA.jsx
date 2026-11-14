'use client'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

export default function SocialCTA() {
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const plates = [0, 8, 14].map((i) => products[i]).filter(Boolean)

  return (
    <section className="grid grid-cols-1 border-b border-border bg-bg md:grid-cols-[1fr_2.4fr]">
      <div data-reveal className="flex flex-col justify-center border-b border-border px-8 py-12 md:border-b-0 md:border-r md:px-10">
        <p className="arch-label mb-4 text-text2">{t('social.label')}</p>
        <h2 className="mb-8 font-display text-[40px] font-bold leading-[0.95] tracking-[-0.02em] text-text1 md:text-[52px]">
          {t('social.title1')}<br />{t('social.title2')}
        </h2>
        <a
          href="https://instagram.com/egaxstudios"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 border border-text1 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text1 transition-colors hover:bg-text1 hover:text-bg"
        >
          <Instagram size={15} aria-hidden="true" /> @egaxstudios
        </a>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border p-px">
        {plates.map((p, i) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="archive-tile group relative overflow-hidden bg-surface">
            <GarmentPlate product={p} showMeta={false} compact marks={false} className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-border bg-bg px-2.5 py-2">
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-text1">{productName(p)}</span>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">IG / {String(i + 1).padStart(2, '0')}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
