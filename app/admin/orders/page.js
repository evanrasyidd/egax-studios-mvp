'use client'
import { useState } from 'react'
import { Eye, X } from 'lucide-react'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

const STATUS_OPTIONS = ['Pending','Paid','Processing','Shipped','Delivered','Cancelled']
const STATUS_COLORS = {
  Pending:'border-yellow-500 text-yellow-400',
  Paid:'border-green-500 text-green-400',
  Processing:'border-blue-500 text-blue-400',
  Shipped:'border-purple-500 text-purple-400',
  Delivered:'border-green-600 text-green-500',
  Cancelled:'border-red-500 text-red-400',
}

export default function AdminOrdersPage() {
  const hydrated = useHydrated()
  const { orders: ordersRaw, addOrder } = useOrderStore()
  const orders = hydrated ? ordersRaw : []
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [localStatuses, setLocalStatuses] = useState({})

  const getStatus = (o) => localStatuses[o.id] || o.status || 'Paid'

  const updateStatus = (orderId, status) => {
    setLocalStatuses(prev => ({ ...prev, [orderId]: status }))
    toast(`Order status updated to ${status} ★`)
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.id?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || getStatus(o) === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pixel text-[8px] text-pink mb-1">ADMIN PANEL</p>
        <h1 className="font-pixel text-[16px] text-text1">ORDERS.EXE</h1>
        <p className="font-pixel text-[7px] text-text2 mt-1">{orders.length} TOTAL ORDERS</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH ORDER ID OR CUSTOMER..."
          className="flex-1 bg-surface border-2 border-border text-text1 font-pixel text-[8px] px-4 py-2.5 outline-none focus:border-pink" />
        <div className="flex gap-1 flex-wrap">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`font-pixel text-[7px] px-3 py-2 border-2 transition-all ${statusFilter===s ? 'bg-pink text-black border-black' : 'bg-surface text-text2 border-border hover:border-pink'}`}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border bg-surface">
              {['ORDER ID','CUSTOMER','CHANNEL','TOTAL','PAYMENT','STATUS','DATE','ACTIONS'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-pixel text-[7px] text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-10 text-center font-pixel text-[8px] text-text2">NO ORDERS FOUND.</td></tr>
            ) : (
              filtered.map((o) => {
                const status = getStatus(o)
                const isPos = o.channel === 'pos'
                return (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-pixel text-[7px] text-text2">{o.id}</td>
                    <td className="py-3 px-4 font-body text-[13px] text-text1">{o.customer?.firstName} {o.customer?.lastName}</td>
                    <td className="py-3 px-4">
                      <span className={`font-pixel text-[6px] px-2 py-1 border ${isPos ? 'border-cyan-700 text-cyan-400' : 'border-border text-text2'}`}>
                        {isPos ? 'POS' : 'ONLINE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-pixel text-[8px] text-pink">{formatPrice(o.total)}</td>
                    <td className="py-3 px-4 font-pixel text-[7px] text-text2">{(o.payMethod||'qris').toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <select value={status} onChange={e => updateStatus(o.id, e.target.value)}
                        className={`font-pixel text-[7px] px-2 py-1 border-2 bg-transparent cursor-pointer outline-none ${STATUS_COLORS[status] || 'border-border text-text2'}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-pixel text-[7px] text-text2">{formatDate(o.date)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedOrder(o)}
                        className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-pink hover:text-pink transition-all">
                        <Eye size={11} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[90] bg-bg/80 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          `}</style>
          <div className="bg-surface border-4 border-pink w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[modalIn_0.2s_ease-out]" style={{ boxShadow:'8px 8px 0 #FF2D9B' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b-4 border-border sticky top-0 bg-surface">
              <h2 className="font-pixel text-[9px] text-pink">ORDER DETAIL ★ {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-text2 hover:text-pink"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div>
                <p className="font-pixel text-[7px] text-pink mb-2">CUSTOMER INFO</p>
                <div className="border-2 border-border p-3 space-y-1">
                  {[
                    ['Name', `${selectedOrder.customer?.firstName} ${selectedOrder.customer?.lastName}`],
                    ['Email', selectedOrder.customer?.email],
                    ['Phone', selectedOrder.customer?.phone],
                    ['Address', selectedOrder.customer?.address],
                    ['City', `${selectedOrder.customer?.city}, ${selectedOrder.customer?.postalCode}`],
                  ].map(([k,v]) => v && (
                    <div key={k} className="flex gap-3 text-[12px]">
                      <span className="font-pixel text-[7px] text-text2 w-16 shrink-0 mt-0.5">{k}</span>
                      <span className="font-body text-text1">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Items */}
              <div>
                <p className="font-pixel text-[7px] text-pink mb-2">ITEMS</p>
                <div className="border-2 border-border divide-y-2 divide-border">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.key} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <p className="font-body text-[12px] text-text1">{item.product?.name}</p>
                        <p className="font-pixel text-[7px] text-text2">SIZE: {item.size} × {item.qty}</p>
                      </div>
                      <span className="font-pixel text-[8px] text-pink">{formatPrice(item.product?.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Total */}
              <div className="flex justify-between font-pixel text-[9px] border-t-2 border-border pt-3">
                <span className="text-text2">TOTAL</span>
                <span className="text-pink">{formatPrice(selectedOrder.total)}</span>
              </div>
              {/* Status update */}
              <div>
                <p className="font-pixel text-[7px] text-text2 mb-2">UPDATE STATUS</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => { updateStatus(selectedOrder.id, s); setSelectedOrder(null) }}
                      className={`font-pixel text-[7px] px-3 py-1.5 border-2 transition-all ${(localStatuses[selectedOrder.id]||selectedOrder.status)===s ? 'bg-pink text-black border-black' : 'border-border text-text2 hover:border-pink hover:text-pink'}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
