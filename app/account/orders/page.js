'use client'
import { useOrderStore } from '@/store/orderStore'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import OrderHistoryList from '@/components/account/OrderHistoryList'

export default function OrdersPage() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { orders } = useOrderStore()
  const user = useAuthStore((s) => s.user)

  // Tanpa login: tampilkan semua pesanan di browser ini (localStorage).
  // Sudah login: filter pesanan milik akun yang bersangkutan aja.
  const myOrders = hydrated
    ? (user ? orders.filter((o) => o.customer?.email === user.email) : orders)
    : []

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
          <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1">{t('account.myOrders')}</h1>
        </div>
        {!user && <span className="arch-label text-text2 hidden sm:block">{t('account.guestOrders')}</span>}
      </div>
      <OrderHistoryList orders={myOrders} />
    </div>
  )
}
