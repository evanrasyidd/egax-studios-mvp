'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Registri customer terpusat — akun yang register lewat /account masuk ke
// sini, bukan cuma diturunkan dari order (admin/users sekarang baca sini).
export const useUsersStore = create(
  persist(
    (set, get) => ({
      users: [],

      addUser: (user) => {
        const exists = get().users.some((u) => u.email === user.email)
        if (exists) return
        set({
          users: [
            ...get().users,
            {
              id: user.id || `user-${Date.now()}`,
              name: user.name || '',
              email: user.email,
              role: user.role || 'customer',
              joined: new Date().toISOString(),
              banned: false,
            },
          ],
        })
      },

      removeUser: (email) => {
        set({ users: get().users.filter((u) => u.email !== email) })
      },

      toggleBan: (email) => {
        set({ users: get().users.map((u) => (u.email === email ? { ...u, banned: !u.banned } : u)) })
      },

      isBanned: (email) => get().users.find((u) => u.email === email)?.banned || false,
    }),
    { name: 'egax-users', skipHydration: true }
  )
)
