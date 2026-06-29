'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, qty = 1) => {
        const items = get().items
        const key = `${product.id}-${size}`
        const existing = items.find((i) => i.key === key)
        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + qty } : i
            ),
          })
        } else {
          set({ items: [...items, { key, product, size, qty }] })
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) })
      },

      updateQty: (key, qty) => {
        if (qty < 1) return
        set({
          items: get().items.map((i) => (i.key === key ? { ...i, qty } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.qty, 0),

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.qty, 0),
    }),
    { name: 'egax-cart', skipHydration: true }
  )
)
