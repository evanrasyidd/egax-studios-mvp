'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { Heart, ArrowLeft, GitCompareArrows } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useAdminStore } from '@/store/adminStore'
import { useCompareStore } from '@/store/compareStore'
import { useRecentStore } from '@/store/recentStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'

gsap.registerPlugin(ScrollTrigger, useGSAP)
import ProductGallery from '@/components/product/ProductGallery'
import SizeSelector from '@/components/product/SizeSelector'
import QuantitySelector from '@/components/product/QuantitySelector'
import CompleteTheFit from '@/components/product/CompleteTheFit'
import ProductCard from '@/components/product/ProductCard'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

const serialOf = (name) => String([...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7)).padStart(4, '0')

// Size chart per kategori — nilai cm di-generate dari base + offset per ukuran
function sizeChartData(product) {
  if (product.sizes.length === 1) return null
  if (product.category === 'Pants') {
    return {
      rows: [
        ['Waist', 72, 5],
        ['Hip', 100, 5],
        ['Inseam', 74, 2],
      ],
    }
  }
  return {
    rows: [
      ['Chest width', 54, 3],
      ['Body length', 68, 3],
      ['Shoulder', 46, 2],
    ],
  }
}

export default function ProductDetail({ slug }) {
  const router = useRouter()
  const hydrated = useHydrated()
  const { t, locale, productName, productDesc } = useI18n()
  const { products } = useAdminStore()
  const product = products.find(p => p.slug === slug)

  const handleBack = () => {
    // Balik ke halaman sebelumnya kalau datang dari dalam site,
    // fallback ke catalog kalau dibuka langsung (gak ada history).
    if (window.history.length > 1) router.back()
    else router.push('/catalog')
  }

  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const { addItem } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const compareToggle = useCompareStore(s => s.toggle)
  const isCompared = useCompareStore(s => s.ids.includes(product?.id))
  const recentIds = useRecentStore(s => s.ids)
  const addRecent = useRecentStore(s => s.addProduct)
  const { openCart } = useUIStore()

  // Catat produk yang baru dilihat (recently viewed)
  useEffect(() => {
    if (product) addRecent(product.id)
  }, [product, addRecent])

  // Parallax halus: gallery & info bergerak beda kecepatan pas scroll
  const pdRef = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.pd-gallery', { yPercent: 0 }, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: pdRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.fromTo('.pd-info', { yPercent: 0 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: pdRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
    })
    return () => mm.revert()
  }, { scope: pdRef })
  const wishlisted = hydrated && product ? isWishlisted(product.id) : false

  // Tunggu store ke-rehydrate dulu sebelum nge-judge produk "not found" --
  // adminStore (sumber data produk) baru terisi penuh setelah rehydrate,
  // jadi notFound() di render pertama (sebelum hydrated) bisa keliru.
  if (hydrated && !product) notFound()
  if (!product) return null

  const handleAddToCart = () => {
    if (!size) {
      toast(t('product.selectSize'), 'error')
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const left = product.stock?.[size] ?? 99
    if (qty > left) { toast(t('product.stockNotEnough', { n: left }), 'error'); return }
    addItem(product, size, qty)
    toast(t('product.added', { name: productName(product) }))
    openCart()
  }

  const chart = sizeChartData(product)
  const lang = (id, en) => (locale === 'id' ? id : en)

  const specRows = [
    { k: t('product.fabric'), v: lang(product.fabricId, product.fabric) },
    { k: t('product.fit'), v: lang(product.fitId, product.fit) },
    { k: t('product.care'), v: lang(product.careId, product.care) },
  ]

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        {/* Back navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handleBack}
            className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text2 hover:text-text1 px-3 py-2 transition-colors"
            aria-label={t('product.back')}>
            <ArrowLeft size={12} /> {t('product.back')}
          </button>
          <nav className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text2 hidden sm:block" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-pink transition-colors">{t('product.home')}</Link>
            <span className="mx-2 text-border">/</span>
            <Link href="/catalog" className="hover:text-pink transition-colors">{t('product.catalog')}</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-text1">{productName(product)}</span>
          </nav>
        </div>

        <div ref={pdRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="pd-gallery">
          <ProductGallery product={product} />

          </div>
          <div className="pd-info flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="arch-label text-pink">{product.vendor}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text2">Nº {serialOf(productName(product))}</p>
              </div>
              <h1 className="font-display text-[34px] font-bold tracking-[-0.01em] text-text1 leading-none mb-3">{productName(product)}</h1>
              <div className="flex items-center gap-3">
                {product.originalPrice && <span className="tnum text-[14px] text-text2 line-through">{formatPrice(product.originalPrice)}</span>}
                <span className={`font-mono text-[20px] font-semibold ${product.originalPrice ? 'text-pink' : 'text-text1'}`}>{formatPrice(product.price)}</span>
              </div>
            </div>

            {product.preOrder && (
              <div className="flex items-center gap-2 bg-text1 px-4 py-3 text-bg arch-label">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-bg" /> {t('product.preOrderNote')}
              </div>
            )}

            <p className="text-[14px] text-text2 leading-relaxed border-t border-b border-border py-5">
              {productDesc(product)}
            </p>

            <div id="size-selector">
              <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} soldOut={product.soldOut} product={product} />
            </div>
            {!product.soldOut && <QuantitySelector qty={qty} onChange={setQty} />}

            <div className="flex gap-3">
              {product.soldOut ? (
                <Button variant="dark" className="flex-1 opacity-50 cursor-not-allowed" disabled>{t('product.soldOut')}</Button>
              ) : (
                <Button variant="primary" className="flex-1" onClick={handleAddToCart}>{t('product.addToCart')}</Button>
              )}
              <button
                type="button"
                onClick={() => toggle(product)}
                aria-label={t('product.wishlist')}
                aria-pressed={wishlisted}
                className={`flex h-12 w-12 items-center justify-center border transition-colors ${wishlisted ? 'border-text1 bg-text1 text-bg' : 'border-border hover:border-text1'}`}>
                <Heart size={17} aria-hidden="true" className={wishlisted ? 'fill-bg' : 'text-text2'}/>
              </button>
              <button
                type="button"
                onClick={() => compareToggle(product.id)}
                aria-label={t('product.compare')}
                aria-pressed={isCompared}
                className={`flex h-12 w-12 items-center justify-center border transition-colors ${isCompared ? 'border-text1 bg-text1 text-bg' : 'border-border text-text2 hover:border-text1 hover:text-text1'}`}>
                <GitCompareArrows size={17} aria-hidden="true"/>
              </button>
            </div>

            <Accordion items={[
              { title: t('product.shipping'), content: t('product.shippingDesc') },
            ]}/>
          </div>
        </div>

        {/* ── SPEC SHEET — kartu kertas ala tag/label garmen ── */}
        <div data-reveal className="mt-16 border border-text1 bg-bg">
          <div className="flex items-center justify-between gap-4 bg-text1 px-5 py-2.5">
            <span className="arch-label text-bg">{t('product.specSheet')}</span>
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-bg/70">{productName(product)}</span>
          </div>
          <div className="divide-y divide-border">
            {specRows.map((row) => (
              <div key={row.k} className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr]">
                <div className="px-5 py-3.5 border-r border-border">
                  <span className="arch-label text-text2">{row.k}</span>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-[13px] text-text1 leading-relaxed">{row.v}</p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr]">
              <div className="px-5 py-3.5 border-r border-border">
                <span className="arch-label text-text2">{t('product.details')}</span>
              </div>
              <div className="px-5 py-3.5">
                <ul className="space-y-1.5">
                  {lang(product.detailsId, product.details).map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[13px] text-text1 leading-relaxed">
                      <span className="mt-[7px] w-2 h-px bg-text1 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── SIZE GUIDE ── */}
        {chart ? (
          <div data-reveal className="mt-10 border border-text1 bg-bg">
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-text1">
              <span className="arch-label text-text1">{t('product.sizeGuide')}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">CM</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 arch-label text-text2 font-medium">{t('product.size')}</th>
                    {product.sizes.map((s) => (
                      <th key={s} className="px-3 py-2.5 font-mono text-[11px] font-semibold text-text1">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map(([label, base, offset]) => (
                    <tr key={label} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-2.5 arch-label text-text2 font-medium">{label}</td>
                      {product.sizes.map((s, i) => (
                        <td key={s} className="tnum px-3 py-2.5 font-mono text-[11px] text-text1">{base + offset * i}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border px-5 py-2.5 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-text2">
              {t('product.sizeGuideNote')}
            </p>
          </div>
        ) : (
          <div data-reveal className="mt-10 border border-text1 bg-bg px-5 py-3 flex items-center justify-between">
            <span className="arch-label text-text1">{t('product.sizeGuide')}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text2">{t('product.oneSize')}</span>
          </div>
        )}
      </div>
      <CompleteTheFit currentId={product.id} category={product.category}/>

      {!product.soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-text1 bg-bg px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-text2">{productName(product)}</p>
              <p className="tnum font-mono text-[14px] font-semibold text-text1">{formatPrice(product.price)}</p>
            </div>
            <Button variant="primary" onClick={handleAddToCart} className="shrink-0">
              {t('product.addToCart')}
            </Button>
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {(() => {
        const recent = recentIds.filter((id) => id !== product.id).map((id) => products.find((p) => p.id === id)).filter(Boolean)
        if (recent.length === 0) return null
        return (
          <section className="bg-bg py-12 px-6 md:px-10 border-t border-border">
            <div className="max-w-6xl mx-auto">
              <div data-reveal className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
                <h2 className="font-display text-[26px] font-bold tracking-[-0.01em] text-text1">{t('product.recentlyViewed')}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {recent.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          </section>
        )
      })()}
    </div>
  )
}
