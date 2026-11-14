'use client'
import { FieldSelect } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

export default function ProductSort({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex shrink-0 items-center gap-2">
      <label htmlFor="catalog-sort" className="arch-label hidden text-text2 md:block">{t('sort.label')}</label>
      <FieldSelect
        id="catalog-sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('sort.label')}
        className="min-h-11 w-auto py-2 font-mono text-[11px] uppercase tracking-[0.08em]"
      >
        <option value="default">{t('sort.featured')}</option>
        <option value="price-asc">{t('sort.priceAsc')}</option>
        <option value="price-desc">{t('sort.priceDesc')}</option>
        <option value="name-asc">{t('sort.nameAZ')}</option>
      </FieldSelect>
    </div>
  )
}
