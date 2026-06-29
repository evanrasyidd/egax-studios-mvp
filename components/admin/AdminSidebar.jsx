'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, UserCog, LogOut, ChevronRight, Store } from 'lucide-react'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { cn } from '@/lib/utils'

const LINKS = [
  { href:'/admin', label:'Dashboard', icon:LayoutDashboard },
  { href:'/admin/products', label:'Products', icon:Package },
  { href:'/admin/orders', label:'Orders', icon:ShoppingCart },
  { href:'/admin/users', label:'Users', icon:Users },
  { href:'/admin/staff', label:'Staff', icon:UserCog },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAdminAuthStore()
  const router = useRouter()
  return (
    <aside className="w-56 shrink-0 bg-bg border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <p className="font-display text-[20px] tracking-widest text-text1">EGAX ADMIN</p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mt-0.5">Control Panel</p>
      </div>
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            'flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-all',
            pathname===href ? 'bg-pink text-black' : 'text-text2 hover:text-text1 hover:bg-surface'
          )}>
            <Icon size={14}/>{label}
            {pathname===href && <ChevronRight size={11} className="ml-auto"/>}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <Link href="/pos" target="_blank" rel="noopener noreferrer"
          className="group flex items-center gap-3 px-3 py-3 border-2 border-pink/40 hover:border-pink bg-pink/5 hover:bg-pink/10 transition-all">
          <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-pink text-black group-hover:rotate-3 transition-transform">
            <Store size={16}/>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-pink leading-none">POS Kasir</p>
            <p className="text-[9px] text-text2 mt-0.5">Buka terminal kasir</p>
          </div>
          <ChevronRight size={13} className="text-pink shrink-0 group-hover:translate-x-0.5 transition-transform"/>
        </Link>
      </div>
      <div className="p-3 border-t border-border">
        <button onClick={() => { logout(); router.push('/admin') }}
          className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-text2 hover:text-red-400 transition-colors w-full">
          <LogOut size={14}/> Logout
        </button>
      </div>
    </aside>
  )
}
