'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, GitCompareArrows } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import GarmentIcon from '@/components/product/GarmentIcon'
import { formatPrice } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'

const PLACEHOLDER_COLORS = ['#A6A29A','#77736C','#5A5751','#3A3936','#222220','#8F8B84','#6E6A63','#4A4844','#9C9890','#2E2D2B']

export default function ProductCard({ product, index = 0, onDark = false }) {
  const [hovered, setHovered] = useState(false)
  const hydrated = useHydrated()
  const { t, productName } = useI18n()
  const { toggle, isWishlisted } = useWishlistStore()
  const compareToggle = useCompareStore(s => s.toggle)
  const isCompared = useCompareStore(s => s.ids.includes(product.id))
  const wishlisted = hydrated && isWishlisted(product.id)
  const colorIdx = parseInt(product.id.replace('p','')) || index
  const bgColor = PLACEHOLDER_COLORS[colorIdx % PLACEHOLDER_COLORS.length]
  const bgColorHover = PLACEHOLDER_COLORS[(colorIdx + 3) % PLACEHOLDER_COLORS.length]
  const badgeLabel = product.preOrder ? t('product.preOrder') : product.newCollection ? t('product.new') : product.originalPrice ? t('product.sale') : null
  // Prioritas badge: PRE ORDER > NEW > SALE — maksimal satu badge per kartu
  const badge = product.preOrder
    ? { variant: 'preorder', label: badgeLabel }
    : product.newCollection
      ? { variant: 'new', label: badgeLabel }
      : product.originalPrice
        ? { variant: 'sale', label: badgeLabel }
        : null

  return (
    <div className={cn('product-card group cursor-pointer', onDark ? 'bg-card' : 'bg-surface')}>
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden" style={{aspectRatio:'3/4'}}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          {/* Garment representation per kategori -- bukan foto asli,
              tapi siluet yang sesuai bentuk barang (bukan blok warna polos) */}
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 transition-all duration-500 ease-out group-hover:scale-[1.06]"
            style={{background: hovered ? bgColorHover : bgColor}}>
            <GarmentIcon category={product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#111111" scale={hovered ? 6 : 5}/>
            <span className="font-mono text-[8px] font-medium text-white/80 uppercase tracking-[0.2em] px-2 text-center leading-tight">
              {product.category}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2">
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>

          {/* Wishlist btn */}
          <button onClick={e => { e.preventDefault(); toggle(product) }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-bg/90 border border-border opacity-0 group-hover:opacity-100 transition-all hover:border-pink"
            aria-label={t('product.wishlist')}>
            <Heart size={13} className={wishlisted ? 'fill-pink text-pink' : 'text-text2'}/>
          </button>

          {/* Compare btn */}
          <button onClick={e => { e.preventDefault(); compareToggle(product.id) }}
            className={`absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border transition-all ${isCompared ? 'bg-text1 text-bg border-text1' : 'bg-bg/90 border-border text-text2 opacity-0 group-hover:opacity-100 hover:border-text1 hover:text-text1'}`}
            aria-label={t('product.compare')}>
            <GitCompareArrows size={13}/>
          </button>

          {/* Sold out */}
          {product.soldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-white border border-white px-3 py-1">{t('product.soldOut')}</span>
            </div>
          )}
        </div>
      </Link>

      <div className={cn('px-2 pt-2.5 pb-3', onDark ? 'bg-card' : 'bg-surface')}>
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-text2 mb-0.5">{product.vendor}</p>
        <Link href={`/product/${product.slug}`}>
          <p className={cn('text-[13px] font-medium leading-snug mb-1 transition-colors group-hover:text-pink inline-flex items-center gap-1.5', onDark ? 'text-bg' : 'text-text1')}>
            {productName(product)}
            <span aria-hidden="true" className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
          </p>
        </Link>
        <div className="flex items-center gap-2">
          {product.originalPrice && <span className="text-[11px] line-through text-text2">{formatPrice(product.originalPrice)}</span>}
          <span className={cn('font-mono text-[12px] font-medium', product.originalPrice ? 'text-pink' : onDark ? 'text-bg' : 'text-text1')}>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
