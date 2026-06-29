'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'

const LINKS = [
  { href:'/account', label:'Account', icon:User },
  { href:'/account/orders', label:'Orders', icon:Package },
  { href:'/account/wishlist', label:'Wishlist', icon:Heart },
  { href:'/account/addresses', label:'Addresses', icon:MapPin },
  { href:'/account/settings', label:'Settings', icon:Settings },
]

export default function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const hydrated = useHydrated()
  const { user, logout } = useAuthStore()
  const displayUser = hydrated ? user : null
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <aside className="w-full md:w-56 shrink-0">
        <div className="mb-5 pb-4 border-b border-gray-200">
          <p className="font-semibold text-bg text-[15px]">{displayUser?.name || 'Guest'}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">{displayUser?.email}</p>
          {displayUser?.role === 'admin' && (
            <Link href="/admin" className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-widest border border-pink text-pink px-2 py-0.5 hover:bg-pink hover:text-black transition-colors">
              Admin Panel →
            </Link>
          )}
        </div>
        <nav className="flex flex-col gap-0.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all rounded-none',
                pathname === href ? 'bg-bg text-white' : 'text-gray-500 hover:text-bg hover:bg-gray-50')}>
              <Icon size={14}/>{label}
              {pathname === href && <ChevronRight size={12} className="ml-auto"/>}
            </Link>
          ))}
          <button onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-400 hover:text-red-500 transition-colors mt-2">
            <LogOut size={14}/> Logout
          </button>
        </nav>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-bg text-[15px]">Confirm Logout</h3>
              <button onClick={() => setShowLogoutConfirm(false)} className="text-gray-400 hover:text-bg"><X size={16}/></button>
            </div>
            <p className="text-[13px] text-gray-500 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="flex-1 bg-bg text-white text-[12px] font-semibold uppercase tracking-widest py-2.5 hover:bg-pink transition-colors">
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 border border-gray-200 text-bg text-[12px] font-semibold uppercase tracking-widest py-2.5 hover:border-bg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
