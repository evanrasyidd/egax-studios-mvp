'use client'
import { FieldInput, FieldLabel } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

export default function CustomerForm({ data, onChange, errors }) {
  const { t } = useI18n()
  const fields = [
    { name: 'firstName', label: t('checkout.firstName'), type: 'text', placeholder: 'Nadia', autoComplete: 'given-name' },
    { name: 'lastName', label: t('checkout.lastName'), type: 'text', placeholder: 'Pratama', autoComplete: 'family-name' },
    { name: 'email', label: t('checkout.email'), type: 'email', placeholder: 'nama@email.com', autoComplete: 'email', full: true },
    { name: 'phone', label: t('checkout.phone'), type: 'tel', placeholder: '08xxxxxxxxxx', autoComplete: 'tel', full: true },
    { name: 'address', label: t('checkout.address'), type: 'text', placeholder: 'Jl. Sudirman No. 1', autoComplete: 'street-address', full: true },
    { name: 'city', label: t('checkout.city'), type: 'text', placeholder: 'Jakarta', autoComplete: 'address-level2' },
    { name: 'postalCode', label: t('checkout.postalCode'), type: 'text', placeholder: '12345', autoComplete: 'postal-code' },
    { name: 'province', label: t('checkout.province'), type: 'text', placeholder: 'DKI Jakarta', autoComplete: 'address-level1', full: true },
  ]

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between border-b border-border pb-3">
        <h2 className="font-display text-[22px] font-bold tracking-[-0.01em] text-text1">{t('checkout.customerInfo')}</h2>
        <span className="arch-label text-text2">01</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, type, placeholder, autoComplete, full }) => (
          <div key={name} className={full ? 'sm:col-span-2' : ''}>
            <FieldLabel htmlFor={`checkout-${name}`}>{label}</FieldLabel>
            <FieldInput
              id={`checkout-${name}`}
              type={type}
              value={data[name] || ''}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={placeholder}
              autoComplete={autoComplete}
              error={errors?.[name]}
              required
            />
          </div>
        ))}
      </div>
    </div>
  )
}
