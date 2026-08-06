'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS } from '@/constants/products'

// Stok default per size kalau produk belum punya field `stock`
const DEFAULT_STOCK = (p) => {
  const stock = {}
  p.sizes.forEach((s) => {
    stock[s] = p.category === 'Pants' ? 10 : p.category === 'Accessories' ? 8 : 12
  })
  return stock
}
const withStock = (list) => list.map((p) => ({ ...p, stock: p.stock || DEFAULT_STOCK(p) }))

export const useAdminStore = create(
  persist(
    (set, get) => ({
      products: withStock(PRODUCTS),
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
          stock: product.stock || DEFAULT_STOCK(product),
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

      // Kurangi stok sesuai item yang dibeli (dipanggil pas order masuk)
      deductStock: (items) => {
        set({
          products: get().products.map((p) => {
            const line = items.find((i) => i.product.id === p.id)
            if (!line) return p
            const stock = { ...(p.stock || {}) }
            const cur = stock[line.size] ?? 0
            stock[line.size] = Math.max(0, cur - line.qty)
            return { ...p, stock }
          }),
        })
      },

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
