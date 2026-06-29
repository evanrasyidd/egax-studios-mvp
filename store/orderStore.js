'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] })
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'egax-orders', skipHydration: true }
  )
)
