'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Menu, X, ChevronDown, ShoppingCart, GitCompareArrows } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { useCompareStore } from '@/store/compareStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/constants/categories'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const pathname = usePathname()
  const hydrated = useHydrated()
  const { t, locale, setLocale } = useI18n()
  const { openCart, openSearch, isMenuOpen, closeMenu, toggleMenu } = useUIStore()
  const getTotalItems = useCartStore(s => s.getTotalItems)
  const compareCount = useCompareStore(s => s.ids.length)
  const totalItems = hydrated ? getTotalItems() : 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  const progressRef = useRef(null)

  // Scroll progress — strip hitam tipis di bawah navbar, kayak indeks dokumen
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(progressRef.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          scrub: 0.3,
        },
      })
    })

    return () => mm.revert()
  }, { scope: progressRef })

  const navLinks = [
    { label: t('nav.catalog'), href: '/catalog', hasMega: true },
    { label: t('nav.editorial'), href: '/editorial' },
    { label: t('nav.gallery'), href: '/gallery' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <>
      <nav className={cn(
        'relative sticky top-8 z-[65] flex items-center justify-between px-6 md:px-10 h-[64px] transition-all duration-300 border-b',
        scrolled ? 'bg-bg/95 backdrop-blur-md border-border' : 'bg-bg border-border'
      )}>
        <div ref={progressRef} aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full bg-text1 origin-left scale-x-0" />
        <Link href="/" className="flex items-baseline gap-2.5 shrink-0">
          <span className="font-display text-[19px] font-bold tracking-[0.04em] text-text1 hover:text-pink transition-colors">EGAX STUDIOS</span>
        </Link>

        <div className="hidden lg:flex items-center">
          {navLinks.map(link =>
            link.hasMega ? (
              <div key={link.href} className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}>
                <button className={cn(
                  'nav-underline flex items-center gap-1 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-colors',
                  pathname.startsWith('/catalog') ? 'text-pink active' : 'text-text2 hover:text-text1'
                )}>
                  {link.label}
                  <ChevronDown size={10} className={cn('transition-transform', megaOpen && 'rotate-180')} />
                </button>
                {megaOpen && (
                  <div className="anim-mega absolute top-full left-0 bg-surface border border-text1 shadow-ink-lg min-w-[200px] z-50">
                    <div className="flex items-center justify-between px-5 py-2 border-b border-border">
                      <span className="arch-label text-text2">Categories</span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-text2/60">06</span>
                    </div>
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug}
                        href={cat.slug === 'all' ? '/catalog' : `/catalog?category=${cat.slug}`}
                        className="block px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text2 hover:text-bg hover:bg-text1 border-b border-border last:border-0 transition-colors">
                        {t(`cat.${cat.slug}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={cn(
                  'nav-underline px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-colors',
                  pathname === link.href ? 'text-pink active' : 'text-text2 hover:text-text1'
                )}>
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {/* Language toggle EN/ID */}
          <div className="flex items-center border border-border mr-1.5" role="group" aria-label={t('nav.language')}>
            {['en', 'id'].map(l => (
              <button key={l} onClick={() => setLocale(l)}
                className={cn('px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors',
                  locale === l ? 'bg-text1 text-bg' : 'text-text2 hover:text-text1')}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={openSearch} className="w-9 h-9 flex items-center justify-center text-text2 hover:text-pink transition-all" aria-label={t('nav.search')}>
            <Search size={16} />
          </button>
          <Link href="/account" className="w-9 h-9 flex items-center justify-center text-text2 hover:text-pink transition-all" aria-label={t('nav.account')}>
            <User size={16} />
          </Link>
          <Link href="/compare" className="relative w-9 h-9 flex items-center justify-center text-text2 hover:text-pink transition-all" aria-label={t('nav.compare')}>
            <GitCompareArrows size={16} />
            {hydrated && compareCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-text1 text-bg text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>
          <button onClick={openCart} className="relative w-9 h-9 flex items-center justify-center text-text2 hover:text-pink transition-all" aria-label={t('nav.cart')}>
            <ShoppingCart size={16} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-pink text-bg text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="lg:hidden w-9 h-9 flex items-center justify-center text-text2 hover:text-pink" aria-label="Menu">
            {isMenuOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-bg flex flex-col pt-28 px-8">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="font-display text-[40px] font-bold tracking-tight text-text1 hover:text-pink transition-colors border-b border-border pb-2"
                onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-10 border-t border-border pt-5 flex items-center justify-between">
            <p className="arch-label text-text2">{t('nav.tagline')}</p>
            <div className="flex items-center border border-border" role="group" aria-label={t('nav.language')}>
              {['en', 'id'].map(l => (
                <button key={l} onClick={() => setLocale(l)}
                  className={cn('px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors',
                    locale === l ? 'bg-text1 text-bg' : 'text-text2 hover:text-text1')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
