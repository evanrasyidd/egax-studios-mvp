'use client'
import { LOOKBOOK } from '@/constants/lookbook'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

export default function GalleryContent() {
  const { t } = useI18n()
  const { products } = useAdminStore()

  return (
    <div className="min-h-screen bg-bg px-4 py-12 md:px-10">
      <div className="mb-10 flex items-baseline justify-between border-b border-border pb-5">
        <div className="flex items-baseline gap-4">
          <span className="arch-label text-text2">{t('gallery.label')}</span>
          <h1 className="font-display text-[36px] font-bold tracking-[-0.01em] text-text1 md:text-[40px]">{t('gallery.title')}</h1>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text2 sm:block">
          SS26 · {String(LOOKBOOK.length).padStart(2, '0')} FRAMES
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-4">
        {LOOKBOOK.map((item, i) => {
          const product = products[i % products.length]
          return (
            <article key={item.id} className="archive-tile group overflow-hidden bg-surface">
              <div className="relative">
                {product ? (
                  <GarmentPlate product={product} showMeta={false} marks={false} className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
                ) : (
                  <div className="aspect-[3/4] w-full bg-bg" />
                )}
                <span className="absolute left-2 top-2 border border-border bg-bg px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text1">
                  FRAME {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
                <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-text1">{item.alt}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text2">SS26</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
