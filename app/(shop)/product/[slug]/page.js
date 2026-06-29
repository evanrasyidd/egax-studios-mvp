'use client'
import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import { Heart } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import ProductGallery from '@/components/product/ProductGallery'
import SizeSelector from '@/components/product/SizeSelector'
import QuantitySelector from '@/components/product/QuantitySelector'
import CompleteTheFit from '@/components/product/CompleteTheFit'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

export default function ProductPage({ params }) {
  const { slug } = use(params)
  const hydrated = useHydrated()
  const { products } = useAdminStore()
  const product = products.find(p => p.slug === slug)

  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const { addItem } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const { openCart } = useUIStore()
  const wishlisted = hydrated && product ? isWishlisted(product.id) : false
  const pidx = product ? parseInt(product.id.replace('p','')) || 0 : 0

  // Tunggu store ke-rehydrate dulu sebelum nge-judge produk "not found" --
  // adminStore (sumber data produk) baru terisi penuh setelah rehydrate,
  // jadi notFound() di render pertama (sebelum hydrated) bisa keliru.
  if (hydrated && !product) notFound()
  if (!product) return null

  const handleAddToCart = () => {
    if (!size) { toast('Please select a size', 'error'); return }
    addItem(product, size, qty)
    toast(product.name + ' added to cart')
    openCart()
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery name={product.name} category={product.category} productIndex={pidx} />

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">{product.vendor}</p>
              <h1 className="font-display text-[36px] tracking-widest text-bg leading-none mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                {product.originalPrice && <span className="text-[14px] line-through text-gray-400">{formatPrice(product.originalPrice)}</span>}
                <span className={`text-[22px] font-bold ${product.originalPrice ? 'text-pink' : 'text-bg'}`}>{formatPrice(product.price)}</span>
              </div>
            </div>

            {product.preOrder && (
              <div className="bg-bg text-pink text-[11px] font-semibold uppercase tracking-widest px-4 py-3 border-l-4 border-pink">
                ★ Pre Order — ships in 14-21 days
              </div>
            )}

            <p className="text-[14px] text-gray-600 leading-relaxed border-t border-b border-gray-100 py-5">
              {product.description}
            </p>

            <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} soldOut={product.soldOut} />
            {!product.soldOut && <QuantitySelector qty={qty} onChange={setQty} />}

            <div className="flex gap-3">
              {product.soldOut ? (
                <Button variant="dark" className="flex-1 opacity-50 cursor-not-allowed" disabled>Sold Out</Button>
              ) : (
                <Button variant="primary" className="flex-1" onClick={handleAddToCart}>Add to Cart</Button>
              )}
              <button onClick={() => toggle(product)}
                className={`w-12 h-12 flex items-center justify-center border transition-all ${wishlisted ? 'border-pink bg-pink/10' : 'border-gray-200 hover:border-pink'}`}>
                <Heart size={16} className={wishlisted ? 'fill-pink text-pink' : 'text-gray-400'}/>
              </button>
            </div>

            <Accordion items={[
              { title:'Size & Fit', content:'Model is 180cm wearing size M. We recommend sizing up for a more oversized fit.' },
              { title:'Materials & Care', content:'100% premium cotton. Machine wash cold, gentle cycle. Do not tumble dry. Iron on low heat.' },
              { title:'Shipping & Returns', content:'Free shipping across Indonesia. Orders processed within 2-3 business days. Returns accepted within 14 days.' },
            ]}/>
          </div>
        </div>
      </div>
      <CompleteTheFit currentId={product.id} category={product.category}/>
    </div>
  )
}
