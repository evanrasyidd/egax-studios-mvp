'use client'
import { useCallback, useState } from 'react'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useStaffStore } from '@/store/staffStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useStaffSessionGuard } from '@/hooks/useStaffSessionGuard'
import { toast } from '@/components/ui/Toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Button from '@/components/ui/Button'
import { FieldInput, FieldLabel } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

function AdminLoginForm() {
  const { t } = useI18n()
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
      setError(t('admin.required'))
      return
    }
    setLoading(true)
    const match = await findAdminByCredentials(username, password)
    if (!match) {
      setError(t('admin.invalidCred'))
      setLoading(false)
      return
    }
    await login(match.id)
    toast(t('admin.welcome', { name: match.name }))
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg grid-paper px-6">
      <div className="w-full max-w-sm">
        <div className="border border-text1 bg-surface mb-8">
          <div className="flex items-center justify-between px-6 py-3 bg-text1">
            <span className="arch-label text-bg">EGAX STUDIOS</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bg/60">ADMIN</span>
          </div>
          <div className="p-6">
            <p className="arch-label text-pink mb-2">{t('admin.loginBadge')}</p>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-text1 mb-1">{t('admin.loginTitle')}</h1>
            <p className="text-[12px] text-text2 mb-6">{t('admin.loginSub')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <FieldLabel>{t('admin.username')}</FieldLabel>
                <FieldInput value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="admin" />
              </div>
              <div>
                <FieldLabel>{t('admin.password')}</FieldLabel>
                <FieldInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
              </div>

              {error && <p className="font-mono text-[11px] text-red-600">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('admin.verifying') : t('admin.loginBtn')}
              </Button>
            </form>
          </div>
        </div>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-text2/60">{t('admin.loginHint')}</p>
      </div>
    </div>
  )
}

export default function AdminGate({ children }) {
  const hydrated = useHydrated()
  const { isLoggedIn, logout, verifySession } = useAdminAuthStore()
  const { t } = useI18n()

  const handleInvalidSession = useCallback(() => {
    toast(t('admin.invalidSession'), 'error')
  }, [t])

  useStaffSessionGuard({ hydrated, isLoggedIn, verifySession, logout, onInvalid: handleInvalidSession })

  // Sebelum hydrated, adminAuthStore belum kebaca dari localStorage --
  // tunda render daripada nampilin login form sekilas ke admin yang
  // sesinya masih aktif (skipHydration di adminAuthStore).
  if (!hydrated) return null

  if (!isLoggedIn) return <AdminLoginForm />

  return (
    <div className="min-h-screen bg-bg lg:flex">
      <AdminSidebar />
      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
