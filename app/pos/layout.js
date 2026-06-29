import ToastContainer from '@/components/ui/Toast'

export const metadata = {
  title: 'POS Kasir — EGAX Studios',
  robots: { index: false, follow: false },
}

export default function PosLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      <ToastContainer />
      {children}
    </div>
  )
}
