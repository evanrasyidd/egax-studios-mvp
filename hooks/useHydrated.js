'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { usePosStore } from '@/store/posStore'
import { useStaffStore } from '@/store/staffStore'
import { useAdminAuthStore } from '@/store/adminAuthStore'

/**
 * Semua store di atas dipersist ke localStorage dengan `skipHydration: true`
 * (lihat masing-masing file store) — artinya Zustand SENGAJA tidak auto-baca
 * localStorage saat store dibuat. Kalau tidak di-skip, render server (selalu
 * kosong) vs render client pertama (langsung terisi dari localStorage) bisa
 * beda -> React hydration mismatch warning/error, dan di beberapa kasus
 * trigger render dobel yang kerasa sebagai lag.
 *
 * Fix-nya: rehydrate semua store secara MANUAL, sekali, di client, setelah
 * mount pertama selesai (dalam useEffect). Sampai proses ini selesai,
 * `hydrated` tetap false supaya komponen lain bisa nunda render nilai yang
 * depend ke store ini (badge cart, wishlist heart, dll) dan render fallback
 * netral dulu (0 / skeleton) -> hasil akhirnya: server & client render
 * pertama identik, tidak ada mismatch.
 *
 * Pola pakai di komponen:
 *   const hydrated = useHydrated()
 *   const totalItems = useCartStore(s => s.getTotalItems())
 *   return <span>{hydrated ? totalItems : 0}</span>
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      // Rehydrate semua persisted store sekali saat root mount.
      // idempotent kalau dipanggil lebih dari sekali (mis. dipakai di banyak komponen).
      useCartStore.persist.rehydrate()
      useWishlistStore.persist.rehydrate()
      useAuthStore.persist.rehydrate()
      useAdminStore.persist.rehydrate()
      useOrderStore.persist.rehydrate()
      usePosStore.persist.rehydrate()
      useStaffStore.persist.rehydrate()
      useAdminAuthStore.persist.rehydrate()

      // staffStore butuh satu langkah tambahan setelah rehydrate: hash
      // seed default (admin/kasir) belum tentu sudah ada (localStorage
      // kosong di kunjungan pertama) atau perlu di-generate. Ini async
      // (Web Crypto), jadi tunggu sampai selesai sebelum tandai hydrated,
      // supaya login form tidak bisa dipakai sebelum hash seed siap.
      await useStaffStore.getState().ensureSeedHashed()

      if (!cancelled) setHydrated(true)
    }

    run()
    return () => { cancelled = true }
  }, [])

  return hydrated
}
