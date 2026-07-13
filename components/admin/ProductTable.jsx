import GarmentIcon from '@/components/product/GarmentIcon'
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
                  <div className="relative w-10 h-14 shrink-0 overflow-hidden bg-card flex items-center justify-center">
                    <GarmentIcon category={p.category} fill="rgba(0,0,0,0.85)" shade="rgba(0,0,0,0.35)" detail="#FF2E7E" scale={1.7} />
                  </div>
                  <span className="text-[13px] text-text1 font-medium">{p.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-[12px] text-text2">{p.category}</td>
              <td className="py-3 px-4 text-[13px] font-semibold text-text1">{formatPrice(p.price)}</td>
              <td className="py-3 px-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${
                  p.soldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
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
