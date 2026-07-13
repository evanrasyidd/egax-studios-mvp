import { formatPrice } from '@/lib/utils'

export default function CartSummary({ total, itemCount }) {
  return (
    <div className="space-y-2 py-4 border-t border-border">
      <div className="flex justify-between text-[13px]">
        <span className="text-text2">Subtotal ({itemCount} item)</span>
        <span className="font-semibold text-text1">{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between text-[12px] text-text2">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">Gratis</span>
      </div>
      <div className="flex justify-between text-[15px] pt-2 border-t border-border">
        <span className="font-semibold text-text1">Total</span>
        <span className="font-bold text-text1">{formatPrice(total)}</span>
      </div>
    </div>
  )
}
