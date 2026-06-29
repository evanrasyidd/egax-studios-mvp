'use client'
import { useHydrated } from '@/hooks/useHydrated'

/**
 * Dipasang sekali di root layout. Tugasnya cuma satu: memicu
 * `useHydrated()` lebih awal supaya semua persisted store (cart, wishlist,
 * auth, admin, orders) selesai rehydrate dari localStorage sebelum
 * komponen lain (Navbar, ProductCard, dll) butuh datanya.
 *
 * Tidak merender apa pun sendiri -- cukup `{children}` pass-through.
 */
export default function StoreHydration({ children }) {
  useHydrated()
  return children
}
