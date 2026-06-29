'use client'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react'
import MiniBarChart from '@/components/admin/MiniBarChart'

export default function AdminPage() {
  const hydrated = useHydrated()
  const { products } = useAdminStore()
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
    { label: 'PRODUCTS', value: products.length, icon: Package, color: '#FF2D9B' },
    { label: 'ORDERS', value: orders.length, icon: ShoppingCart, color: '#4ADE80' },
    { label: 'SOLD OUT', value: soldOutCount, icon: AlertCircle, color: soldOutCount > 0 ? '#F87171' : '#A1A1AA' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="font-pixel text-[8px] text-pink mb-1">★ WELCOME BACK ★</p>
        <h1 className="font-pixel text-[18px] text-text1">DASHBOARD.EXE</h1>
      </div>

      {/* ── Hero stat: revenue + trend chart, bukan kotak generic ── */}
      <div className="bg-surface border-2 border-border p-6" style={{ boxShadow: '5px 5px 0 #FF2D9B' }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={13} className="text-pink" />
              <p className="font-pixel text-[7px] text-text2">TOTAL REVENUE</p>
            </div>
            <p className="font-pixel text-[32px] text-text1 leading-none mb-3">{formatPrice(revenue)}</p>
            {orders.length > 0 && (
              <div className={`inline-flex items-center gap-1 font-pixel text-[7px] px-2 py-1 border ${trendPct >= 0 ? 'border-green-700 text-green-400' : 'border-red-700 text-red-400'}`}>
                <ArrowUpRight size={10} className={trendPct < 0 ? 'rotate-90' : ''} />
                {trendPct >= 0 ? '+' : ''}{trendPct}% VS 7 HARI LALU
              </div>
            )}
          </div>
          <div className="w-full md:w-[280px]">
            <p className="font-pixel text-[6px] text-text2 mb-2">REVENUE 7 HARI TERAKHIR</p>
            <MiniBarChart orders={orders} />
          </div>
        </div>
      </div>

      {/* ── Secondary stats: grid kecil, lebih ringkas dari hero stat ── */}
      <div className="grid grid-cols-3 gap-3">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-surface border-2 border-border p-4 hover:border-pink transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-pixel text-[6px] text-text2">{s.label}</p>
              <s.icon size={12} style={{ color: s.color }} />
            </div>
            <p className="font-pixel text-[18px] text-text1 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <p className="font-pixel text-[9px] text-pink mb-4">★ RECENT ORDERS ★</p>
        {recentOrders.length === 0 ? (
          <p className="font-pixel text-[8px] text-text2 border-2 border-border p-4">NO ORDERS YET.</p>
        ) : (
          <div className="border-2 border-border divide-y-2 divide-border">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors">
                <div>
                  <span className="font-pixel text-[7px] text-text2 block">{o.id}</span>
                  <span className="font-pixel text-[6px] text-text2/60">{formatDateTime(o.date)}</span>
                </div>
                <span className="font-body text-[12px] text-text1">{o.customer?.firstName} {o.customer?.lastName}</span>
                <span className="font-pixel text-[8px] text-pink">{formatPrice(o.total)}</span>
                <span className="font-pixel text-[7px] text-green-400 border border-green-800 px-2 py-0.5">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'PRE ORDER', value: products.filter(p=>p.preOrder).length, color: '#FF2D9B' },
          { label: 'FEATURED', value: products.filter(p=>p.featured).length, color: '#FACC15' },
          { label: 'BEST SELLER', value: products.filter(p=>p.bestSeller).length, color: '#4ADE80' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border-2 border-border p-4 text-center">
            <p className="font-pixel text-[7px] text-text2 mb-2">{s.label}</p>
            <p className="font-pixel text-[24px]" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
