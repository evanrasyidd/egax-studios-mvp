'use client'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import OrderHistoryList from '@/components/account/OrderHistoryList'
export default function OrdersPage() {
  const hydrated = useHydrated()
  const { orders } = useOrderStore()
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
      <h1 className="font-display text-[32px] tracking-widest text-bg mb-6">My Orders</h1>
      <OrderHistoryList orders={hydrated ? orders : []}/>
    </div>
  )
}
