'use client'
import { Heart } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { useHydrated } from '@/hooks/useHydrated'
export default function WishlistGrid() {
  const hydrated = useHydrated()
  const { items: itemsRaw } = useWishlistStore()
  const items = hydrated ? itemsRaw : []
  if (items.length===0) return (
    <div className="py-16 text-center border border-gray-200">
      <Heart size={32} className="text-gray-200 mx-auto mb-3"/>
      <p className="text-[13px] text-gray-400">Your wishlist is empty.</p>
    </div>
  )
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-100">
      {items.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}
    </div>
  )
}
