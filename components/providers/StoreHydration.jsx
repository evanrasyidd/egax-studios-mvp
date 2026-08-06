'use client'
import { useEffect } from 'react'
import { ensureHydrated } from '@/hooks/useHydrated'

/**
 * Dipasang sekali di root layout. Tugasnya cuma satu: memicu
 * `ensureHydrated()` lebih awal supaya semua persisted store (cart, wishlist,
 * auth, admin, orders) selesai rehydrate dari localStorage sebelum
 * komponen lain (Navbar, ProductCard, dll) butuh datanya. Pemicu ini
 * sekali jalan saja -- komponen lain yang butuh status hydrated tinggal
 * subscribe via `useHydrated()`.
 *
 * Tidak merender apa pun sendiri -- cukup `{children}` pass-through.
 */
export default function StoreHydration({ children }) {
  useEffect(() => {
    ensureHydrated()
  }, [])

  return children
}
