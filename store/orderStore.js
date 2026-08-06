'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAdminStore } from '@/store/adminStore'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        // Kurangi stok produk sesuai item order (shop + POS jalan lewat sini)
        if (order.items?.length) {
          useAdminStore.getState().deductStock(order.items)
        }
        set({ orders: [order, ...get().orders] })
      },

      updateOrderStatus: (id, status) => {
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) })
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'egax-orders', skipHydration: true }
  )
)
