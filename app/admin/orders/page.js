'use client'
import { useState } from 'react'
import { Eye, X, Download } from 'lucide-react'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { useI18n } from '@/store/i18nStore'

const STATUS_OPTIONS = ['Pending','Paid','Processing','Shipped','Delivered','Cancelled']
const STATUS_COLORS = {
  Pending:'border-yellow-500 text-yellow-400',
  Paid:'border-green-500 text-green-700',
  Processing:'border-blue-500 text-blue-400',
  Shipped:'border-purple-500 text-purple-400',
  Delivered:'border-green-600 text-green-500',
  Cancelled:'border-red-500 text-red-700',
}

export default function AdminOrdersPage() {
  const { t, productName } = useI18n()
  const hydrated = useHydrated()
  const { orders: ordersRaw, updateOrderStatus } = useOrderStore()
  const orders = hydrated ? ordersRaw : []
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatus = (o) => o.status || 'Pending'

  const updateStatus = (orderId, status) => {
    updateOrderStatus(orderId, status)
    toast(t('admin.statusUpdated', { status: t(`status.${status}`) }))
  }

  const exportCSV = () => {
    if (orders.length === 0) { toast(t('admin.noOrdersYet'), 'error'); return }
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = ['ID','Date','Customer','Email','Items','Subtotal','Discount','Voucher','Total','Status','Channel','Payment'].join(',')
    const rows = orders.map((o) => {
      const items = (o.items || []).map((i) => `${productName(i.product)} (${i.size} x${i.qty})`).join('; ')
      return [
        o.id, new Date(o.date).toISOString(),
        `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim(),
        o.customer?.email,
        items,
        o.subtotal ?? o.total,
        o.discount ?? 0,
        o.voucherCode || '',
        o.total,
        o.status,
        o.channel || 'shop',
        o.payMethod || '',
      ].map(esc).join(',')
    })
    const blob = new Blob([`\uFEFF${[header, ...rows].join('\n')}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `egax-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast(t('admin.csvExported'))
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.id?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || getStatus(o) === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="arch-label text-pink mb-1">{t('admin.panel')}</p>
          <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-text1">{t('admin.ordersTitle')}</h1>
          <p className="font-mono text-[10px] font-medium text-text2 mt-1">{t('admin.totalOrders', { n: orders.length })}</p>
        </div>
        <Button onClick={exportCSV} size="sm">
          <Download size={12} /> {t('admin.exportCsv')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('admin.searchOrders')}
          className="flex-1 bg-surface border border-border text-text1 font-mono text-[10px] font-medium px-4 py-2.5 outline-none focus:border-pink" />
        <div className="flex gap-1 flex-wrap">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`font-mono text-[10px] font-medium px-3 py-2 border transition-all ${statusFilter===s ? 'bg-text1 text-bg border-text1' : 'bg-surface text-text2 border-border hover:border-text1'}`}>
              {s === 'all' ? t('admin.all') : t(`status.${s}`).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[t('admin.colOrderId'),t('admin.colCustomer'),t('admin.colChannel'),t('admin.colTotal'),t('admin.colPayment'),t('admin.colStatus'),t('admin.colDate'),t('admin.colActions')].map(h => (
                <th key={h} className="text-left py-3 px-4 font-mono text-[10px] font-medium text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-10 text-center font-mono text-[10px] font-medium text-text2">{t('admin.noOrdersFound')}</td></tr>
            ) : (
              filtered.map((o) => {
                const status = getStatus(o)
                const isPos = o.channel === 'pos'
                return (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] font-medium text-text2">{o.id}</td>
                    <td className="py-3 px-4 font-body text-[13px] text-text1">{o.customer?.firstName} {o.customer?.lastName}</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono text-[9px] font-medium px-2 py-1 border ${isPos ? 'border-cyan-700 text-cyan-400' : 'border-border text-text2'}`}>
                        {isPos ? 'POS' : t('admin.online')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] font-medium text-pink">{formatPrice(o.total)}</td>
                    <td className="py-3 px-4 font-mono text-[10px] font-medium text-text2">{(o.payMethod||'qris').toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <select value={status} onChange={e => updateStatus(o.id, e.target.value)}
                        className={`font-mono text-[10px] font-medium px-2 py-1 border bg-transparent cursor-pointer outline-none ${STATUS_COLORS[status] || 'border-border text-text2'}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] font-medium text-text2">{formatDate(o.date)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedOrder(o)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-text2 hover:border-pink hover:text-pink transition-all">
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
        <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          `}</style>
          <div className="anim-rise bg-surface border border-text1 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ boxShadow:'0 8px 24px rgba(35,33,27,0.16)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b-4 border-border sticky top-0 bg-surface">
              <h2 className="font-mono text-[11px] font-medium text-pink">{t('admin.orderDetailTitle', { id: selectedOrder.id })}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-text2 hover:text-pink"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div>
                <p className="font-mono text-[10px] font-medium text-pink mb-2">{t('admin.customerInfo')}</p>
                <div className="border border-border p-3 space-y-1">
                  {[
                    [t('admin.name'), `${selectedOrder.customer?.firstName} ${selectedOrder.customer?.lastName}`],
                    [t('admin.email'), selectedOrder.customer?.email],
                    [t('admin.phone'), selectedOrder.customer?.phone],
                    [t('admin.address'), selectedOrder.customer?.address],
                    [t('admin.city'), `${selectedOrder.customer?.city}, ${selectedOrder.customer?.postalCode}`],
                  ].map(([k,v]) => v && (
                    <div key={k} className="flex gap-3 text-[12px]">
                      <span className="font-mono text-[10px] font-medium text-text2 w-16 shrink-0 mt-0.5">{k}</span>
                      <span className="font-body text-text1">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Items */}
              <div>
                <p className="font-mono text-[10px] font-medium text-pink mb-2">{t('admin.items')}</p>
                <div className="border border-border divide-y divide-border">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.key} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <p className="font-body text-[12px] text-text1">{productName(item.product)}</p>
                        <p className="font-mono text-[10px] font-medium text-text2">{t('admin.size', { size: item.size, qty: item.qty })}</p>
                      </div>
                      <span className="font-mono text-[10px] font-medium text-pink">{formatPrice(item.product?.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Total */}
              <div className="flex justify-between font-mono text-[11px] font-medium border-t border-border pt-3">
                <span className="text-text2">{t('admin.total')}</span>
                <span className="text-pink">{formatPrice(selectedOrder.total)}</span>
              </div>
              {/* Status update */}
              <div>
                <p className="font-mono text-[10px] font-medium text-text2 mb-2">{t('admin.updateStatus')}</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => { updateStatus(selectedOrder.id, s); setSelectedOrder(null) }}
                      className={`font-mono text-[10px] font-medium px-3 py-1.5 border transition-all ${(selectedOrder.status)===s ? 'bg-text1 text-bg border-text1' : 'border-border text-text2 hover:border-text1 hover:text-text1'}`}>
                      {t(`status.${s}`).toUpperCase()}
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
