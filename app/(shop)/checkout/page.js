'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import CustomerForm from '@/components/checkout/CustomerForm'
import PaymentSelector from '@/components/checkout/PaymentSelector'
import QRISPayment from '@/components/checkout/QRISPayment'
import VirtualAccount from '@/components/checkout/VirtualAccount'
import EwalletPayment from '@/components/checkout/EwalletPayment'
import OrderSummary from '@/components/checkout/OrderSummary'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useOrderStore } from '@/store/orderStore'
import { useVoucherStore } from '@/store/voucherStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { generateOrderId, formatPrice } from '@/lib/utils'
import { generateVANumber } from '@/lib/mockPayment'

const VA_BANKS = { bca: 'BCA', bni: 'BNI', mandiri: 'Mandiri' }
const EWALLETS = ['gopay', 'ovo', 'dana']

export default function CheckoutPage() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { t } = useI18n()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const applyVoucher = useVoucherStore((s) => s.applyVoucher)
  const total = getTotalPrice()

  // Voucher
  const [voucherCode, setVoucherCode] = useState('')
  const [voucher, setVoucher] = useState(null)
  const [voucherError, setVoucherError] = useState('')
  const discount = voucher?.discount || 0
  const payable = Math.max(0, total - discount)

  const handleApplyVoucher = () => {
    const res = applyVoucher(voucherCode, total)
    if (res.ok) {
      setVoucher(res)
      setVoucherError('')
    } else {
      setVoucher(null)
      setVoucherError(t(`voucher.${res.error}`))
    }
  }

  const STEPS = [t('checkout.step1'), t('checkout.step2'), t('checkout.step3')]

  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState({})
  const [payMethod, setPayMethod] = useState('qris')
  const [errors, setErrors] = useState({})
  const [orderId] = useState(generateOrderId())
  // VA number digenerate sekali saat order dikonfirmasi (bukan tiap render)
  // supaya nomornya konsisten selama sesi checkout, sama seperti payment
  // gateway sungguhan yang generate VA number sekali per transaksi.
  const [vaNumber, setVaNumber] = useState(null)
  // Idempotency guard: success callback bisa ke-trigger dobel (klik ganda /
  // balik ke step 3 terus bayar lagi) -- jangan sampai order dobel masuk.
  const placedRef = useRef(false)

  const handleCustomerChange = (name, value) => {
    setCustomer((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
    const errs = {}
    required.forEach((f) => { if (!customer[f]) errs[f] = t('checkout.required') })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && VA_BANKS[payMethod]) {
      setVaNumber(generateVANumber(VA_BANKS[payMethod]))
    }
    setStep((s) => s + 1)
  }

  const handleSuccess = () => {
    if (placedRef.current) return
    placedRef.current = true
    const order = {
      id: orderId,
      customer,
      items,
      total: payable,
      subtotal: total,
      discount,
      voucherCode: voucher?.voucher?.code || null,
      status: 'Paid',
      date: new Date().toISOString(),
      payMethod,
      channel: 'shop',
    }
    addOrder(order)
    clearCart()
    router.push(`/checkout/success?orderId=${orderId}`)
  }

  // Sebelum hydrated, `items` selalu [] (lihat skipHydration di cartStore) --
  // jangan judge cart kosong sebelum rehydrate selesai, atau user yang
  // baru checkout dari cart terisi akan lihat kilatan "Cart is empty".
  if (!hydrated) return null

  if (items.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-text2 mb-4">{t('checkout.emptyCart')}</p>
          <Button variant="primary" onClick={() => router.push('/catalog')}>
            {t('checkout.shopNow')}
          </Button>
        </div>
      </div>
    )
  }

  const renderPaymentStep = () => {
    if (payMethod === 'qris') {
      return <QRISPayment orderId={orderId} amount={payable} onSuccess={handleSuccess} />
    }
    if (EWALLETS.includes(payMethod)) {
      return <EwalletPayment wallet={payMethod} orderId={orderId} amount={payable} onSuccess={handleSuccess} />
    }
    return (
      <VirtualAccount
        bank={VA_BANKS[payMethod]}
        vaNumber={vaNumber || generateVANumber(VA_BANKS[payMethod])}
        amount={payable}
        orderId={orderId}
        onSuccess={handleSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        <h1 className="font-display text-[38px] font-bold tracking-[-0.01em] text-text1 mb-6">{t('checkout.title')}</h1>

        {/* ── Step progress, ala payment gateway Snap-style ── */}
        <div className="flex items-center gap-2 mb-10 max-w-md">
          {STEPS.map((label, i) => {
            const idx = i + 1
            const isDone = step > idx
            const isActive = step === idx
            return (
              <div key={label} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                    isDone ? 'bg-pink text-white' : isActive ? 'bg-text1 text-white' : 'bg-border text-text2'
                  }`}>
                    {isDone ? <Check size={13} /> : idx}
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-widest hidden sm:inline ${isActive ? 'text-text1' : isDone ? 'text-pink' : 'text-text2'}`}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length && <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-pink' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div>
            {step === 1 && (
              <div className="space-y-8">
                <CustomerForm data={customer} onChange={handleCustomerChange} errors={errors} />
                <Button variant="primary" className="w-full md:w-auto" onClick={handleNext}>
                  {t('checkout.continue')}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <PaymentSelector selected={payMethod} onChange={setPayMethod} />
                <div className="flex gap-3">
                  <Button variant="outline" className="border-border text-text1" onClick={() => setStep(1)}>{t('checkout.back')}</Button>
                  <Button variant="primary" onClick={handleNext}>
                    {t('checkout.confirm')}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="border border-border p-6 md:p-8">
                {renderPaymentStep()}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Voucher */}
            <div className="bg-bg border border-border p-4">
              {voucher ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-text1">{voucher.voucher.code}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-green-700">
                      {t('checkout.voucherApplied', { amount: formatPrice(discount) })}
                    </p>
                  </div>
                  <button onClick={() => { setVoucher(null); setVoucherCode('') }}
                    className="arch-label text-text2 hover:text-red-600 transition-colors">
                    {t('checkout.remove')}
                  </button>
                </div>
              ) : (
                <div>
                  <label htmlFor="voucher-code" className="sr-only">{t('checkout.voucherPlaceholder')}</label>
                  <div className="flex gap-2">
                    <input
                      id="voucher-code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder={t('checkout.voucherPlaceholder')}
                      autoComplete="off"
                      aria-invalid={voucherError ? true : undefined}
                      aria-describedby={voucherError ? 'voucher-error' : undefined}
                      className="min-w-0 flex-1 border border-text2 bg-surface px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-text1 placeholder:text-text2 focus:border-text1"
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyVoucher} className="shrink-0">
                      {t('checkout.apply')}
                    </Button>
                  </div>
                </div>
              )}
              {voucherError && <p id="voucher-error" role="alert" className="mt-2 font-mono text-[11px] text-red-700">{voucherError}</p>}
            </div>
            <OrderSummary items={items} total={total} discount={discount} />
          </div>
        </div>
      </div>
    </div>
  )
}
