'use client'
import { Heart } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
export default function WishlistGrid() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { items: itemsRaw } = useWishlistStore()
  const items = hydrated ? itemsRaw : []
  if (items.length===0) return (
    <div className="py-16 text-center border border-border">
      <Heart size={32} className="text-border mx-auto mb-3"/>
      <p className="text-[13px] text-text2">{t('account.wishlistEmpty')}</p>
    </div>
  )
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
      {items.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}
    </div>
  )
}
