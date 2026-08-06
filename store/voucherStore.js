'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SEED_VOUCHERS = [
  { id: 'v001', code: 'EGAX10', type: 'percent', value: 10, minSpend: 300000, active: true },
  { id: 'v002', code: 'FLAT50', type: 'fixed', value: 50000, minSpend: 250000, active: true },
]

export const useVoucherStore = create(
  persist(
    (set, get) => ({
      vouchers: SEED_VOUCHERS,

      addVoucher: (v) => {
        const voucher = {
          ...v,
          id: `v${Date.now()}`,
          code: (v.code || '').toUpperCase().replace(/\s+/g, ''),
          active: true,
        }
        set({ vouchers: [...get().vouchers, voucher] })
        return voucher
      },

      updateVoucher: (id, data) => {
        set({ vouchers: get().vouchers.map((v) => (v.id === id ? { ...v, ...data } : v)) })
      },

      deleteVoucher: (id) => {
        set({ vouchers: get().vouchers.filter((v) => v.id !== id) })
      },

      toggleVoucher: (id) => {
        set({ vouchers: get().vouchers.map((v) => (v.id === id ? { ...v, active: !v.active } : v)) })
      },

      // Validasi + hitung diskon. Return { ok, discount, voucher } | { ok:false, error }
      applyVoucher: (code, subtotal) => {
        const v = get().vouchers.find((x) => x.code === (code || '').toUpperCase().trim())
        if (!v) return { ok: false, error: 'VOUCHER_NOT_FOUND' }
        if (!v.active) return { ok: false, error: 'VOUCHER_INACTIVE' }
        if (subtotal < v.minSpend) return { ok: false, error: 'VOUCHER_MIN_SPEND' }
        const discount = v.type === 'percent' ? Math.round((subtotal * v.value) / 100) : Math.min(v.value, subtotal)
        return { ok: true, discount, voucher: v }
      },
    }),
    { name: 'egax-vouchers', skipHydration: true }
  )
)
