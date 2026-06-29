'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      register: (userData) => set({ user: userData, isAuthenticated: true }),

      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'egax-auth', skipHydration: true }
  )
)
