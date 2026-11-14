'use client'
import Link from 'next/link'
import { Heart, GitCompareArrows } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import GarmentPlate from '@/components/product/GarmentPlate'
import { formatPrice, cn } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'

export default function ProductCard({ product, onDark = false }) {
  const hydrated = useHydrated()
  const { t, productName } = useI18n()
  const { toggle, isWishlisted } = useWishlistStore()
  const compareToggle = useCompareStore(s => s.toggle)
  const isCompared = useCompareStore(s => s.ids.includes(product.id))
  const wishlisted = hydrated && isWishlisted(product.id)

  const badge = product.preOrder
    ? { variant: 'preorder', label: t('product.preOrder') }
    : product.newCollection
      ? { variant: 'new', label: t('product.new') }
      : product.originalPrice
        ? { variant: 'sale', label: t('product.sale') }
        : null

  return (
    <article className={cn('product-card group relative flex flex-col', onDark ? 'bg-card' : 'bg-surface')}>
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative overflow-hidden">
            <GarmentPlate
              product={product}
              showMeta={false}
              marks={false}
              className="aspect-[3/4] w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            />
            <div className="absolute left-2 top-2">
              {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
            </div>
            {product.soldOut && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="border border-white px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                  {t('product.soldOut')}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button
            onClick={() => toggle(product)}
            aria-label={t('product.wishlist')}
            aria-pressed={wishlisted}
            className="flex h-11 w-11 items-center justify-center border border-border bg-bg/95 text-text2 transition-colors hover:border-text1 hover:text-text1"
          >
            <Heart size={16} className={wishlisted ? 'fill-text1 text-text1' : ''} aria-hidden="true" />
          </button>
          <button
            onClick={() => compareToggle(product.id)}
            aria-label={t('product.compare')}
            aria-pressed={isCompared}
            className={cn(
              'flex h-11 w-11 items-center justify-center border transition-colors',
              isCompared
                ? 'border-text1 bg-text1 text-bg'
                : 'border-border bg-bg/95 text-text2 hover:border-text1 hover:text-text1'
            )}
          >
            <GitCompareArrows size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-3 pt-2.5">
        <p className="mb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{product.vendor}</p>
        <Link href={`/product/${product.slug}`} className="block">
          <p className={cn('mb-1 text-[13px] font-medium leading-snug transition-colors group-hover:text-text2', onDark ? 'text-bg' : 'text-text1')}>
            {productName(product)}
          </p>
        </Link>
        <div className="mt-auto flex items-center gap-2 pt-1">
          {product.originalPrice && (
            <span className="tnum text-[11px] text-text2 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          <span className={cn('tnum font-mono text-[12px] font-medium', product.originalPrice ? 'text-text1' : onDark ? 'text-bg' : 'text-text1')}>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </article>
  )
}
