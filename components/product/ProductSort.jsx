'use client'
import { FieldSelect } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'
export default function ProductSort({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="arch-label text-text2 hidden md:block">{t('sort.label')}</span>
      <FieldSelect value={value} onChange={e => onChange(e.target.value)} className="w-auto py-2 text-[10px] uppercase tracking-[0.14em]">
        <option value="default">{t('sort.featured')}</option>
        <option value="price-asc">{t('sort.priceAsc')}</option>
        <option value="price-desc">{t('sort.priceDesc')}</option>
        <option value="name-asc">{t('sort.nameAZ')}</option>
      </FieldSelect>
    </div>
  )
}
