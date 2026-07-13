'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import GarmentIcon from '@/components/product/GarmentIcon'
import { formatPrice } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlistStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'

const PLACEHOLDER_COLORS = ['#4ADE80','#FF2E7E','#FACC15','#60A5FA','#F87171','#A78BFA','#34D399','#FB923C','#818CF8','#FCD34D']

export default function ProductCard({ product, index = 0, onDark = false }) {
  const [hovered, setHovered] = useState(false)
  const hydrated = useHydrated()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = hydrated && isWishlisted(product.id)
  const colorIdx = parseInt(product.id.replace('p','')) || index
  const bgColor = PLACEHOLDER_COLORS[colorIdx % PLACEHOLDER_COLORS.length]
  const bgColorHover = PLACEHOLDER_COLORS[(colorIdx + 3) % PLACEHOLDER_COLORS.length]

  return (
    <div className={cn('group cursor-pointer', onDark ? 'bg-card' : 'bg-white')}>
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden" style={{aspectRatio:'3/4'}}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          {/* Garment representation per kategori -- bukan foto asli,
              tapi siluet yang sesuai bentuk barang (bukan blok warna polos) */}
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 transition-colors duration-300"
            style={{background: hovered ? bgColorHover : bgColor}}>
            <GarmentIcon category={product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#0A0A0A" scale={hovered ? 6 : 5}/>
            <span className="font-body text-[10px] font-bold text-white/80 uppercase tracking-wider px-2 text-center leading-tight">
              {product.category}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.preOrder && <Badge variant="preorder">Pre Order</Badge>}
            {product.newCollection && !product.preOrder && <Badge variant="new">New</Badge>}
            {product.originalPrice && <Badge variant="sale">Sale</Badge>}
          </div>

          {/* Wishlist btn */}
          <button onClick={e => { e.preventDefault(); toggle(product) }}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-bg/80 border border-border opacity-0 group-hover:opacity-100 transition-all hover:border-pink"
            aria-label="Wishlist">
            <Heart size={12} className={wishlisted ? 'fill-pink text-pink' : 'text-text2'}/>
          </button>

          {/* Sold out */}
          {product.soldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white border border-white px-3 py-1">Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      <div className={cn('px-2 pt-2.5 pb-3', onDark ? 'bg-card' : 'bg-white')}>
        <p className="text-[10px] uppercase tracking-widest text-text2 mb-0.5">{product.vendor}</p>
        <Link href={`/product/${product.slug}`}>
          <p className={cn('text-[13px] font-medium leading-snug mb-1 hover:text-pink transition-colors', onDark ? 'text-bg' : 'text-text1')}>
            {product.name}
          </p>
        </Link>
        <div className="flex items-center gap-2">
          {product.originalPrice && <span className="text-[11px] line-through text-text2">{formatPrice(product.originalPrice)}</span>}
          <span className={cn('text-[13px] font-semibold', product.originalPrice ? 'text-pink' : onDark ? 'text-bg' : 'text-text1')}>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
