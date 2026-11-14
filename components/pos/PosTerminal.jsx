'use client'
import { useState, useMemo } from 'react'
import { Search, Plus, Minus, Trash2, LogOut, ShoppingCart, X, Check, Printer } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { usePosStore } from '@/store/posStore'
import GarmentPlate from '@/components/product/GarmentPlate'
import { formatPrice, generateOrderId } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { useI18n } from '@/store/i18nStore'

const PAY_METHODS = [
  { id: 'cash', key: 'pos.cash' },
  { id: 'qris', key: 'pos.qris' },
  { id: 'debit', key: 'pos.debit' },
]

export default function PosTerminal() {
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const { addOrder } = useOrderStore()
  const {
    cashierName, lock, cart, addToCart, updateQty, removeFromCart,
    clearCart, getTotal, getItemCount,
  } = usePosStore()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showPayment, setShowPayment] = useState(false)
  const [payMethod, setPayMethod] = useState('cash')
  const [cashGiven, setCashGiven] = useState('')
  const [showSuccess, setShowSuccess] = useState(null)
  const [showLockConfirm, setShowLockConfirm] = useState(false)

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.soldOut) return false
      const matchCat = category === 'all' || p.category === category
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.nameId || '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, category, search])

  const total = getTotal()
  const itemCount = getItemCount()
  const change = payMethod === 'cash' ? Math.max(0, (Number(cashGiven) || 0) - total) : 0
  const cashEnough = payMethod !== 'cash' || (Number(cashGiven) || 0) >= total

  const handleCheckout = () => {
    if (cart.length === 0) { toast(t('pos.cartEmptyToast'), 'error'); return }
    setShowPayment(true)
    setCashGiven('')
    setPayMethod('cash')
  }

  const handleConfirmPayment = () => {
    if (!cashEnough) { toast(t('pos.cashNotEnoughToast'), 'error'); return }
    const orderId = generateOrderId()
    const order = {
      id: orderId,
      customer: { firstName: cashierName, lastName: '(POS)' },
      items: cart,
      total,
      status: 'Paid',
      date: new Date().toISOString(),
      payMethod: `POS-${payMethod.toUpperCase()}`,
      channel: 'pos',
    }
    addOrder(order)
    setShowSuccess({ orderId, total, change, items: cart, date: new Date().toISOString() })
    clearCart()
    setShowPayment(false)
  }

  const handleLock = () => {
    if (cart.length > 0) {
      toast(t('pos.lockToast'), 'error')
      return
    }
    setShowLockConfirm(true)
  }

  const confirmLock = () => {
    setShowLockConfirm(false)
    lock()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface shrink-0">
        <div>
          <p className="font-mono text-[11px] font-medium text-pink">{t('pos.badge')}</p>
          <h1 className="font-display text-[20px] font-bold tracking-[-0.01em] text-text1">{t('pos.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-mono text-[11px] font-medium text-text2">{t('pos.cashier')}<span className="text-text1">{cashierName}</span></p>
          <button
            onClick={handleLock}
            className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-text2 border border-border px-3 py-2 hover:border-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={11} /> {t('pos.logout')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── Product grid ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-4 border-b border-border shrink-0 space-y-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('pos.search')}
                className="w-full bg-bg border border-border text-text1 font-mono text-[11px] font-medium pl-9 pr-3 py-2.5 focus:border-text1"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 font-mono text-[11px] font-medium px-3 py-2 border transition-colors whitespace-nowrap ${
                    category === c ? 'border-text1 text-text1 bg-bg' : 'border-border text-text2 hover:border-text1'
                  }`}
                >
                  {c === 'all' ? t('pos.all') : t(`cat.${c.toLowerCase()}`).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <p className="font-mono text-[11px] font-medium text-text2 text-center py-12">{t('pos.notFound')}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((p) => {
                  return (
                    <button
                      key={p.id}
                      onClick={() => { addToCart(p, p.sizes?.[0]); toast(t('pos.added', { name: productName(p) })) }}
                      className="group border border-border text-left transition-colors hover:border-text1"
                    >
                      <GarmentPlate product={p} showMeta={false} compact className="aspect-[3/4] w-full" />
                      <div className="p-2.5 bg-surface">
                        <p className="font-body text-[11px] text-text1 leading-snug mb-1 line-clamp-2">{productName(p)}</p>
                        <p className="font-mono text-[11px] font-medium text-pink">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Cart panel ── */}
        <div className="w-full h-[42vh] lg:h-auto lg:w-[360px] border-t lg:border-t-0 lg:border-l border-pink bg-surface flex flex-col shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <ShoppingCart size={14} className="text-pink" />
            <span className="font-mono text-[11px] font-medium text-text1">{t('pos.cart', { n: itemCount })}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                <ShoppingCart size={28} className="text-border" />
                <p className="font-mono text-[11px] font-medium text-text2">{t('pos.cartEmpty')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.key} className="flex gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 font-body text-[13px] leading-snug text-text1">{productName(item.product)}</p>
                      <p className="mb-2 font-mono text-[11px] font-medium text-text2">{t('pos.size', { size: item.size })}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} aria-label={t('cart.decrease')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-text1">
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span className="w-9 text-center font-mono text-[12px] font-medium text-text1 tnum">{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} aria-label={t('cart.increase')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-text1">
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(item.product.price * item.qty)}</span>
                          <button type="button" onClick={() => removeFromCart(item.key)} aria-label={t('cart.remove')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-red-700">
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t-4 border-border p-4 space-y-3">
            <div className="flex justify-between font-body text-[13px] font-bold">
              <span className="text-text2">{t('pos.total')}</span>
              <span className="text-pink">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full font-mono text-[11px] font-medium text-bg bg-text1 border border-text1 py-3.5 transition-colors hover:bg-text2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('pos.pay')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Lock confirm ── */}
      {showLockConfirm && (
        <div className="fixed inset-0 z-[90] bg-text1/60 flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('pos.lockTitle')}</span>
              <button onClick={() => setShowLockConfirm(false)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text2 mb-5 leading-relaxed">{t('pos.lockSure')}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowLockConfirm(false)}>{t('admin.cancel')}</Button>
                <Button variant="primary" className="flex-1" onClick={confirmLock}>{t('pos.lockYes')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment modal ── */}
      {showPayment && (
        <div className="fixed inset-0 z-[90] bg-text1/70 flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('pos.payment')}</span>
              <button onClick={() => setShowPayment(false)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between font-display text-[12px]">
                <span className="text-text2">{t('pos.totalPay')}</span>
                <span className="text-pink">{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`font-mono text-[11px] font-medium py-3 border transition-colors ${
                      payMethod === m.id ? 'border-text1 text-text1 bg-bg' : 'border-border text-text2 hover:border-text1'
                    }`}
                  >
                    {t(m.key)}
                  </button>
                ))}
              </div>

              {payMethod === 'cash' && (
                <div className="space-y-2">
                  <label className="font-mono text-[11px] font-medium text-text2">{t('pos.cashReceived')}</label>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    placeholder="0"
                    className="w-full bg-bg border border-border text-text1 font-display text-[12px] px-4 py-2.5 focus:border-text1"
                  />
                  {cashGiven && (
                    <div className="flex justify-between font-mono text-[11px] font-medium pt-1">
                      <span className="text-text2">{t('pos.change')}</span>
                      <span className={cashEnough ? 'text-pink' : 'text-red-600'}>
                        {cashEnough ? formatPrice(change) : t('pos.notEnough')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {payMethod !== 'cash' && (
                <p className="font-mono text-[11px] font-medium text-text2 leading-relaxed border border-border p-3">
                  {t('pos.simulate', { method: payMethod === 'qris' ? t('pos.simulateQris') : t('pos.simulateDebit') })}
                </p>
              )}

              <button
                onClick={handleConfirmPayment}
                disabled={!cashEnough}
                className="w-full font-mono text-[11px] font-medium text-bg bg-text1 border border-text1 py-3.5 transition-colors hover:bg-text2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t('pos.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[90] bg-text1/70 flex items-center justify-center p-4">
          <div className="bg-surface border border-text1 w-full max-w-sm text-center" style={{ boxShadow: '0 6px 24px rgba(35,33,27,0.16)' }}>
            {/* Area struk yang di-print */}
            <div className="receipt-print p-6 text-left border-b border-border">
              <div className="text-center mb-4">
                <p className="font-display font-bold text-[16px] text-text1 tracking-[0.08em]">EGAX STUDIOS</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text2 mt-1">Jakarta · {t('pos.receipt')}</p>
                <p className="font-mono text-[11px] text-text2 mt-1">{showSuccess.orderId}</p>
                <p className="font-mono text-[11px] text-text2">{new Date(showSuccess.date || Date.now()).toLocaleString('id-ID')}</p>
              </div>
              <div className="border-t border-dashed border-text1 pt-3 mb-2">
                {(showSuccess.items || []).map((item) => (
                  <div key={item.key} className="flex justify-between gap-3 font-mono text-[11px] text-text1 py-0.5">
                    <span className="truncate">{productName(item.product)} · {item.size} ×{item.qty}</span>
                    <span className="shrink-0">{formatPrice(item.product.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-mono text-[11px] font-semibold text-text1 pt-2 border-t border-text1">
                <span>{t('pos.total')}</span>
                <span>{formatPrice(showSuccess.total)}</span>
              </div>
              {showSuccess.change > 0 && (
                <div className="flex justify-between font-mono text-[11px] text-text2 pt-1">
                  <span>{t('pos.change')}</span>
                  <span>{formatPrice(showSuccess.change)}</span>
                </div>
              )}
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text2">( {t('pos.thanksNote')} )</p>
            </div>
            {/* Aksi */}
            <div className="p-5 grid grid-cols-2 gap-3">
              <button onClick={() => window.print()}
                className="flex items-center justify-center gap-2 font-mono text-[11px] font-medium text-bg bg-text1 border border-text1 py-3 hover:bg-text2 transition-colors">
                <Printer size={13} /> {t('pos.print')}
              </button>
              <button onClick={() => setShowSuccess(null)}
                className="font-mono text-[11px] font-medium text-text1 border border-border py-3 hover:border-text1 transition-colors">
                {t('pos.newTransaction')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
