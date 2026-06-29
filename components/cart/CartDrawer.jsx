'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import GarmentIcon from '@/components/product/GarmentIcon'

const THUMB_COLORS = ['#4ADE80','#FF2D9B','#FACC15','#60A5FA','#F87171','#A78BFA','#34D399','#FB923C']

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQty, getTotalPrice, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const total = getTotalPrice()
  const count = getTotalItems()

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen])

  // Trigger transition di frame setelah mount, bukan bareng initial render,
  // supaya browser benar-benar animasikan dari state awal (translate-x-full)
  // ke posisi akhir, bukan langsung "lompat" tanpa transisi.
  useEffect(() => {
    if (isCartOpen) {
      const raf = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(raf)
    }
    setMounted(false)
  }, [isCartOpen])

  if (!isCartOpen) return null
  return (
    <>
      <div
        className={`fixed inset-0 bg-bg/70 z-[60] backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[400px] bg-surface z-[70] flex flex-col border-l-4 border-pink shadow-[-12px_0_40px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} className="text-pink" />
            <span className="font-pixel text-[10px] text-text1">CART.EXE</span>
            {count > 0 && <span className="font-pixel text-[8px] text-text2">({count})</span>}
          </div>
          <button onClick={closeCart} className="text-text2 hover:text-pink border-2 border-transparent hover:border-pink p-1 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <ShoppingBag size={32} className="text-border" />
              <p className="font-pixel text-[8px] text-text2">CART IS EMPTY</p>
              <Button variant="outline" onClick={closeCart}>CONTINUE SHOPPING</Button>
            </div>
          ) : (
            <div className="divide-y-2 divide-border">
              {items.map((item, i) => {
                const thumbColor = THUMB_COLORS[(parseInt(item.product.id?.replace('p','')) || i) % THUMB_COLORS.length]
                return (
                  <div key={item.key} className="flex gap-4 p-4">
                    <div className="w-16 shrink-0 border-2 border-border flex items-center justify-center overflow-hidden" style={{ background: thumbColor, aspectRatio:'3/4' }}>
                      <GarmentIcon category={item.product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#0A0A0A" scale={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-pixel text-[7px] text-text2 mb-0.5">{item.product.vendor}</p>
                      <p className="font-body text-[12px] font-medium text-text1 leading-snug mb-1">{item.product.name}</p>
                      <p className="font-pixel text-[7px] text-text2 mb-2">SIZE: {item.size}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-border">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink hover:bg-surface">
                            <Minus size={9} />
                          </button>
                          <span className="w-7 text-center font-pixel text-[8px] text-text1">{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink hover:bg-surface">
                            <Plus size={9} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[8px] text-text1">{formatPrice(item.product.price * item.qty)}</span>
                          <button onClick={() => removeItem(item.key)} className="text-text2 hover:text-pink">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-4 border-border p-5 space-y-3">
            <div className="flex justify-between font-pixel text-[8px]">
              <span className="text-text2">SUBTOTAL</span>
              <span className="text-text1">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between font-pixel text-[8px] pb-3 border-b-2 border-border">
              <span className="text-text2">SHIPPING</span>
              <span className="text-pink">GRATIS ★</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" className="w-full">CHECKOUT &gt;&gt; {formatPrice(total)}</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
