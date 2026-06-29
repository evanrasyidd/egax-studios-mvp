'use client'
import { useState } from 'react'
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
import { useHydrated } from '@/hooks/useHydrated'
import { generateOrderId, formatPrice } from '@/lib/utils'
import { generateVANumber } from '@/lib/mockPayment'

const STEPS = ['Informasi', 'Pembayaran', 'Selesai']
const VA_BANKS = { bca: 'BCA', bni: 'BNI', mandiri: 'Mandiri' }
const EWALLETS = ['gopay', 'ovo', 'dana']

export default function CheckoutPage() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const total = getTotalPrice()

  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState({})
  const [payMethod, setPayMethod] = useState('qris')
  const [errors, setErrors] = useState({})
  const [orderId] = useState(generateOrderId())
  // VA number digenerate sekali saat order dikonfirmasi (bukan tiap render)
  // supaya nomornya konsisten selama sesi checkout, sama seperti payment
  // gateway sungguhan yang generate VA number sekali per transaksi.
  const [vaNumber, setVaNumber] = useState(null)

  const handleCustomerChange = (name, value) => {
    setCustomer((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']
    const errs = {}
    required.forEach((f) => { if (!customer[f]) errs[f] = 'Required' })
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
    const order = {
      id: orderId,
      customer,
      items,
      total,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Button variant="white" className="border border-bg bg-bg text-white" onClick={() => router.push('/catalog')}>
            Shop Now
          </Button>
        </div>
      </div>
    )
  }

  const renderPaymentStep = () => {
    if (payMethod === 'qris') {
      return <QRISPayment orderId={orderId} amount={total} onSuccess={handleSuccess} />
    }
    if (EWALLETS.includes(payMethod)) {
      return <EwalletPayment wallet={payMethod} orderId={orderId} amount={total} onSuccess={handleSuccess} />
    }
    return (
      <VirtualAccount
        bank={VA_BANKS[payMethod]}
        vaNumber={vaNumber || generateVANumber(VA_BANKS[payMethod])}
        amount={total}
        orderId={orderId}
        onSuccess={handleSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        <h1 className="font-display text-[40px] tracking-wider text-bg mb-6">Checkout</h1>

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
                    isDone ? 'bg-pink text-black' : isActive ? 'bg-bg text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isDone ? <Check size={13} /> : idx}
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-widest hidden sm:inline ${isActive ? 'text-bg' : isDone ? 'text-pink' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length && <div className={`flex-1 h-px mx-3 ${isDone ? 'bg-pink' : 'bg-gray-200'}`} />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div>
            {step === 1 && (
              <div className="space-y-8">
                <CustomerForm data={customer} onChange={handleCustomerChange} errors={errors} />
                <Button variant="white" className="border border-bg bg-bg text-white w-full md:w-auto" onClick={handleNext}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <PaymentSelector selected={payMethod} onChange={setPayMethod} />
                <div className="flex gap-3">
                  <Button variant="outline" className="border-gray-200 text-bg" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="white" className="border border-bg bg-bg text-white" onClick={handleNext}>
                    Confirm Order
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="border border-gray-100 p-6 md:p-8">
                {renderPaymentStep()}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}
