'use client'
import { useRef, useState } from 'react'
import { Package, X, ChevronRight } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useI18n } from '@/store/i18nStore'

const STATUS_STYLE = {
  Paid:       'bg-text1 text-bg',
  Processing: 'border border-text1 text-text1',
  Shipped:    'border border-text1 text-text1',
  Delivered:  'bg-text1 text-bg',
  Cancelled:  'border border-red-700 text-red-700',
  Pending:    'border border-border text-text2',
}

// Urutan progress: Pending → Paid → Processing → Shipped → Delivered
const FLOW = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered']
const FLOW_INDEX = FLOW.reduce((acc, s, i) => { acc[s] = i; return acc }, {})

function StatusTimeline({ status }) {
  const { t } = useI18n()
  if (status === 'Cancelled') {
    return (
      <div className="border border-red-600 bg-red-50 px-4 py-3">
        <p className="arch-label text-red-700">{t('account.cancelledNote')}</p>
      </div>
    )
  }
  const current = FLOW_INDEX[status] ?? 0
  return (
    <div className="border border-border bg-bg p-5">
      <p className="arch-label text-text2 mb-4">{t('account.trackOrder')}</p>
      <ol className="space-y-0">
        {FLOW.map((s, i) => {
          const done = i <= current
          const isNow = i === current
          return (
            <li key={s} className="relative flex gap-3 pb-5 last:pb-0">
              {i < FLOW.length - 1 && (
                <span aria-hidden="true" className={`absolute left-[5px] top-4 bottom-0 w-px ${done ? 'bg-text1' : 'bg-border'}`} />
              )}
              <span aria-hidden="true" className={`relative mt-1 w-[11px] h-[11px] rounded-full border shrink-0 ${isNow ? 'bg-text1 border-text1' : done ? 'bg-text1 border-text1' : 'bg-surface border-border'}`}>
                {isNow && <span className="absolute inset-[-4px] rounded-full border border-text1/40 animate-pulse" />}
              </span>
              <div className="-mt-0.5">
                <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${done ? 'text-text1' : 'text-text2'}`}>
                  {t(`status.${s}`)}{isNow && <span className="ml-2 text-text2">({t('account.currentStatus')})</span>}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function OrderDetailModal({ order, onClose }) {
  const { t, productName } = useI18n()
  const modalRef = useRef(null)
  useFocusTrap(Boolean(order), modalRef, onClose)
  if (!order) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-text1/60 p-4">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="order-detail-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-surface">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <div>
            <p id="order-detail-title" className="text-[14px] font-semibold text-text1">{t('account.orderDetail')}</p>
            <p className="mt-0.5 font-mono text-[11px] text-text2">{order.id}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('nav.close')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-text1"><X size={16} aria-hidden="true"/></button>
        </div>
        <div className="p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="arch-label text-text2">{t('account.status')}</span>
            <span className={`px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLE[order.status] || 'border border-border text-text2'}`}>
              {t(`status.${order.status}`)}
            </span>
          </div>

          {/* Tracking timeline */}
          <StatusTimeline status={order.status} />

          {/* Customer info */}
          <div className="border border-border p-4 bg-surface">
            <p className="arch-label text-pink mb-3">{t('account.customerInfo')}</p>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div><span className="text-text2 text-[11px]">{t('account.name')}</span><p className="font-medium text-text1">{order.customer?.firstName} {order.customer?.lastName}</p></div>
              <div><span className="text-text2 text-[11px]">{t('checkout.phone')}</span><p className="font-medium text-text1">{order.customer?.phone || '-'}</p></div>
              <div className="col-span-2"><span className="text-text2 text-[11px]">{t('account.email')}</span><p className="font-medium text-text1">{order.customer?.email || '-'}</p></div>
              <div className="col-span-2"><span className="text-text2 text-[11px]">{t('checkout.address')}</span><p className="font-medium text-text1">{order.customer?.address}, {order.customer?.city} {order.customer?.postalCode}</p></div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="arch-label text-pink mb-3">{t('account.items')}</p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-border border border-border flex items-center justify-center shrink-0">
                      <span className="text-[11px] text-text2 font-bold">{productName(item.product)[0] || ''}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text1">{productName(item.product)}</p>
                      <p className="text-[11px] text-text2">{t('checkout.size', { size: item.size, qty: item.qty })}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-text1">{formatPrice(item.product?.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-border pt-4 space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-text2">{t('account.subtotal')}</span>
              <span className="font-medium text-text1">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text2">{t('account.shipping')}</span>
              <span className="font-medium text-green-600">{t('checkout.free')}</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold pt-1 border-t border-border">
              <span className="text-text1">{t('account.total')}</span>
              <span className="text-pink">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="flex justify-between text-[12px] text-text2">
            <span>{t('account.payMethod')}</span>
            <span className="font-semibold text-text1 uppercase">{order.payMethod || 'QRIS'}</span>
          </div>

          <div className="flex justify-between text-[12px] text-text2">
            <span>{t('account.orderDate')}</span>
            <span className="font-semibold text-text1">{formatDate(order.date)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderHistoryList({ orders }) {
  const { t, productName } = useI18n()
  const [selected, setSelected] = useState(null)

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center border border-border">
        <Package size={32} className="text-border mx-auto mb-3"/>
        <p className="text-[13px] text-text2">{t('account.noOrders')}</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {orders.map(order => (
          <button key={order.id} onClick={() => setSelected(order)}
            className="w-full text-left border border-border p-4 hover:border-pink transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-[12px] font-bold text-text1">{order.id}</p>
                <p className="text-[11px] text-text2 mt-0.5">{formatDate(order.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLE[order.status] || 'border border-border text-text2'}`}>
                  {t(`status.${order.status}`)}
                </span>
                <ChevronRight size={14} className="text-text2 group-hover:text-pink transition-colors"/>
              </div>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text2">{t('account.itemCount', { n: order.items?.length || 0 })}</span>
              <span className="font-semibold text-pink">{formatPrice(order.total)}</span>
            </div>
          </button>
        ))}
      </div>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)}/>
    </>
  )
}
