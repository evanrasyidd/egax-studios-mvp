'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'

export default function AccountSidebar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const hydrated = useHydrated()
  const { user, logout } = useAuthStore()
  const displayUser = hydrated ? user : null
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
              className={cn('flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all rounded-none',
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
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text1 text-[15px]">{t('account.confirmLogout')}</h3>
              <button onClick={() => setShowLogoutConfirm(false)} className="text-text2 hover:text-text1"><X size={16}/></button>
            </div>
            <p className="text-[13px] text-text2 mb-6">{t('account.logoutSure')}</p>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="flex-1 bg-text1 text-bg arch-label py-2.5 hover:bg-text2 transition-colors">
                {t('account.yesLogout')}
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 border border-border text-text1 arch-label py-2.5 hover:border-text1 transition-colors">
                {t('account.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
