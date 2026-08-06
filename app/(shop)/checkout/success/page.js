'use client'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import SuccessPage from '@/components/checkout/SuccessPage'

function SuccessContent() {
  const params = useSearchParams()
  const orderId = params.get('orderId')
  const hydrated = useHydrated()
  const { getOrderById } = useOrderStore()

  // Sebelum hydrated, orderStore masih kosong (skipHydration) -- tunda
  // render dulu daripada nampilin fallback total Rp0 sekilas.
  if (!hydrated) return <div className="min-h-screen bg-surface flex items-center justify-center"><p>Loading...</p></div>

  const order = getOrderById(orderId)
  return <SuccessPage order={order || { id: orderId, total: 0 }} />
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><p>Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
