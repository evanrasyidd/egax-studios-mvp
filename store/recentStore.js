'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX = 8

export const useRecentStore = create(
  persist(
    (set, get) => ({
      ids: [],

      // Tambah produk yang baru dilihat (paling baru di depan, max 8)
      addProduct: (id) => {
        const ids = [id, ...get().ids.filter((x) => x !== id)].slice(0, MAX)
        set({ ids })
      },
    }),
    { name: 'egax-recent', skipHydration: true }
  )
)
