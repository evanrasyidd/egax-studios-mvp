'use client'
import { useEffect } from 'react'

/**
 * Re-validasi sebuah session (admin di /admin ATAU kasir di /pos) secara
 * periodik lewat `verifySession()` milik store yang bersangkutan
 * (adminAuthStore atau posStore). `verifySession()` mengecek staff masih
 * ada+aktif DAN sessionToken masih cocok dengan hash credential staff
 * saat ini -- jadi sesi otomatis invalid kalau: staff dihapus/dinonaktifkan,
 * password/PIN staff diganti sejak token ini dibuat, atau token dipalsukan
 * manual di localStorage/DevTools tanpa tahu hash aslinya.
 *
 * Karena staffStore dan session store sama-sama persisted ke localStorage,
 * device LAIN yang sedang login sebagai staff yang sama tidak akan
 * langsung tahu kalau akunnya berubah dari device ini -- makanya perlu
 * polling ringan (bukan cuma re-check sekali saat mount).
 *
 * @param {object} opts
 * @param {boolean} opts.hydrated - tunda re-validasi sampai store ke-rehydrate
 * @param {boolean} opts.isLoggedIn - status login saat ini
 * @param {function} opts.verifySession - fungsi async dari store yang relevan, return boolean
 * @param {function} opts.logout - fungsi logout dari session store yang relevan
 * @param {function} opts.onInvalid - dipanggil sekali saat session terdeteksi tidak valid lagi
 */
export function useStaffSessionGuard({ hydrated, isLoggedIn, verifySession, logout, onInvalid }) {
  useEffect(() => {
    if (!hydrated || !isLoggedIn) return

    let cancelled = false
    const check = async () => {
      const valid = await verifySession()
      if (!cancelled && !valid) {
        logout()
        onInvalid?.()
      }
    }

    check() // re-check langsung saat mount/dependency berubah
    const interval = setInterval(check, 4000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [hydrated, isLoggedIn, verifySession, logout, onInvalid])
}
