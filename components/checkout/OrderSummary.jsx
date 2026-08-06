'use client'
import { formatPrice } from '@/lib/utils'
import GarmentIcon from '@/components/product/GarmentIcon'
import { useI18n } from '@/store/i18nStore'

const THUMB_COLORS = ['#A6A29A','#77736C','#5A5751','#3A3936','#222220','#8F8B84','#6E6A63','#4A4844']

export default function OrderSummary({ items, total, discount = 0 }) {
  const { t, productName } = useI18n()
  const payable = Math.max(0, total - discount)
  return (
    <div className="bg-surface border border-text1">
      <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
        <span className="arch-label text-bg">{t('checkout.summary')}</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-bg/60">{items.length} ITEMS</span>
      </div>
      <div className="p-5">
        <div className="space-y-3 mb-4 pb-4 border-b border-border">
          {items.map((item, i) => {
            const thumbColor = THUMB_COLORS[(parseInt(item.product.id?.replace('p','')) || i) % THUMB_COLORS.length]
            return (
              <div key={item.key} className="flex gap-3">
                <div className="w-12 h-16 shrink-0 border border-border flex items-center justify-center overflow-hidden" style={{ background: thumbColor }}>
                  <GarmentIcon category={item.product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#111111" scale={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text1 leading-snug">{productName(item.product)}</p>
                  <p className="font-mono text-[10px] text-text2 mt-0.5">{t('checkout.size', { size: item.size, qty: item.qty })}</p>
                </div>
                <span className="font-mono text-[11px] font-medium text-text1 shrink-0">{formatPrice(item.product.price*item.qty)}</span>
              </div>
            )
          })}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[13px]"><span className="text-text2">{t('checkout.subtotal')}</span><span className="font-medium text-text1">{formatPrice(total)}</span></div>
          <div className="flex justify-between text-[12px]"><span className="text-text2">{t('checkout.shipping')}</span><span className="text-green-700 font-medium">{t('checkout.free')}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-[12px]"><span className="text-text2">{t('checkout.voucherDiscount')}</span><span className="text-green-700 font-medium">-{formatPrice(discount)}</span></div>
          )}
          <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-border"><span className="text-text1">{t('checkout.total')}</span><span className="text-text1">{formatPrice(payable)}</span></div>
        </div>
      </div>
    </div>
  )
}
