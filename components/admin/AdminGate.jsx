'use client'
import { useCallback, useState } from 'react'
import { LogIn } from 'lucide-react'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useStaffStore } from '@/store/staffStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useStaffSessionGuard } from '@/hooks/useStaffSessionGuard'
import { toast } from '@/components/ui/Toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AdminLoginForm() {
  const { login } = useAdminAuthStore()
  const { findAdminByCredentials } = useStaffStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }
    setLoading(true)
    const match = await findAdminByCredentials(username, password)
    if (!match) {
      setError('Username atau password salah, atau akun tidak aktif.')
      setLoading(false)
      return
    }
    await login(match.id)
    toast(`Selamat datang, ${match.name}!`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-pixel text-[8px] text-pink mb-2">★ EGAX STUDIOS ★</p>
          <h1 className="font-pixel text-[18px] text-text1">ADMIN.LOGIN</h1>
          <p className="font-pixel text-[7px] text-text2 mt-2">MASUKKAN KREDENSIAL ADMIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-pixel text-[7px] text-text2">USERNAME</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full bg-surface border-2 border-border text-text1 font-pixel text-[9px] px-4 py-3 outline-none focus:border-pink"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-pixel text-[7px] text-text2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-surface border-2 border-border text-text1 font-pixel text-[9px] px-4 py-3 outline-none focus:border-pink"
            />
          </div>

          {error && <p className="font-pixel text-[7px] text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-pixel text-[10px] text-black py-3.5 transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}
          >
            <LogIn size={13} /> {loading ? 'MEMVERIFIKASI...' : 'MASUK >>'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminGate({ children }) {
  const hydrated = useHydrated()
  const { isLoggedIn, logout, verifySession } = useAdminAuthStore()

  const handleInvalidSession = useCallback(() => {
    toast('Akun kamu sudah tidak aktif. Silakan login ulang.', 'error')
  }, [])

  useStaffSessionGuard({ hydrated, isLoggedIn, verifySession, logout, onInvalid: handleInvalidSession })

  // Sebelum hydrated, adminAuthStore belum kebaca dari localStorage --
  // tunda render daripada nampilin login form sekilas ke admin yang
  // sesinya masih aktif (skipHydration di adminAuthStore).
  if (!hydrated) return null

  if (!isLoggedIn) return <AdminLoginForm />

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
