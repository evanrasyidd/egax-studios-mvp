'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS } from '@/constants/products'

export const useAdminStore = create(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      bannedUsers: [],
      heroPreOrderBadge: true,

      toggleHeroPreOrderBadge: () => set({ heroPreOrderBadge: !get().heroPreOrderBadge }),

      // PRODUCTS CRUD
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: `p${Date.now()}`,
          slug: product.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim(),
          images: ['/placeholder.jpg'],
          vendor: 'EGAX STUDIOS',
        }
        set({ products: [...get().products, newProduct] })
        return newProduct
      },

      updateProduct: (id, data) => {
        set({ products: get().products.map((p) => p.id === id ? { ...p, ...data } : p) })
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) })
      },

      toggleSoldOut: (id) => {
        set({ products: get().products.map((p) => p.id === id ? { ...p, soldOut: !p.soldOut } : p) })
      },

      togglePreOrder: (id) => {
        set({ products: get().products.map((p) => p.id === id ? { ...p, preOrder: !p.preOrder } : p) })
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      // USER BAN
      banUser: (email) => {
        if (!get().bannedUsers.includes(email)) set({ bannedUsers: [...get().bannedUsers, email] })
      },
      unbanUser: (email) => {
        set({ bannedUsers: get().bannedUsers.filter((e) => e !== email) })
      },
      isBanned: (email) => get().bannedUsers.includes(email),
    }),
    { name: 'egax-admin', skipHydration: true }
  )
)
