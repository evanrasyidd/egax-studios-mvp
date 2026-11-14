'use client'
import Link from 'next/link'
import { GitCompareArrows, X } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useCompareStore } from '@/store/compareStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'
import GarmentPlate from '@/components/product/GarmentPlate'
import Button from '@/components/ui/Button'

export default function ComparePage() {
  const { t, locale, productName } = useI18n()
  const hydrated = useHydrated()
  const { ids, remove, clear } = useCompareStore()
  const { products } = useAdminStore()
  const items = hydrated ? ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) : []
  const lang = (id, en) => (locale === 'id' ? id : en)

  if (items.length === 0) {
    return (
      <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
        <div className="max-w-xl">
          <p className="arch-label text-pink mb-4">{t('compare.label')}</p>
          <h1 className="font-display text-[34px] font-bold tracking-[-0.01em] text-text1 mb-4">{t('compare.title')}</h1>
          <div className="border border-border bg-surface px-6 py-12 text-center">
            <GitCompareArrows size={32} className="text-border mx-auto mb-3" />
            <p className="text-[13px] text-text2 mb-4">{t('compare.empty')}</p>
            <Button variant="outline" href="/catalog">{t('compare.browse')}</Button>
          </div>
        </div>
      </div>
    )
  }

  const rows = [
    { k: t('compare.price'), render: (p) => <span className="font-mono text-[12px] font-semibold">{formatPrice(p.price)}</span> },
    { k: t('compare.category'), render: (p) => <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text2">{t(`cat.${p.category.toLowerCase()}`)}</span> },
    { k: t('product.fabric'), render: (p) => <span className="text-[12px] text-text1 leading-relaxed">{lang(p.fabricId, p.fabric)}</span> },
    { k: t('product.fit'), render: (p) => <span className="text-[12px] text-text1 leading-relaxed">{lang(p.fitId, p.fit)}</span> },
    { k: t('product.care'), render: (p) => <span className="text-[12px] text-text1 leading-relaxed">{lang(p.careId, p.care)}</span> },
    {
      k: t('product.details'),
      render: (p) => (
        <ul className="space-y-1">
          {lang(p.detailsId, p.details).map((d) => (
            <li key={d} className="flex items-start gap-2 text-[12px] text-text1 leading-relaxed">
              <span className="mt-[7px] w-2 h-px bg-text1 shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="arch-label text-pink">{t('compare.label')}</span>
            <h1 className="font-display text-[34px] font-bold tracking-[-0.01em] text-text1">{t('compare.title')}</h1>
          </div>
          <button onClick={clear} className="arch-label text-text2 hover:text-red-600 transition-colors">{t('compare.clear')}</button>
        </div>

        <div tabIndex={0} role="region" aria-label={t('compare.title')} className="overflow-x-auto border border-text1 bg-surface">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border">
                <th className="w-32 px-4 py-3 text-left arch-label text-text2 font-medium align-top">{t('compare.product')}</th>
                {items.map((p, i) => (
                  <th key={p.id} className="px-4 py-3 text-left align-top min-w-[200px]">
                    <div className="relative">
                      <button type="button" onClick={() => remove(p.id)} className="absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center border border-border bg-surface text-text2 transition-colors hover:border-red-600 hover:text-red-700" aria-label={t('compare.remove')}>
                        <X size={15} aria-hidden="true" />
                      </button>
                      <Link href={`/product/${p.slug}`} className="block overflow-hidden border border-border">
                        <GarmentPlate product={p} showMeta={false} compact marks={false} className="aspect-[3/4] w-full" />
                        <div className="px-3 py-2">
                          <p className="text-[12px] font-medium text-text1 leading-snug">{productName(p)}</p>
                        </div>
                      </Link>
                      <Button size="sm" variant="outline" href={`/product/${p.slug}`} className="mt-2 w-full">{t('compare.view')}</Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.k} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 arch-label text-text2 font-medium align-top">{row.k}</td>
                  {items.map((p) => (
                    <td key={p.id} className="px-4 py-3 align-top">{row.render(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
