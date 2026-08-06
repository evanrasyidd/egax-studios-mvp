'use client'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { usePosStore } from '@/store/posStore'
import { useStaffStore } from '@/store/staffStore'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useI18nStore } from '@/store/i18nStore'

/**
 * Semua store di atas dipersist ke localStorage dengan `skipHydration: true`
 * (lihat masing-masing file store) — artinya Zustand SENGAJA tidak auto-baca
 * localStorage saat store dibuat. Kalau tidak di-skip, render server (selalu
 * kosong) vs render client pertama (langsung terisi dari localStorage) bisa
 * beda -> React hydration mismatch warning/error, dan di beberapa kasus
 * trigger render dobel yang kerasa sebagai lag.
 *
 * Fix-nya: rehydrate semua store secara MANUAL, sekali, di client, setelah
 * mount pertama selesai (dalam useEffect). Proses ini hanya dijalankan SATU
 * KALI (di-provider oleh StoreHydration di root layout); komponen lain yang
 * butuh status hydrated cukup subscribe ke state shared di bawah ini, jadi
 * catalog dengan puluhan ProductCard tidak memicu rehydrate berulang.
 *
 * Pola pakai di komponen:
 *   const hydrated = useHydrated()
 *   const totalItems = useCartStore(s => s.getTotalItems())
 *   return <span>{hydrated ? totalItems : 0}</span>
 */

let hydrationStarted = false
let hydrationDone = false
const listeners = new Set()

async function runHydration() {
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
  useI18nStore.persist.rehydrate()

  // staffStore butuh satu langkah tambahan setelah rehydrate: hash
  // seed default (admin/kasir) belum tentu sudah ada (localStorage
  // kosong di kunjungan pertama) atau perlu di-generate. Ini async
  // (Web Crypto), jadi tunggu sampai selesai sebelum tandai hydrated,
  // supaya login form tidak bisa dipakai sebelum hash seed siap.
  await useStaffStore.getState().ensureSeedHashed()

  hydrationDone = true
  listeners.forEach((fn) => fn(true))
}

/** Pemicu utama, dipanggil sekali dari StoreHydration di root layout. */
export function ensureHydrated() {
  if (!hydrationStarted) {
    hydrationStarted = true
    runHydration()
  }
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(hydrationDone)

  useEffect(() => {
    if (hydrationDone) return
    listeners.add(setHydrated)
    return () => listeners.delete(setHydrated)
  }, [])

  return hydrated
}
