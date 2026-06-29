'use client'
import { useEffect, useRef, useState, Component } from 'react'
import dynamic from 'next/dynamic'
import FragmentSceneFallback from './FragmentSceneFallback'

// Code-split Three.js + R3F + Rapier keluar dari initial bundle --
// library ini berat (~600kb+ gzipped gabungan), jadi cuma di-load saat
// benar-benar dibutuhkan (lihat IntersectionObserver gate di bawah).
const FragmentScene = dynamic(() => import('./FragmentScene'), {
  ssr: false,
  loading: () => <FragmentSceneFallback />,
})

/**
 * Error boundary tipis -- menangkap JS exception biasa yang terjadi saat
 * render/init (geometry error, dsb). CATATAN: ini TIDAK menangkap WebGL
 * "context lost" -- itu browser-level event, bukan JS exception, jadi
 * harus ditangani lewat listener `webglcontextlost` terpisah (lihat
 * FragmentScene.jsx onCreated handler).
 */
class ErrorCatcher extends Component {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  componentDidCatch() {
    this.props.onError?.()
  }
  render() {
    if (this.state.error) return <FragmentSceneFallback />
    return this.props.children
  }
}

export default function FragmentSceneLazy() {
  const containerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Gate mount awal: tunggu elemen masuk viewport sebelum mount Canvas
  // WebGL untuk pertama kali (hero section biasanya langsung kelihatan,
  // tapi pola ini dipertahankan untuk konsistensi dan device yang scroll
  // lambat). PENTING -- begitu `shouldRender` jadi true, Canvas TIDAK
  // di-unmount lagi sekalipun keluar viewport: unmount Canvas WebGL
  // secara sengaja memicu "context lost" (dikonfirmasi oleh maintainer
  // react-three-fiber), jadi unmount/remount berulang saat elemen
  // flip-flop di edge viewport threshold justru jadi SUMBER context lost,
  // bukan solusinya. Observer di-disconnect sekali sudah mounted, karena
  // tugasnya cuma gate mount awal.
  useEffect(() => {
    const el = containerRef.current
    if (!el || shouldRender) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldRender])

  // Gate dukungan WebGL sebelum coba mount Canvas -- device lama atau
  // browser tanpa WebGL akan selalu dapat fallback statis, bukan error
  // blank screen.
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
      if (!supported) setHasError(true)
    } catch {
      setHasError(true)
    }
  }, [])

  const showScene = shouldRender && !hasError

  return (
    <div ref={containerRef} className="absolute inset-0">
      {showScene ? (
        <ErrorCatcher onError={() => setHasError(true)}>
          <FragmentScene onContextLost={() => setHasError(true)} />
        </ErrorCatcher>
      ) : (
        <FragmentSceneFallback />
      )}
    </div>
  )
}
