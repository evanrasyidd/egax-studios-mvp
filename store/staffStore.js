'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hashCredential, verifyCredential } from '@/lib/staffCrypto'

/**
 * Satu sumber data untuk SEMUA staff internal (bukan customer):
 * - role 'admin'  -> login pakai username + password di /admin
 * - role 'kasir'  -> login pakai PIN saja di /pos (sistem cari nama dari
 *   PIN yang cocok, jadi PIN harus unik di antara kasir aktif)
 *
 * Password/PIN disimpan sebagai HASH+SALT (lihat lib/staffCrypto.js),
 * BUKAN plaintext. Tetap bukan pengganti backend auth sungguhan untuk
 * data sensitif beneran, tapi localStorage tidak lagi membocorkan
 * password/PIN asli kalau dibuka lewat DevTools.
 *
 * Kredensial plaintext asli untuk seed default ada di README. Hash di
 * SEED_STAFF di-generate sekali secara async lewat ensureSeedHashed()
 * (dipanggil dari useHydrated) karena hashing butuh Web Crypto API yang
 * tidak bisa dipanggil sinkron saat module ini pertama dievaluasi.
 */
const DEFAULT_ADMIN_ID = 'staff-admin-default'
const DEFAULT_KASIR_ID = 'staff-kasir-default'

const SEED_CREDENTIALS = {
  [DEFAULT_ADMIN_ID]: 'egax2026',
  [DEFAULT_KASIR_ID]: '482917',
}
// PENTING: SEED_CREDENTIALS di atas cuma dipakai sesaat di dalam
// ensureSeedHashed() untuk men-generate hash, dan TIDAK PERNAH ikut
// disimpan ke `staff` state (lihat ensureSeedHashed -- hasil akhirnya
// hanya { ...s, passwordHash, passwordSalt } / { ...s, pinHash, pinSalt },
// field plaintext tidak ikut). Yang berubah dari versi sebelumnya adalah
// localStorage (yang bisa dibaca siapa saja lewat DevTools tanpa akses
// source code) tidak lagi berisi credential plaintext. Konstanta ini
// sendiri tetap ada di SOURCE CODE -- itu wajar dan sama posisinya
// dengan kredensial demo yang tertulis di README, bukan kebocoran baru.

const SEED_STAFF = [
  {
    id: DEFAULT_ADMIN_ID,
    role: 'admin',
    name: 'Admin EGAX',
    username: 'admin',
    passwordHash: null,
    passwordSalt: null,
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: DEFAULT_KASIR_ID,
    role: 'kasir',
    name: 'Kasir Demo',
    pinHash: null,
    pinSalt: null,
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
]

export const useStaffStore = create(
  persist(
    (set, get) => ({
      staff: SEED_STAFF,
      _seedHashed: false,

      /**
       * Generate hash untuk seed default sekali saat pertama dipakai.
       * Idempotent -- aman dipanggil berkali-kali (no-op setelah hash pertama).
       */
      ensureSeedHashed: async () => {
        if (get()._seedHashed) return
        const current = get().staff
        const needsHashing = current.some(
          (s) => (s.role === 'admin' && !s.passwordHash) || (s.role === 'kasir' && !s.pinHash)
        )
        if (!needsHashing) {
          set({ _seedHashed: true })
          return
        }
        const updated = await Promise.all(
          current.map(async (s) => {
            const plain = SEED_CREDENTIALS[s.id]
            if (!plain) return s
            if (s.role === 'admin' && !s.passwordHash) {
              const { hash, salt } = await hashCredential(plain)
              return { ...s, passwordHash: hash, passwordSalt: salt }
            }
            if (s.role === 'kasir' && !s.pinHash) {
              const { hash, salt } = await hashCredential(plain)
              return { ...s, pinHash: hash, pinSalt: salt }
            }
            return s
          })
        )
        set({ staff: updated, _seedHashed: true })
      },

      /**
       * @param {object} data - { role, name, username?, password?, pin? }
       * @returns {Promise<{success: boolean, error?: string, staff?: object}>}
       */
      addStaff: async (data) => {
        const { role, name } = data
        if (!name?.trim()) return { success: false, error: 'Nama wajib diisi.' }

        if (role === 'admin') {
          const username = data.username?.trim()
          if (!username) return { success: false, error: 'Username wajib diisi.' }
          if (!data.password || data.password.length < 4) return { success: false, error: 'Password minimal 4 karakter.' }
          const dup = get().staff.find((s) => s.role === 'admin' && s.username.toLowerCase() === username.toLowerCase())
          if (dup) return { success: false, error: 'Username sudah dipakai admin lain.' }

          const { hash, salt } = await hashCredential(data.password)
          const newStaff = {
            id: `staff-${Date.now()}`,
            role: 'admin',
            name: name.trim(),
            username,
            passwordHash: hash,
            passwordSalt: salt,
            active: true,
            createdAt: new Date().toISOString(),
          }
          set({ staff: [...get().staff, newStaff] })
          return { success: true, staff: newStaff }
        }

        if (role === 'kasir') {
          const pin = data.pin?.trim()
          if (!pin || !/^\d{4,6}$/.test(pin)) return { success: false, error: 'PIN harus 4-6 digit angka.' }

          // PIN tersimpan sebagai hash (salt beda-beda per staff, jadi
          // hash juga selalu beda meski PIN sama) -- cek duplikat dengan
          // verifikasi PIN baru terhadap hash setiap kasir yang ada,
          // bukan strict-equal hash ke hash.
          const existingKasirs = get().staff.filter((s) => s.role === 'kasir')
          for (const k of existingKasirs) {
            const matches = await verifyCredential(pin, k.pinHash, k.pinSalt)
            if (matches) return { success: false, error: 'PIN sudah dipakai kasir lain. Pilih PIN lain.' }
          }

          const { hash, salt } = await hashCredential(pin)
          const newStaff = {
            id: `staff-${Date.now()}`,
            role: 'kasir',
            name: name.trim(),
            pinHash: hash,
            pinSalt: salt,
            active: true,
            createdAt: new Date().toISOString(),
          }
          set({ staff: [...get().staff, newStaff] })
          return { success: true, staff: newStaff }
        }

        return { success: false, error: 'Role tidak dikenali.' }
      },

      /**
       * @param {string} id
       * @param {object} updates - { name?, username?, password?, pin? } (plaintext, di-hash di sini)
       */
      updateStaff: async (id, updates) => {
        const target = get().staff.find((s) => s.id === id)
        if (!target) return { success: false, error: 'Staff tidak ditemukan.' }

        const patch = {}
        if (updates.name) patch.name = updates.name

        if (target.role === 'admin') {
          if (updates.username) {
            const username = updates.username.trim()
            const dup = get().staff.find((s) => s.id !== id && s.role === 'admin' && s.username.toLowerCase() === username.toLowerCase())
            if (dup) return { success: false, error: 'Username sudah dipakai admin lain.' }
            patch.username = username
          }
          if (updates.password) {
            const { hash, salt } = await hashCredential(updates.password)
            patch.passwordHash = hash
            patch.passwordSalt = salt
          }
        }

        if (target.role === 'kasir' && updates.pin) {
          const pin = updates.pin.trim()
          if (!/^\d{4,6}$/.test(pin)) return { success: false, error: 'PIN harus 4-6 digit angka.' }
          const others = get().staff.filter((s) => s.id !== id && s.role === 'kasir')
          for (const k of others) {
            const matches = await verifyCredential(pin, k.pinHash, k.pinSalt)
            if (matches) return { success: false, error: 'PIN sudah dipakai kasir lain.' }
          }
          const { hash, salt } = await hashCredential(pin)
          patch.pinHash = hash
          patch.pinSalt = salt
        }

        set({ staff: get().staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
        return { success: true }
      },

      /**
       * @param {string} id
       * @param {string} currentUserId - id staff yang sedang login, untuk cegah hapus diri sendiri
       */
      removeStaff: (id, currentUserId) => {
        if (id === currentUserId) return { success: false, error: 'Tidak bisa menghapus akun yang sedang login.' }
        const target = get().staff.find((s) => s.id === id)
        if (!target) return { success: false, error: 'Staff tidak ditemukan.' }

        if (target.role === 'admin') {
          const activeAdmins = get().staff.filter((s) => s.role === 'admin' && s.active)
          if (activeAdmins.length <= 1) return { success: false, error: 'Tidak bisa menghapus satu-satunya admin aktif.' }
        }

        set({ staff: get().staff.filter((s) => s.id !== id) })
        return { success: true }
      },

      /**
       * Nonaktifkan/aktifkan staff tanpa hapus permanen. Staff yang
       * dinonaktifkan otomatis tidak bisa login lagi (divalidasi ulang
       * di adminAuthStore/posStore saat re-check session).
       */
      toggleActive: (id, currentUserId) => {
        if (id === currentUserId) return { success: false, error: 'Tidak bisa menonaktifkan akun yang sedang login.' }
        const target = get().staff.find((s) => s.id === id)
        if (!target) return { success: false, error: 'Staff tidak ditemukan.' }

        if (target.role === 'admin' && target.active) {
          const activeAdmins = get().staff.filter((s) => s.role === 'admin' && s.active)
          if (activeAdmins.length <= 1) return { success: false, error: 'Tidak bisa menonaktifkan satu-satunya admin aktif.' }
        }

        set({ staff: get().staff.map((s) => (s.id === id ? { ...s, active: !s.active } : s)) })
        return { success: true }
      },

      // ── Lookup helpers (async karena verifikasi hash butuh Web Crypto) ──

      /** @returns {Promise<object|null>} */
      findAdminByCredentials: async (username, password) => {
        const candidates = get().staff.filter(
          (s) => s.role === 'admin' && s.active && s.username.toLowerCase() === username.trim().toLowerCase()
        )
        for (const c of candidates) {
          const matches = await verifyCredential(password, c.passwordHash, c.passwordSalt)
          if (matches) return c
        }
        return null
      },

      /** @returns {Promise<object|null>} */
      findKasirByPin: async (pin) => {
        const candidates = get().staff.filter((s) => s.role === 'kasir' && s.active)
        for (const c of candidates) {
          const matches = await verifyCredential(pin.trim(), c.pinHash, c.pinSalt)
          if (matches) return c
        }
        return null
      },

      // Re-validasi: staff dengan id ini masih ada DAN masih aktif?
      isStaffActive: (id) => {
        const s = get().staff.find((st) => st.id === id)
        return !!s && s.active
      },

      // Ambil hash credential staff saat ini -- dipakai untuk derive/verify
      // session token (lihat lib/staffCrypto.js deriveSessionToken).
      getCredentialHash: (id) => {
        const s = get().staff.find((st) => st.id === id)
        if (!s) return null
        return s.role === 'admin' ? s.passwordHash : s.pinHash
      },
    }),
    { name: 'egax-staff', skipHydration: true }
  )
)
