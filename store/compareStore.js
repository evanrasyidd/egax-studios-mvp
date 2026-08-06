'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX = 4

export const useCompareStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) => {
        const ids = get().ids
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) })
          return 'removed'
        }
        if (ids.length >= MAX) return 'full'
        set({ ids: [...ids, id] })
        return 'added'
      },

      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'egax-compare', skipHydration: true }
  )
)
