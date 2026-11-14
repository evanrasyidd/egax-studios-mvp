'use client'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import GarmentPlate from '@/components/product/GarmentPlate'
import { EDITORIALS } from '@/constants/editorial'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

export default function EditorialBanner() {
  const { t, locale } = useI18n()
  const { products } = useAdminStore()
  const items = EDITORIALS.slice(0, 3)
  const plates = products.slice(0, 3)

  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <SectionHeading no="05" title={t('editorial.title')} href="/editorial" linkLabel={t('sections.viewAll')} />

        <div className="border-t border-text1">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href="/editorial"
              data-reveal
              className="group grid grid-cols-[40px_1fr_96px] items-stretch gap-4 border-b border-border py-4 md:grid-cols-[64px_1fr_150px] md:gap-6 md:py-5"
            >
              <span className="pt-1 font-mono text-[12px] text-text2 tnum">ED {String(i + 1).padStart(2, '0')}</span>

              <div className="flex min-w-0 flex-col justify-center">
                <p className="arch-label mb-1 text-text2">
                  {locale === 'id' && item.subtitleId ? item.subtitleId : item.subtitle}
                </p>
                <p className="font-display text-[24px] font-bold leading-[1.05] tracking-[-0.02em] text-text1 transition-transform duration-300 group-hover:translate-x-1 md:text-[38px]">
                  {locale === 'id' && item.titleId ? item.titleId : item.title}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(locale === 'id' && item.tagsId ? item.tagsId : item.tags).map((tag) => (
                    <span key={tag} className="border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {plates[i] ? (
                <GarmentPlate product={plates[i]} showMeta={false} compact marks={false} className="aspect-[3/4] w-full border border-border transition-transform duration-500 group-hover:scale-[1.02]" />
              ) : (
                <div className="aspect-[3/4] w-full border border-border bg-surface" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
