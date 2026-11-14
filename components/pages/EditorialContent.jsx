'use client'
import { EDITORIALS } from '@/constants/editorial'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

export default function EditorialContent() {
  const { t, locale } = useI18n()
  const { products } = useAdminStore()

  return (
    <div className="min-h-screen bg-bg px-4 py-12 md:px-10">
      <div className="mb-10 flex items-baseline justify-between border-b border-border pb-5">
        <div className="flex items-baseline gap-4">
          <span className="arch-label text-text2">{t('editorial.label')}</span>
          <h1 className="font-display text-[36px] font-bold tracking-[-0.01em] text-text1 md:text-[40px]">{t('editorial.title')}</h1>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text2 sm:block">
          SS26 · {String(EDITORIALS.length).padStart(2, '0')} DOCS
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {EDITORIALS.map((item, i) => {
          const product = products[i % products.length]
          return (
            <article key={item.id} className="archive-tile group overflow-hidden bg-surface">
              <div className="relative">
                {product ? (
                  <GarmentPlate product={product} showMeta={false} marks={false} className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
                ) : (
                  <div className="aspect-[3/4] w-full bg-bg" />
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-text1 bg-bg px-3 py-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text1">DOC {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{item.date}</span>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {(locale === 'id' && item.tagsId ? item.tagsId : item.tags).map((tag) => (
                    <span key={tag} className="border border-border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">{tag}</span>
                  ))}
                </div>
                <p className="arch-label mb-1 text-text2">{locale === 'id' && item.subtitleId ? item.subtitleId : item.subtitle}</p>
                <h2 className="font-display text-[22px] font-bold leading-tight tracking-[-0.01em] text-text1">
                  {locale === 'id' && item.titleId ? item.titleId : item.title}
                </h2>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
