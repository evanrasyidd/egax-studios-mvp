'use client'
import { useEffect, useRef, useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import Button from '@/components/ui/Button'
import GarmentPlate from '@/components/product/GarmentPlate'

gsap.registerPlugin(useGSAP)

export default function CartDrawer() {
  const { t, productName } = useI18n()
  const { isCartOpen, closeCart } = useUIStore()
  const { items, removeItem, updateQty, getTotalPrice, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef(null)
  const total = getTotalPrice()
  const count = getTotalItems()

  useFocusTrap(isCartOpen, panelRef, closeCart)

  useEffect(() => {
    if (isCartOpen) {
      const raf = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(raf)
    }
    setMounted(false)
  }, [isCartOpen])

  useGSAP(() => {
    if (!isCartOpen) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lines = gsap.utils.toArray('.cart-line')
      if (lines.length) {
        gsap.fromTo(lines, { y: 10, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power3.out',
        })
      }
    })
    return () => mm.revert()
  }, { scope: panelRef, dependencies: [isCartOpen, items.length] })

  if (!isCartOpen) return null

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-text1/60 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-[400px] flex-col border-l border-text1 bg-surface transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} aria-hidden="true" className="text-text1" />
            <h2 id="cart-title" className="arch-label text-text1">{t('cart.title')}</h2>
            {count > 0 && <span className="font-mono text-[11px] font-medium text-text2 tnum">({count})</span>}
          </div>
          <button type="button" onClick={closeCart} aria-label={t('nav.close')} className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingCart size={32} aria-hidden="true" className="text-border" />
              <p className="text-[13px] text-text2">{t('cart.empty')}</p>
              <Button variant="outline" onClick={closeCart}>{t('cart.continue')}</Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.key} className="cart-line flex gap-4 p-4">
                  <div className="w-16 shrink-0 overflow-hidden border border-border">
                    <GarmentPlate product={item.product} showMeta={false} compact className="aspect-[3/4] w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{item.product.vendor}</p>
                    <p className="mb-1 text-[13px] font-medium leading-snug text-text1">{productName(item.product)}</p>
                    <p className="mb-2 font-mono text-[11px] text-text2">{t('cart.size', { size: item.size })}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label={t('cart.decrease')}
                          className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center font-mono text-[12px] font-medium text-text1 tnum">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label={t('cart.increase')}
                          className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(item.product.price * item.qty)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={t('cart.remove')}
                          className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-border p-5">
            <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.08em]">
              <span className="text-text2">{t('cart.subtotal')}</span>
              <span className="text-text1 tnum">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 font-mono text-[12px] uppercase tracking-[0.08em]">
              <span className="text-text2">{t('cart.shipping')}</span>
              <span className="text-text1">{t('cart.free')}</span>
            </div>
            <Button href="/checkout" variant="primary" className="w-full" onClick={closeCart}>
              {t('cart.checkout', { total: formatPrice(total) })}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
