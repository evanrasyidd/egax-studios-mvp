'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deriveSessionToken } from '@/lib/staffCrypto'
import { useStaffStore } from '@/store/staffStore'

/**
 * Session login admin -- terpisah total dari store/authStore.js (itu
 * khusus customer shop, login pakai email). Ini khusus staff internal
 * yang login ke /admin pakai username+password (lihat store/staffStore.js
 * untuk data staff & validasi kredensial).
 *
 * Menyimpan `staffId` DAN `sessionToken` (bukan cuma boolean isLoggedIn).
 * `sessionToken` di-derive dari hash password staff yang bersangkutan
 * (lihat lib/staffCrypto.js deriveSessionToken) -- jadi kalau seseorang
 * mengetik `isLoggedIn: true` langsung di localStorage/DevTools tanpa
 * tahu token yang valid, `verifySession()` akan gagal mencocokkan token
 * tersebut dengan hash staff yang sebenarnya dan otomatis menganggap
 * sesi itu tidak valid. Ini menaikkan effort bypass dari "edit satu
 * baris" menjadi "perlu reverse-engineer derivasi token", yang cukup
 * untuk konteks demo/portfolio tanpa backend asli.
 */
export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      staffId: null,
      sessionToken: null,
      isLoggedIn: false,

      login: async (staffId) => {
        const credentialHash = useStaffStore.getState().getCredentialHash(staffId)
        const sessionToken = await deriveSessionToken(staffId, credentialHash)
        set({ staffId, sessionToken, isLoggedIn: true })
      },
      logout: () => set({ staffId: null, sessionToken: null, isLoggedIn: false }),

      /**
       * Re-verifikasi sesi terhadap staffStore saat ini: staff masih
       * ada+aktif DAN token masih cocok dengan hash credential staff
       * itu sekarang (token otomatis tidak cocok lagi kalau password
       * staff sudah diganti sejak token ini dibuat, atau kalau token
       * dipalsukan tanpa tahu hash aslinya).
       * @returns {Promise<boolean>}
       */
      verifySession: async () => {
        const { staffId, sessionToken, isLoggedIn } = get()
        if (!isLoggedIn || !staffId || !sessionToken) return false
        if (!useStaffStore.getState().isStaffActive(staffId)) return false
        const credentialHash = useStaffStore.getState().getCredentialHash(staffId)
        const expectedToken = await deriveSessionToken(staffId, credentialHash)
        return expectedToken === sessionToken
      },
    }),
    { name: 'egax-admin-auth', skipHydration: true }
  )
)
