'use client'
import { FieldInput, FieldLabel } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'
export default function CustomerForm({ data, onChange, errors }) {
  const { t } = useI18n()
  const f = (name, label, type='text', placeholder='', full=false) => ({ name, label, type, placeholder, full })
  const fields = [
    f('firstName', t('checkout.firstName'), 'text', 'John'), f('lastName', t('checkout.lastName'), 'text', 'Doe'),
    f('email', t('checkout.email'), 'email', 'john@email.com', true), f('phone', t('checkout.phone'), 'tel', '08xxxxxxxxxx', true),
    f('address', t('checkout.address'), 'text', 'Jl. Sudirman No. 1', true),
    f('city', t('checkout.city'), 'text', 'Jakarta'), f('postalCode', t('checkout.postalCode'), 'text', '12345'),
    f('province', t('checkout.province'), 'text', 'DKI Jakarta', true),
  ]
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
        <h2 className="font-display text-[22px] font-bold tracking-[-0.01em] text-text1">{t('checkout.customerInfo')}</h2>
        <span className="arch-label text-text2">01</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({name,label,type,placeholder,full}) => (
          <div key={name} className={full ? 'col-span-2' : ''}>
            <FieldLabel>{label}</FieldLabel>
            <FieldInput type={type} value={data[name]||''} onChange={e=>onChange(name,e.target.value)} placeholder={placeholder}
              className={errors?.[name] ? 'border-red-500 focus:border-red-500' : ''}/>
            {errors?.[name] && <p className="font-mono text-[10px] text-red-600 mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
