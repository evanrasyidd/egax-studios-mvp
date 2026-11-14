'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Menu, X, ChevronDown, ShoppingCart, GitCompareArrows } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { useCompareStore } from '@/store/compareStore'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/constants/categories'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false)
  const pathname = usePathname()
  const hydrated = useHydrated()
  const { t, locale, setLocale } = useI18n()
  const { openCart, openSearch, isMenuOpen, closeMenu, toggleMenu } = useUIStore()
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const compareCount = useCompareStore((s) => s.ids.length)
  const { products } = useAdminStore()
  const totalItems = hydrated ? getTotalItems() : 0

  const progressRef = useRef(null)
  const megaRef = useRef(null)
  const mobileRef = useRef(null)

  useFocusTrap(isMenuOpen, mobileRef, closeMenu)

  useEffect(() => {
    closeMenu()
    setMegaOpen(false)
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMegaOpen(false) }
    const onClick = (e) => { if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [megaOpen])

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
    { label: t('nav.policies'), href: '/policies' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  const categories = CATEGORIES
    .filter((c) => c.slug !== 'all')
    .map((c) => ({ ...c, count: products.filter((p) => p.category.toLowerCase() === c.slug).length }))

  return (
    <>
      <nav className="sticky top-8 z-[65] flex h-16 items-center justify-between border-b border-border bg-bg px-4 md:px-10">
        <div ref={progressRef} aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-text1" />

        <Link href="/" className="shrink-0">
          <span className="font-display text-[17px] font-bold tracking-[0.02em] text-text1 transition-colors hover:text-text2 md:text-[19px]">
            EGAX STUDIOS
          </span>
        </Link>

        <div className="hidden items-center lg:flex">
          {navLinks.map((link) =>
            link.hasMega ? (
              <div
                key={link.href}
                ref={megaRef}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    className={cn(
                      'nav-underline py-2 pl-3 pr-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors',
                      pathname.startsWith('/catalog') ? 'text-text1 active' : 'text-text2 hover:text-text1'
                    )}
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMegaOpen((v) => !v)}
                    aria-expanded={megaOpen}
                    aria-controls="catalog-menu"
                    aria-label={t('nav.categories')}
                    className="flex h-11 w-8 items-center justify-center text-text2 transition-colors hover:text-text1"
                  >
                    <ChevronDown size={13} aria-hidden="true" className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                  </button>
                </div>

                {megaOpen && (
                  <div id="catalog-menu" className="anim-mega absolute left-0 top-full z-50 min-w-[250px] border border-text1 bg-surface">
                    <div className="flex items-center justify-between border-b border-border px-5 py-2.5">
                      <span className="arch-label text-text2">{t('nav.categories')}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{String(categories.length).padStart(2, '0')}</span>
                    </div>
                    <Link
                      href="/catalog"
                      className="block border-b border-text1 bg-bg px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-text1 hover:bg-text1 hover:text-bg"
                    >
                      {t('nav.allProducts')}
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/catalog?category=${cat.slug}`}
                        className="flex items-center justify-between border-b border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text2 transition-colors last:border-0 hover:bg-text1 hover:text-bg"
                      >
                        <span>{t(`cat.${cat.slug}`)}</span>
                        <span className="tnum text-[11px] opacity-70">{String(cat.count).padStart(2, '0')}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-underline px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors',
                  pathname === link.href ? 'text-text1 active' : 'text-text2 hover:text-text1'
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <div className="mr-1 hidden items-center border border-border lg:flex" role="group" aria-label={t('nav.language')}>
            {['en', 'id'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={cn(
                  'h-11 px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors',
                  locale === l ? 'bg-text1 text-bg' : 'text-text2 hover:text-text1'
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <button type="button" onClick={openSearch} className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1" aria-label={t('nav.search')}>
            <Search size={17} aria-hidden="true" />
          </button>
          <Link href="/account" className="hidden h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1 lg:flex" aria-label={t('nav.account')}>
            <User size={17} aria-hidden="true" />
          </Link>
          <Link href="/compare" className="relative hidden h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1 lg:flex" aria-label={t('nav.compare')}>
            <GitCompareArrows size={17} aria-hidden="true" />
            {hydrated && compareCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-text1 px-1 text-[11px] font-bold text-bg tnum">
                {compareCount}
              </span>
            )}
          </Link>
          <button type="button" onClick={openCart} className="relative flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1" aria-label={t('nav.cart')}>
            <ShoppingCart size={17} aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-text1 px-1 text-[11px] font-bold text-bg tnum">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button type="button" onClick={toggleMenu} className="flex h-11 w-11 items-center justify-center text-text2 transition-colors hover:text-text1 lg:hidden" aria-label={t('nav.menu')}>
            {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div ref={mobileRef} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" className="fixed inset-0 z-[90] flex flex-col bg-bg">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span id="mobile-menu-title" className="font-display text-[17px] font-bold tracking-[0.02em] text-text1">EGAX STUDIOS</span>
            <button type="button" onClick={closeMenu} aria-label={t('nav.close')} className="flex h-11 w-11 items-center justify-center text-text2 hover:text-text1">
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-baseline justify-between border-b border-border py-3.5"
                >
                  <span className="font-display text-[32px] font-bold leading-none tracking-[-0.02em] text-text1">{link.label}</span>
                  <span className="font-mono text-[11px] text-text2 tnum">{String(i + 1).padStart(2, '0')}</span>
                </Link>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2">
              <Link href="/account" onClick={closeMenu} className="border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-text1">
                {t('nav.account')}
              </Link>
              <Link href="/compare" onClick={closeMenu} className="border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-text1">
                {t('nav.compare')}
              </Link>
              <button
                type="button"
                onClick={() => { closeMenu(); openSearch() }}
                className="border border-border px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-text1"
              >
                {t('nav.search')}
              </button>
              <button
                type="button"
                onClick={() => { closeMenu(); openCart() }}
                className="border border-border px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-text1"
              >
                {t('nav.cart')}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <p className="max-w-[200px] text-[12px] leading-relaxed text-text2">{t('nav.tagline')}</p>
              <div className="flex items-center border border-border" role="group" aria-label={t('nav.language')}>
                {['en', 'id'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    aria-pressed={locale === l}
                    className={cn(
                      'h-11 min-w-[44px] px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors',
                      locale === l ? 'bg-text1 text-bg' : 'text-text2'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
