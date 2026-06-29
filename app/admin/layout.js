import AdminGate from '@/components/admin/AdminGate'
import ToastContainer from '@/components/ui/Toast'

export default function AdminLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <AdminGate>{children}</AdminGate>
    </>
  )
}
