'use client'
import { useCallback } from 'react'
import { usePosStore } from '@/store/posStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useStaffSessionGuard } from '@/hooks/useStaffSessionGuard'
import { toast } from '@/components/ui/Toast'
import PosPinGate from '@/components/pos/PosPinGate'
import PosTerminal from '@/components/pos/PosTerminal'

export default function PosPage() {
  const hydrated = useHydrated()
  const { isUnlocked, lock, verifySession } = usePosStore()

  const handleInvalidSession = useCallback(() => {
    toast('Sesi kasir kamu sudah tidak aktif. Silakan masuk ulang.', 'error')
  }, [])

  useStaffSessionGuard({ hydrated, isLoggedIn: isUnlocked, verifySession, logout: lock, onInvalid: handleInvalidSession })

  // Sebelum hydrated, posStore belum kebaca dari localStorage -- tunda
  // render daripada nampilin PIN gate sekilas ke kasir yang sesi-nya
  // masih aktif (skipHydration di posStore).
  if (!hydrated) return null

  return isUnlocked ? <PosTerminal /> : <PosPinGate />
}
