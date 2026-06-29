'use client'
import { useState, useMemo } from 'react'
import { Search, Plus, Minus, Trash2, LogOut, ShoppingCart, X, Check } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { usePosStore } from '@/store/posStore'
import GarmentIcon from '@/components/product/GarmentIcon'
import { formatPrice, generateOrderId } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

const PAY_METHODS = [
  { id: 'cash', label: 'TUNAI' },
  { id: 'qris', label: 'QRIS' },
  { id: 'debit', label: 'DEBIT' },
]

export default function PosTerminal() {
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

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.soldOut) return false
      const matchCat = category === 'all' || p.category === category
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, category, search])

  const total = getTotal()
  const itemCount = getItemCount()
  const change = payMethod === 'cash' ? Math.max(0, (Number(cashGiven) || 0) - total) : 0
  const cashEnough = payMethod !== 'cash' || (Number(cashGiven) || 0) >= total

  const handleCheckout = () => {
    if (cart.length === 0) { toast('Keranjang masih kosong.', 'error'); return }
    setShowPayment(true)
    setCashGiven('')
    setPayMethod('cash')
  }

  const handleConfirmPayment = () => {
    if (!cashEnough) { toast('Uang tunai belum cukup.', 'error'); return }
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
    setShowSuccess({ orderId, total, change })
    clearCart()
    setShowPayment(false)
  }

  const handleLock = () => {
    if (cart.length > 0) {
      toast('Selesaikan atau kosongkan keranjang dulu sebelum keluar.', 'error')
      return
    }
    lock()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border bg-surface shrink-0">
        <div>
          <p className="font-pixel text-[8px] text-pink">★ EGAX STUDIOS ★</p>
          <h1 className="font-pixel text-[12px] text-text1">POS.EXE</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-pixel text-[7px] text-text2">KASIR: <span className="text-text1">{cashierName}</span></p>
          <button
            onClick={handleLock}
            className="flex items-center gap-1.5 font-pixel text-[7px] text-text2 border-2 border-border px-3 py-2 hover:border-red-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={11} /> KELUAR
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Product grid ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b-2 border-border shrink-0 space-y-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="CARI PRODUK..."
                className="w-full bg-bg border-2 border-border text-text1 font-pixel text-[8px] pl-9 pr-3 py-2.5 outline-none focus:border-pink"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 font-pixel text-[7px] px-3 py-2 border-2 transition-colors whitespace-nowrap ${
                    category === c ? 'border-pink text-pink bg-pink/10' : 'border-border text-text2 hover:border-text2'
                  }`}
                >
                  {c === 'all' ? 'SEMUA' : c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <p className="font-pixel text-[8px] text-text2 text-center py-12">PRODUK TIDAK DITEMUKAN.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((p, i) => {
                  const bgColors = ['#4ADE80','#FF2D9B','#FACC15','#60A5FA','#F87171','#A78BFA','#34D399','#FB923C']
                  const bg = bgColors[(parseInt(p.id.replace('p','')) || i) % bgColors.length]
                  return (
                    <button
                      key={p.id}
                      onClick={() => { addToCart(p, p.sizes?.[0]); toast(`${p.name} ditambahkan`) }}
                      className="border-2 border-border hover:border-pink transition-colors text-left group"
                    >
                      <div className="aspect-square flex items-center justify-center" style={{ background: bg }}>
                        <GarmentIcon category={p.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#0A0A0A" scale={5} />
                      </div>
                      <div className="p-2.5 bg-surface">
                        <p className="font-body text-[11px] text-text1 leading-snug mb-1 line-clamp-2">{p.name}</p>
                        <p className="font-pixel text-[8px] text-pink">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Cart panel ── */}
        <div className="w-[360px] border-l-4 border-pink bg-surface flex flex-col shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border">
            <ShoppingCart size={14} className="text-pink" />
            <span className="font-pixel text-[9px] text-text1">KERANJANG ({itemCount})</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                <ShoppingCart size={28} className="text-border" />
                <p className="font-pixel text-[8px] text-text2">KERANJANG KOSONG</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-border">
                {cart.map((item) => (
                  <div key={item.key} className="flex gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[12px] text-text1 leading-snug mb-1">{item.product.name}</p>
                      <p className="font-pixel text-[7px] text-text2 mb-2">SIZE: {item.size}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-border">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink">
                            <Minus size={9} />
                          </button>
                          <span className="w-7 text-center font-pixel text-[8px] text-text1">{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-text2 hover:text-pink">
                            <Plus size={9} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[8px] text-text1">{formatPrice(item.product.price * item.qty)}</span>
                          <button onClick={() => removeFromCart(item.key)} className="text-text2 hover:text-red-400">
                            <Trash2 size={11} />
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
            <div className="flex justify-between font-pixel text-[10px]">
              <span className="text-text2">TOTAL</span>
              <span className="text-pink">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full font-pixel text-[9px] text-black py-3.5 transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}
            >
              BAYAR &gt;&gt;
            </button>
          </div>
        </div>
      </div>

      {/* ── Payment modal ── */}
      {showPayment && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-pink w-full max-w-sm" style={{ boxShadow: '6px 6px 0 #000' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border">
              <span className="font-pixel text-[10px] text-text1">PEMBAYARAN</span>
              <button onClick={() => setShowPayment(false)} className="text-text2 hover:text-pink"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between font-pixel text-[12px]">
                <span className="text-text2">TOTAL BAYAR</span>
                <span className="text-pink">{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`font-pixel text-[7px] py-3 border-2 transition-colors ${
                      payMethod === m.id ? 'border-pink text-pink bg-pink/10' : 'border-border text-text2 hover:border-text2'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {payMethod === 'cash' && (
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-text2">UANG DITERIMA</label>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    placeholder="0"
                    className="w-full bg-bg border-2 border-border text-text1 font-pixel text-[12px] px-4 py-2.5 outline-none focus:border-pink"
                  />
                  {cashGiven && (
                    <div className="flex justify-between font-pixel text-[9px] pt-1">
                      <span className="text-text2">KEMBALIAN</span>
                      <span className={cashEnough ? 'text-pink' : 'text-red-400'}>
                        {cashEnough ? formatPrice(change) : 'KURANG'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {payMethod !== 'cash' && (
                <p className="font-pixel text-[7px] text-text2 leading-relaxed border-2 border-border p-3">
                  ★ SIMULASI {payMethod === 'qris' ? 'QRIS' : 'KARTU DEBIT'} — TIDAK ADA GATEWAY PEMBAYARAN ASLI TERHUBUNG.
                </p>
              )}

              <button
                onClick={handleConfirmPayment}
                disabled={!cashEnough}
                className="w-full font-pixel text-[9px] text-black py-3.5 transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}
              >
                KONFIRMASI &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-pink w-full max-w-sm text-center p-6" style={{ boxShadow: '6px 6px 0 #000' }}>
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-pink rounded-full">
              <Check size={20} className="text-pink" />
            </div>
            <p className="font-pixel text-[10px] text-text1 mb-2">TRANSAKSI BERHASIL</p>
            <p className="font-pixel text-[7px] text-text2 mb-4">{showSuccess.orderId}</p>
            <div className="space-y-1 mb-5 text-left border-2 border-border p-3">
              <div className="flex justify-between font-pixel text-[8px]">
                <span className="text-text2">TOTAL</span>
                <span className="text-text1">{formatPrice(showSuccess.total)}</span>
              </div>
              {showSuccess.change > 0 && (
                <div className="flex justify-between font-pixel text-[8px]">
                  <span className="text-text2">KEMBALIAN</span>
                  <span className="text-pink">{formatPrice(showSuccess.change)}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowSuccess(null)}
              className="w-full font-pixel text-[9px] text-black py-3.5 transition-all hover:brightness-110"
              style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}
            >
              TRANSAKSI BARU &gt;&gt;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
