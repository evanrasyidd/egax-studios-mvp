'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useStaffStore } from '@/store/staffStore'
import { deriveSessionToken } from '@/lib/staffCrypto'

export const usePosStore = create(
  persist(
    (set, get) => ({
      // ── Session ──
      isUnlocked: false,
      cashierName: '',
      cashierId: null,
      sessionToken: null,

      /**
       * Kasir cukup masukkan PIN -- sistem cari nama dari PIN yang cocok
       * di staffStore (role 'kasir', aktif). PIN sudah divalidasi unik
       * antar kasir aktif saat dibuat di staffStore.addStaff/updateStaff,
       * jadi pencarian ini tidak akan ambigu.
       *
       * sessionToken di-derive dari hash PIN kasir yang login -- lihat
       * adminAuthStore.js untuk alasan lengkap kenapa ini lebih aman
       * dari sekadar boolean isUnlocked yang bisa di-edit manual di
       * localStorage/DevTools.
       */
      unlock: async (pin) => {
        const match = await useStaffStore.getState().findKasirByPin(pin)
        if (!match) return { success: false, error: 'PIN tidak terdaftar atau kasir tidak aktif.' }
        const sessionToken = await deriveSessionToken(match.id, match.pinHash)
        set({ isUnlocked: true, cashierName: match.name, cashierId: match.id, sessionToken })
        return { success: true, name: match.name }
      },
      lock: () => set({ isUnlocked: false, cashierName: '', cashierId: null, sessionToken: null }),

      // ── Cart kasir (terpisah dari cart customer di cartStore) ──
      cart: [],

      addToCart: (product, size) => {
        const key = `${product.id}-${size || 'default'}`
        const existing = get().cart.find((i) => i.key === key)
        if (existing) {
          set({
            cart: get().cart.map((i) => i.key === key ? { ...i, qty: i.qty + 1 } : i)
          })
        } else {
          set({ cart: [...get().cart, { key, product, size: size || '-', qty: 1 }] })
        }
      },

      updateQty: (key, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((i) => i.key !== key) })
          return
        }
        set({ cart: get().cart.map((i) => i.key === key ? { ...i, qty } : i) })
      },

      removeFromCart: (key) => {
        set({ cart: get().cart.filter((i) => i.key !== key) })
      },

      clearCart: () => set({ cart: [] }),

      getTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      getItemCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),

      /**
       * Re-verifikasi sesi kasir terhadap staffStore saat ini: kasir
       * masih ada+aktif DAN sessionToken masih cocok dengan hash PIN
       * kasir itu sekarang. Dipanggil periodik dari useStaffSessionGuard
       * untuk auto-logout kalau staff dihapus/dinonaktifkan/PIN-nya
       * diganti dari panel admin, ATAU kalau sessionToken dipalsukan
       * manual tanpa tahu hash aslinya.
       * @returns {Promise<boolean>}
       */
      verifySession: async () => {
        const { isUnlocked, cashierId, sessionToken } = get()
        if (!isUnlocked || !cashierId || !sessionToken) return false
        if (!useStaffStore.getState().isStaffActive(cashierId)) return false
        const credentialHash = useStaffStore.getState().getCredentialHash(cashierId)
        const expectedToken = await deriveSessionToken(cashierId, credentialHash)
        return expectedToken === sessionToken
      },
    }),
    { name: 'egax-pos', skipHydration: true }
  )
)
