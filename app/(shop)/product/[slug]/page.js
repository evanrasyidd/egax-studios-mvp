'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { Heart, ArrowLeft, GitCompareArrows } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useCompareStore } from '@/store/compareStore'
import { useRecentStore } from '@/store/recentStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
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

export default function ProductPage({ params }) {
  const { slug } = use(params)
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
  const wishlisted = hydrated && product ? isWishlisted(product.id) : false
  const pidx = product ? parseInt(product.id.replace('p','')) || 0 : 0

  // Tunggu store ke-rehydrate dulu sebelum nge-judge produk "not found" --
  // adminStore (sumber data produk) baru terisi penuh setelah rehydrate,
  // jadi notFound() di render pertama (sebelum hydrated) bisa keliru.
  if (hydrated && !product) notFound()
  if (!product) return null

  const handleAddToCart = () => {
    if (!size) { toast(t('product.selectSize'), 'error'); return }
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
    <div className="bg-surface min-h-screen">
      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* Back navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handleBack}
            className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text2 hover:text-text1 px-3 py-2 transition-all"
            aria-label={t('product.back')}>
            <ArrowLeft size={12} /> {t('product.back')}
          </button>
          <nav className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-text2 hidden sm:block" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-pink transition-colors">{t('product.home')}</Link>
            <span className="mx-2 text-border">/</span>
            <Link href="/catalog" className="hover:text-pink transition-colors">{t('product.catalog')}</Link>
            <span className="mx-2 text-border">/</span>
            <span className="text-text1">{productName(product)}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery name={productName(product)} category={product.category} productIndex={pidx} />

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="arch-label text-pink">{product.vendor}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text2">Nº {serialOf(productName(product))}</p>
              </div>
              <h1 className="font-display text-[34px] font-bold tracking-[-0.01em] text-text1 leading-none mb-3">{productName(product)}</h1>
              <div className="flex items-center gap-3">
                {product.originalPrice && <span className="text-[14px] line-through text-text2/60">{formatPrice(product.originalPrice)}</span>}
                <span className={`font-mono text-[20px] font-semibold ${product.originalPrice ? 'text-pink' : 'text-text1'}`}>{formatPrice(product.price)}</span>
              </div>
            </div>

            {product.preOrder && (
              <div className="bg-text1 text-bg arch-label border-l-2 border-pink px-4 py-3 flex items-center gap-2">
                <span className="text-pink">●</span> {t('product.preOrderNote')}
              </div>
            )}

            <p className="text-[14px] text-text2 leading-relaxed border-t border-b border-border py-5">
              {productDesc(product)}
            </p>

            <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} soldOut={product.soldOut} product={product} />
            {!product.soldOut && <QuantitySelector qty={qty} onChange={setQty} />}

            <div className="flex gap-3">
              {product.soldOut ? (
                <Button variant="dark" className="flex-1 opacity-50 cursor-not-allowed" disabled>{t('product.soldOut')}</Button>
              ) : (
                <Button variant="primary" className="flex-1" onClick={handleAddToCart}>{t('product.addToCart')}</Button>
              )}
              <button onClick={() => toggle(product)}
                className={`w-12 h-12 flex items-center justify-center border transition-all ${wishlisted ? 'border-pink bg-pink/10' : 'border-border hover:border-pink'}`}>
                <Heart size={16} className={wishlisted ? 'fill-pink text-pink' : 'text-text2'}/>
              </button>
              <button onClick={() => compareToggle(product.id)}
                className={`w-12 h-12 flex items-center justify-center border transition-all ${isCompared ? 'border-text1 bg-text1 text-bg' : 'border-border text-text2 hover:border-text1 hover:text-text1'}`}
                aria-label={t('product.compare')}>
                <GitCompareArrows size={16}/>
              </button>
            </div>

            <Accordion items={[
              { title: t('product.shipping'), content: t('product.shippingDesc') },
            ]}/>
          </div>
        </div>

        {/* ── SPEC SHEET — kartu kertas ala tag/label garmen ── */}
        <div data-reveal className="mt-16 border border-text1 bg-bg">
          <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
            <span className="arch-label text-bg">{t('product.specSheet')}</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-bg/60">{productName(product)}</span>
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
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-text2">CM</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 arch-label text-text2 font-medium">{t('product.size')}</th>
                    {product.sizes.map((s) => (
                      <th key={s} className="px-3 py-2.5 font-mono text-[10px] font-semibold text-text1">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map(([label, base, offset]) => (
                    <tr key={label} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-2.5 arch-label text-text2 font-medium">{label}</td>
                      {product.sizes.map((s, i) => (
                        <td key={s} className="px-3 py-2.5 font-mono text-[10px] text-text1">{base + offset * i}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-5 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-text2/70 border-t border-border">
              {t('product.sizeGuideNote')}
            </p>
          </div>
        ) : (
          <div data-reveal className="mt-10 border border-text1 bg-bg px-5 py-3 flex items-center justify-between">
            <span className="arch-label text-text1">{t('product.sizeGuide')}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-text2">{t('product.oneSize')}</span>
          </div>
        )}
      </div>
      <CompleteTheFit currentId={product.id} category={product.category}/>

      {/* Recently viewed */}
      {(() => {
        const recent = recentIds.filter((id) => id !== product.id).map((id) => products.find((p) => p.id === id)).filter(Boolean)
        if (recent.length === 0) return null
        return (
          <section className="bg-bg py-12 px-6 md:px-10 border-t border-border">
            <div className="max-w-6xl mx-auto">
              <div data-reveal className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
                <div className="flex items-baseline gap-4">
                  <span className="arch-label text-text2">RV</span>
                  <h2 className="font-display text-[26px] font-bold tracking-[-0.01em] text-text1">{t('product.recentlyViewed')}</h2>
                </div>
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
