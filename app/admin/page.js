'use client'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react'
import MiniBarChart from '@/components/admin/MiniBarChart'

export default function AdminPage() {
  const hydrated = useHydrated()
  const { products, heroPreOrderBadge, toggleHeroPreOrderBadge } = useAdminStore()
  const { orders: ordersRaw } = useOrderStore()
  const orders = hydrated ? ordersRaw : []
  const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0)

  // Bandingkan revenue 7 hari terakhir vs 7 hari sebelumnya untuk trend
  // indicator -- dihitung dari data order asli, bukan angka karangan.
  const now = Date.now()
  const last7 = orders.filter(o => { const t = new Date(o.date).getTime(); return !isNaN(t) && now - t <= 7 * 86400000 })
  const prev7 = orders.filter(o => { const t = new Date(o.date).getTime(); return !isNaN(t) && now - t > 7 * 86400000 && now - t <= 14 * 86400000 })
  const last7Revenue = last7.reduce((a, o) => a + (o.total || 0), 0)
  const prev7Revenue = prev7.reduce((a, o) => a + (o.total || 0), 0)
  const trendPct = prev7Revenue > 0 ? Math.round(((last7Revenue - prev7Revenue) / prev7Revenue) * 100) : (last7Revenue > 0 ? 100 : 0)

  const soldOutCount = products.filter((p) => p.soldOut).length
  const recentOrders = orders.slice(0, 5)

  const miniStats = [
    { label: 'PRODUCTS', value: products.length, icon: Package, color: '#FF2E7E' },
    { label: 'ORDERS', value: orders.length, icon: ShoppingCart, color: '#4ADE80' },
    { label: 'SOLD OUT', value: soldOutCount, icon: AlertCircle, color: soldOutCount > 0 ? '#F87171' : '#514E48' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-body font-bold text-[8px] text-pink mb-1">★ WELCOME BACK ★</p>
        <h1 className="font-display text-[18px] text-text1">DASHBOARD.EXE</h1>
      </div>

      {/* ── Hero stat: revenue + trend chart, bukan kotak generic ── */}
      <div className="bg-surface border-2 border-border p-6" style={{ boxShadow: '5px 5px 0 #FF2E7E' }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={13} className="text-pink" />
              <p className="font-body font-bold text-[7px] text-text2">TOTAL REVENUE</p>
            </div>
            <p className="font-display text-[32px] text-text1 leading-none mb-3">{formatPrice(revenue)}</p>
            {orders.length > 0 && (
              <div className={`inline-flex items-center gap-1 font-body font-bold text-[7px] px-2 py-1 border ${trendPct >= 0 ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
                <ArrowUpRight size={10} className={trendPct < 0 ? 'rotate-90' : ''} />
                {trendPct >= 0 ? '+' : ''}{trendPct}% VS 7 HARI LALU
              </div>
            )}
          </div>
          <div className="w-full md:w-[280px]">
            <p className="font-body font-bold text-[6px] text-text2 mb-2">REVENUE 7 HARI TERAKHIR</p>
            <MiniBarChart orders={orders} />
          </div>
        </div>
      </div>

      {/* ── Secondary stats: grid kecil, lebih ringkas dari hero stat ── */}
      <div className="grid grid-cols-3 gap-3">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-surface border-2 border-border p-4 hover:border-pink transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body font-bold text-[6px] text-text2">{s.label}</p>
              <s.icon size={12} style={{ color: s.color }} />
            </div>
            <p className="font-display text-[18px] text-text1 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Site settings ── */}
      <div className="bg-surface border-2 border-border p-5">
        <p className="font-body font-bold text-[9px] text-text2 mb-4 uppercase tracking-widest">Site Settings</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body font-semibold text-[13px] text-text1">Badge pre-order di Hero</p>
            <p className="font-body text-[11px] text-text2">Tampilkan badge &quot;X PRE-ORDER OPEN&quot; di hero home. Kalau off, hero selalu tampilin &quot;NEW DROP&quot;.</p>
          </div>
          <button
            onClick={toggleHeroPreOrderBadge}
            role="switch"
            aria-checked={heroPreOrderBadge}
            className={`shrink-0 ml-4 w-12 h-7 rounded-full border-2 border-border relative transition-colors ${heroPreOrderBadge ? 'bg-pink' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border border-border transition-transform ${heroPreOrderBadge ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <p className="font-body font-bold text-[9px] text-pink mb-4">★ RECENT ORDERS ★</p>
        {recentOrders.length === 0 ? (
          <p className="font-body font-bold text-[8px] text-text2 border-2 border-border p-4">NO ORDERS YET.</p>
        ) : (
          <div className="border-2 border-border divide-y-2 divide-border">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors">
                <div>
                  <span className="font-body font-bold text-[7px] text-text2 block">{o.id}</span>
                  <span className="font-body font-bold text-[6px] text-text2/60">{formatDateTime(o.date)}</span>
                </div>
                <span className="font-body text-[12px] text-text1">{o.customer?.firstName} {o.customer?.lastName}</span>
                <span className="font-body font-bold text-[8px] text-pink">{formatPrice(o.total)}</span>
                <span className="font-body font-bold text-[7px] text-green-700 border border-green-600 bg-green-50 px-2 py-0.5">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'PRE ORDER', value: products.filter(p=>p.preOrder).length, color: '#FF2E7E' },
          { label: 'FEATURED', value: products.filter(p=>p.featured).length, color: '#FACC15' },
          { label: 'BEST SELLER', value: products.filter(p=>p.bestSeller).length, color: '#4ADE80' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border-2 border-border p-4 text-center">
            <p className="font-body font-bold text-[7px] text-text2 mb-2">{s.label}</p>
            <p className="font-display text-[24px]" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
