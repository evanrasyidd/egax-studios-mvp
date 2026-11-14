'use client'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react'
import MiniBarChart from '@/components/admin/MiniBarChart'
import { useI18n } from '@/store/i18nStore'
import Switch from '@/components/ui/Switch'

export default function AdminPage() {
  const { t } = useI18n()
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
    { label: t('admin.statProducts'), value: products.length, icon: Package, color: '#111111' },
    { label: t('admin.statOrders'), value: orders.length, icon: ShoppingCart, color: '#4A4844' },
    { label: t('admin.statSoldOut'), value: soldOutCount, icon: AlertCircle, color: soldOutCount > 0 ? '#111111' : '#7A7A7A' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="arch-label text-pink mb-1">{t('admin.welcomeBack')}</p>
        <h1 className="font-display text-[20px] font-bold tracking-[-0.01em] text-text1">{t('admin.dashboardTitle')}</h1>
      </div>

      {/* ── Hero stat: revenue + trend chart, bukan kotak generic ── */}
      <div className="bg-surface border border-text1 p-6 shadow-ink">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={13} className="text-pink" />
              <p className="arch-label text-text2">{t('admin.totalRevenue')}</p>
            </div>
            <p className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1 leading-none mb-3">{formatPrice(revenue)}</p>
            {orders.length > 0 && (
              <div className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-widest px-2 py-1 border ${trendPct >= 0 ? 'border-green-700 text-green-800' : 'border-red-700 text-red-800'}`}>
                <ArrowUpRight size={10} className={trendPct < 0 ? 'rotate-90' : ''} />
                {t('admin.vsLast7', { pct: `${trendPct >= 0 ? '+' : ''}${trendPct}` })}
              </div>
            )}
          </div>
          <div className="w-full md:w-[280px]">
            <p className="arch-label text-text2 mb-2">{t('admin.revenueLast7')}</p>
            <MiniBarChart orders={orders} />
          </div>
        </div>
      </div>

      {/* ── Secondary stats: grid kecil, lebih ringkas dari hero stat ── */}
      <div className="grid grid-cols-3 gap-3">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-surface border border-border p-4 hover:border-pink transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="arch-label text-text2">{s.label}</p>
              <s.icon size={12} style={{ color: s.color }} />
            </div>
            <p className="font-display text-[18px] font-bold text-text1 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Site settings ── */}
      <div className="bg-surface border border-border p-5">
        <p className="arch-label text-text2 mb-4">{t('admin.siteSettings')}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body font-semibold text-[13px] text-text1">{t('admin.heroBadgeTitle')}</p>
            <p className="font-body text-[11px] text-text2">{t('admin.heroBadgeDesc', { n: 'X' })}</p>
          </div>
          <Switch checked={heroPreOrderBadge} onChange={toggleHeroPreOrderBadge} label={t('admin.heroBadgeTitle')} />
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <p className="arch-label text-pink mb-4">{t('admin.recentOrders')}</p>
        {recentOrders.length === 0 ? (
          <p className="arch-label text-text2 border border-border p-4">{t('admin.noOrdersYet')}</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors">
                <div>
                  <span className="arch-label text-text2 block">{o.id}</span>
                  <span className="arch-label text-text2">{formatDateTime(o.date)}</span>
                </div>
                <span className="font-body text-[12px] text-text1">{o.customer?.firstName} {o.customer?.lastName}</span>
                <span className="font-mono text-[11px] font-medium text-pink">{formatPrice(o.total)}</span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-green-800 border border-green-700 bg-green-50 px-2 py-0.5">{t(`status.${o.status}`)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t('admin.statPreOrder'), value: products.filter(p=>p.preOrder).length, color: '#111111' },
          { label: t('admin.statFeatured'), value: products.filter(p=>p.featured).length, color: '#8F8B84' },
          { label: t('admin.statBestSeller'), value: products.filter(p=>p.bestSeller).length, color: '#4A4844' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border p-4 text-center">
            <p className="arch-label text-text2 mb-2">{s.label}</p>
            <p className="font-display text-[24px] font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
