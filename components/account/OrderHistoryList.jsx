'use client'
import { useState } from 'react'
import { Package, X, ChevronRight } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS_STYLE = {
  Paid:       'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-200 text-green-800',
  Cancelled:  'bg-red-100 text-red-600',
  Pending:    'bg-yellow-100 text-yellow-700',
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <p className="font-semibold text-bg text-[14px]">Order Detail</p>
            <p className="font-mono text-[11px] text-gray-400 mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-bg p-1"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Status</span>
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-500'}`}>
              {order.status}
            </span>
          </div>

          {/* Customer info */}
          <div className="border border-gray-100 p-4 bg-gray-50">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-3">Customer Info</p>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div><span className="text-gray-400 text-[11px]">Name</span><p className="font-medium text-bg">{order.customer?.firstName} {order.customer?.lastName}</p></div>
              <div><span className="text-gray-400 text-[11px]">Phone</span><p className="font-medium text-bg">{order.customer?.phone || '-'}</p></div>
              <div className="col-span-2"><span className="text-gray-400 text-[11px]">Email</span><p className="font-medium text-bg">{order.customer?.email || '-'}</p></div>
              <div className="col-span-2"><span className="text-gray-400 text-[11px]">Address</span><p className="font-medium text-bg">{order.customer?.address}, {order.customer?.city} {order.customer?.postalCode}</p></div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-3">Items Ordered</p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-gray-400 font-bold">{item.product?.name?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-bg">{item.product?.name}</p>
                      <p className="text-[11px] text-gray-400">Size: {item.size} × {item.qty}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-bg">{formatPrice(item.product?.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 pt-4 space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-medium text-bg">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">Shipping</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold pt-1 border-t border-gray-200">
              <span className="text-bg">Total</span>
              <span className="text-pink">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="flex justify-between text-[12px] text-gray-400">
            <span>Payment Method</span>
            <span className="font-semibold text-bg uppercase">{order.payMethod || 'QRIS'}</span>
          </div>

          <div className="flex justify-between text-[12px] text-gray-400">
            <span>Order Date</span>
            <span className="font-semibold text-bg">{formatDate(order.date)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderHistoryList({ orders }) {
  const [selected, setSelected] = useState(null)

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center border border-gray-200">
        <Package size={32} className="text-gray-200 mx-auto mb-3"/>
        <p className="text-[13px] text-gray-400">No orders yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {orders.map(order => (
          <button key={order.id} onClick={() => setSelected(order)}
            className="w-full text-left border border-gray-200 p-4 hover:border-pink hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-[12px] font-bold text-bg">{order.id}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(order.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-500'}`}>
                  {order.status}
                </span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-pink transition-colors"/>
              </div>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400">{order.items?.length || 0} item(s)</span>
              <span className="font-semibold text-pink">{formatPrice(order.total)}</span>
            </div>
          </button>
        ))}
      </div>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)}/>
    </>
  )
}
