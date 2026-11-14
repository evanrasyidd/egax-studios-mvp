'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/lib/utils'

export default function AccountSidebar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const hydrated = useHydrated()
  const { user, logout } = useAuthStore()
  const displayUser = hydrated ? user : null
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const logoutRef = useRef(null)
  useFocusTrap(showLogoutConfirm, logoutRef, () => setShowLogoutConfirm(false))

  const LINKS = [
    { href:'/account', label: t('account.profile'), icon:User },
    { href:'/account/orders', label: t('account.orders'), icon:Package },
    { href:'/account/wishlist', label: t('account.wishlist'), icon:Heart },
    { href:'/account/addresses', label: t('account.addresses'), icon:MapPin },
    { href:'/account/settings', label: t('account.settings'), icon:Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <aside className="w-full md:w-56 shrink-0">
        <div className="mb-5 pb-4 border-b border-border">
          <p className="font-semibold text-text1 text-[15px]">{displayUser?.name || t('account.guest')}</p>
          <p className="text-[12px] text-text2 mt-0.5">{displayUser?.email}</p>
          {displayUser?.role === 'admin' && (
            <Link href="/admin" className="mt-2 inline-block arch-label border border-text1 text-text1 px-2 py-0.5 hover:bg-text1 hover:text-bg transition-colors">
              {t('account.adminPanel')}
            </Link>
          )}
        </div>
        <nav className="flex flex-col gap-0.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors rounded-none',
                pathname === href ? 'bg-text1 text-white' : 'text-text2 hover:text-text1 hover:bg-surface')}>
              <Icon size={14}/>{label}
              {pathname === href && <ChevronRight size={12} className="ml-auto"/>}
            </Link>
          ))}
          <button onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-text2 hover:text-red-500 transition-colors mt-2">
            <LogOut size={14}/> {t('account.logout')}
          </button>
        </nav>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-text1/60 p-4">
          <div ref={logoutRef} role="dialog" aria-modal="true" aria-labelledby="logout-title" className="w-full max-w-sm border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="logout-title" className="text-[15px] font-semibold text-text1">{t('account.confirmLogout')}</h3>
              <button type="button" onClick={() => setShowLogoutConfirm(false)} aria-label={t('nav.close')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-text1"><X size={16} aria-hidden="true"/></button>
            </div>
            <p className="mb-6 text-[13px] text-text2">{t('account.logoutSure')}</p>
            <div className="flex gap-3">
              <button type="button" onClick={handleLogout} className="min-h-11 flex-1 bg-text1 py-2.5 text-bg font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:bg-text2">
                {t('account.yesLogout')}
              </button>
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="min-h-11 flex-1 border border-border py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text1 transition-colors hover:border-text1">
                {t('account.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
