'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Package, ShoppingCart, Users, UserCog, TicketPercent, LogOut, ChevronRight, Store, Menu, X } from 'lucide-react'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const LINKS = [
  { href:'/admin', key:'dashboard', icon:BarChart3 },
  { href:'/admin/products', key:'products', icon:Package },
  { href:'/admin/orders', key:'orders', icon:ShoppingCart },
  { href:'/admin/vouchers', key:'vouchers', icon:TicketPercent },
  { href:'/admin/users', key:'users', icon:Users },
  { href:'/admin/staff', key:'staff', icon:UserCog },
]

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const pathname = usePathname()
  const { logout } = useAdminAuthStore()
  const { t } = useI18n()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    setShowLogout(false)
    router.push('/admin')
  }

  return (
    <>
      {/* ── Mobile top bar: sidebar di layar kecil jadi off-canvas drawer,
          bukan selalu nempel di samping (itu yang bikin konten ke-squeeze
          parah di HP sebelumnya) ── */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-bg border-b border-border">
        <p className="font-display text-[16px] font-bold tracking-[-0.01em] text-text1">{t('admin.brand')}</p>
        <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center text-text1" aria-label={t('admin.openMenu')}>
          <Menu size={20}/>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-text1/50" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        'w-64 lg:w-56 shrink-0 bg-bg border-r border-border min-h-screen flex flex-col fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <p className="font-display text-[20px] font-bold tracking-[-0.01em] text-text1">{t('admin.brand')}</p>
            <p className="arch-label text-pink mt-0.5">{t('admin.controlPanel')}</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-text2" aria-label={t('admin.closeMenu')}>
            <X size={18}/>
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {LINKS.map(({ href, key, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-colors',
              pathname===href ? 'bg-pink text-white' : 'text-text2 hover:text-text1 hover:bg-surface'
            )}>
              <Icon size={14}/>{t(`admin.${key}`)}
              {pathname===href && <ChevronRight size={11} className="ml-auto"/>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link href="/pos" target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-3 px-3 py-3 border border-pink/40 hover:border-pink bg-pink/5 hover:bg-pink/10 transition-colors">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-pink text-white group-hover:rotate-3 transition-transform">
              <Store size={16}/>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-pink leading-none">{t('admin.posKasir')}</p>
              <p className="text-[11px] text-text2 mt-0.5">{t('admin.posDesc')}</p>
            </div>
            <ChevronRight size={13} className="text-pink shrink-0 group-hover:translate-x-0.5 transition-transform"/>
          </Link>
        </div>
        <div className="p-3 border-t border-border">
          <button onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-text2 hover:text-red-600 transition-colors w-full">
            <LogOut size={14}/> {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Logout confirm */}
      {showLogout && (
        <div className="fixed inset-0 z-[95] bg-text1/60 flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('admin.logoutTitle')}</span>
              <button onClick={() => setShowLogout(false)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text2 mb-5 leading-relaxed">{t('admin.logoutSure')}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowLogout(false)}>{t('admin.cancel')}</Button>
                <Button variant="danger" className="flex-1" onClick={handleLogout}>{t('admin.logoutYes')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
