'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import GarmentIcon from '@/components/product/GarmentIcon'

const THUMB_COLORS = ['#A6A29A','#77736C','#5A5751','#3A3936','#222220','#8F8B84','#6E6A63','#4A4844']

export default function CartDrawer() {
  const { t, productName } = useI18n()
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
        className={`fixed inset-0 bg-text1/50 z-[60] backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[400px] bg-surface z-[70] flex flex-col border-l border-pink shadow-[-12px_0_40px_-8px_rgba(35,33,27,0.3)] transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart size={14} className="text-pink" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-text1">{t('cart.title')}</span>
            {count > 0 && <span className="font-mono text-[9px] font-medium text-text2">({count})</span>}
          </div>
          <button onClick={closeCart} className="text-text2 hover:text-pink hover:border-pink p-1 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <ShoppingCart size={32} className="text-border" />
              <p className="arch-label text-text2">{t('cart.empty')}</p>
              <Button variant="outline" onClick={closeCart}>{t('cart.continue')}</Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item, i) => {
                const thumbColor = THUMB_COLORS[(parseInt(item.product.id?.replace('p','')) || i) % THUMB_COLORS.length]
                return (
                  <div key={item.key} className="anim-rise flex gap-4 p-4" style={{ animationDelay: `${Math.min(i * 55, 330)}ms` }}>
                    <div className="w-16 shrink-0 border border-border flex items-center justify-center overflow-hidden" style={{ background: thumbColor, aspectRatio:'3/4' }}>
                      <GarmentIcon category={item.product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#111111" scale={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="arch-label text-text2 mb-0.5">{item.product.vendor}</p>
                      <p className="font-body text-[12px] font-medium text-text1 leading-snug mb-1">{productName(item.product)}</p>
                      <p className="arch-label text-text2 mb-2">{t('cart.size', { size: item.size })}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink hover:bg-surface">
                            <Minus size={9} />
                          </button>
                          <span className="w-7 text-center font-mono text-[9px] font-medium text-text1">{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink hover:bg-surface">
                            <Plus size={9} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-medium text-text1">{formatPrice(item.product.price * item.qty)}</span>
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
          <div className="border-t border-border p-5 space-y-3">
            <div className="flex justify-between arch-label">
              <span className="text-text2">{t('cart.subtotal')}</span>
              <span className="text-text1">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between arch-label pb-3 border-b border-border">
              <span className="text-text2">{t('cart.shipping')}</span>
              <span className="text-pink">{t('cart.free')}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" className="w-full">{t('cart.checkout', { total: formatPrice(total) })}</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
