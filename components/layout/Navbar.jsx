'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/constants/categories'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const pathname = usePathname()
  const hydrated = useHydrated()
  const { openCart, openSearch, isMenuOpen, closeMenu, toggleMenu } = useUIStore()
  const getTotalItems = useCartStore(s => s.getTotalItems)
  const totalItems = hydrated ? getTotalItems() : 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog', hasMega: true },
    { label: 'Editorial', href: '/editorial' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <nav className={cn(
        'sticky top-8 z-40 flex items-center justify-between px-6 md:px-10 h-[60px] transition-all duration-300 border-b',
        scrolled ? 'bg-bg/90 backdrop-blur-md border-border' : 'bg-bg border-border'
      )}>
        <Link href="/" className="font-display text-[22px] tracking-[0.08em] text-text1 hover:text-pink transition-colors shrink-0">
          EGAX STUDIOS
        </Link>

        <div className="hidden lg:flex items-center">
          {navLinks.map(link =>
            link.hasMega ? (
              <div key={link.label} className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}>
                <button className={cn(
                  'nav-underline flex items-center gap-1 px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors',
                  pathname.startsWith('/catalog') ? 'text-pink active' : 'text-text2 hover:text-text1'
                )}>
                  {link.label}
                  <ChevronDown size={10} className={cn('transition-transform', megaOpen && 'rotate-180')} />
                </button>
                {megaOpen && (
                  <div className="absolute top-full left-0 bg-bg border border-border min-w-[200px] z-50 shadow-2xl">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug}
                        href={cat.slug === 'all' ? '/catalog' : `/catalog?category=${cat.slug}`}
                        className="block px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-text2 hover:text-black hover:bg-pink border-b border-border last:border-0 transition-colors">
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.label} href={link.href}
                className={cn(
                  'nav-underline px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors',
                  pathname === link.href ? 'text-pink active' : 'text-text2 hover:text-text1'
                )}>
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={openSearch} className="w-9 h-9 flex items-center justify-center text-text2 hover:text-pink border border-transparent hover:border-border transition-all" aria-label="Search">
            <Search size={16} />
          </button>
          <Link href="/account" className="w-9 h-9 flex items-center justify-center text-text2 hover:text-pink border border-transparent hover:border-border transition-all" aria-label="Account">
            <User size={16} />
          </Link>
          <button onClick={openCart} className="relative w-9 h-9 flex items-center justify-center text-text2 hover:text-pink border border-transparent hover:border-border transition-all" aria-label="Cart">
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-pink text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="lg:hidden w-9 h-9 flex items-center justify-center text-text2 hover:text-pink">
            {isMenuOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-bg flex flex-col pt-24 px-8 border-r border-border">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.label} href={link.href}
                className="font-display text-[48px] tracking-wider text-text1 hover:text-pink transition-colors border-b border-border pb-2"
                onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-10 border-t border-border pt-5">
            <p className="text-[11px] uppercase tracking-widest text-text2">Loud on the streets. No volume knob.</p>
          </div>
        </div>
      )}
    </>
  )
}
