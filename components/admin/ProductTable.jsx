import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Product', 'Category', 'Price', 'Status'].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-text2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-surface/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-14 shrink-0 overflow-hidden bg-card">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  </div>
                  <span className="text-[13px] text-text1 font-medium">{p.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-[12px] text-text2">{p.category}</td>
              <td className="py-3 px-4 text-[13px] font-semibold text-text1">{formatPrice(p.price)}</td>
              <td className="py-3 px-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${
                  p.soldOut ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                }`}>
                  {p.soldOut ? 'Sold Out' : 'Active'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
