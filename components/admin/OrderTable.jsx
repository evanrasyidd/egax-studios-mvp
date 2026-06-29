import { formatPrice, formatDate } from '@/lib/utils'

export function OrderTable({ orders }) {
  if (!orders || orders.length === 0) {
    return <p className="text-text2 text-sm py-6 text-center">No orders yet.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-text2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-surface/50">
              <td className="py-3 px-4 font-mono text-[12px] text-text1">{o.id}</td>
              <td className="py-3 px-4 text-[13px] text-text2">{o.customer?.firstName} {o.customer?.lastName}</td>
              <td className="py-3 px-4 text-[13px] font-semibold text-text1">{formatPrice(o.total)}</td>
              <td className="py-3 px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-green-900/30 text-green-400">
                  {o.status}
                </span>
              </td>
              <td className="py-3 px-4 text-[12px] text-text2">{formatDate(o.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
