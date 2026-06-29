/**
 * Fallback statis (SVG line-art) untuk FragmentScene -- tampil saat:
 * 1. Komponen belum masuk viewport (IntersectionObserver belum trigger)
 * 2. WebGL gagal init (device/browser tidak support)
 * Bentuknya echo dari shard 3D: polyhedron-polyhedron pecah dengan outline
 * tipis, supaya transisi ke versi 3D (begitu lazy-load selesai) tidak
 * terasa "lompat" secara komposisi.
 */
export default function FragmentSceneFallback() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    >
      <g fill="none" stroke="#FF2D9B" strokeWidth="1.2" opacity="0.7">
        <polygon points="300,120 360,180 340,250 260,250 240,180" fill="#141414" stroke="#FF2D9B" />
        <polygon points="180,260 230,300 210,360 150,350 130,300" fill="#1B1B1B" stroke="#FF2D9B" opacity="0.85" />
        <polygon points="420,300 470,330 460,400 400,410 380,350" fill="#141414" stroke="#FF2D9B" opacity="0.85" />
        <polygon points="300,380 340,420 320,470 270,460 250,410" fill="#1B1B1B" stroke="#FF2D9B" opacity="0.7" />
      </g>
      <g stroke="#2A2A2A" strokeWidth="0.6" opacity="0.5">
        <line x1="300" y1="120" x2="340" y2="250" />
        <line x1="230" y1="300" x2="270" y2="460" />
        <line x1="470" y1="330" x2="320" y2="470" />
      </g>
    </svg>
  )
}
