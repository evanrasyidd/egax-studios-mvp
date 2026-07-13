import { formatPrice } from '@/lib/utils'
import GarmentIcon from '@/components/product/GarmentIcon'

const THUMB_COLORS = ['#4ADE80','#FF2E7E','#FACC15','#60A5FA','#F87171','#A78BFA','#34D399','#FB923C']

export default function OrderSummary({ items, total }) {
  return (
    <div className="bg-surface border border-border p-6">
      <h3 className="font-display text-[20px] tracking-widest text-text1 mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4 pb-4 border-b border-border">
        {items.map((item, i) => {
          const thumbColor = THUMB_COLORS[(parseInt(item.product.id?.replace('p','')) || i) % THUMB_COLORS.length]
          return (
            <div key={item.key} className="flex gap-3">
              <div className="w-12 h-16 shrink-0 border border-border flex items-center justify-center overflow-hidden" style={{ background: thumbColor }}>
                <GarmentIcon category={item.product.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#0A0A0A" scale={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-text1 leading-snug">{item.product.name}</p>
                <p className="text-[11px] text-text2">Size: {item.size} × {item.qty}</p>
              </div>
              <span className="text-[12px] font-semibold text-text1 shrink-0">{formatPrice(item.product.price*item.qty)}</span>
            </div>
          )
        })}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[13px]"><span className="text-text2">Subtotal</span><span className="font-semibold text-text1">{formatPrice(total)}</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-text2">Shipping</span><span className="text-green-600 font-medium">Gratis</span></div>
        <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-border"><span className="text-text1">Total</span><span className="text-pink">{formatPrice(total)}</span></div>
      </div>
    </div>
  )
}
