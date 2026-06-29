import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-16 h-22 shrink-0 overflow-hidden bg-card">
        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-widest text-text2">{item.product.vendor}</p>
        <p className="text-[13px] font-medium text-text1 mt-0.5">{item.product.name}</p>
        <p className="text-[11px] text-text2 mt-0.5">Size: {item.size}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[13px] font-semibold text-text1">{formatPrice(item.product.price * item.qty)}</span>
          <button onClick={() => onRemove(item.key)} className="text-text2 hover:text-red-400">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
