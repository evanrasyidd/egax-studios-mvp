'use client'

/**
 * QR code ini PURE VISUAL SIMULATION -- tidak encode data apapun yang
 * bisa di-scan sungguhan (project ini tidak terhubung payment gateway
 * asli, sesuai standar simulasi pembayaran). Pattern grid dibuat
 * deterministik dari `seed` (biasanya orderId) memakai hash sederhana,
 * supaya tiap order konsisten menampilkan pattern yang sama tiap re-render,
 * dan terlihat seperti QR code asli (bukan blok generik) lewat 3 finder
 * pattern di pojok seperti QR code standar.
 */
function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    return h / 0x7fffffff
  }
}

const GRID = 21 // ukuran khas QR code versi kecil

export default function FakeQRCode({ seed = 'EGAX', size = 208 }) {
  const rand = seededRandom(seed)
  const cell = size / GRID

  // Finder pattern (kotak bersarang di 3 pojok) -- ciri visual paling
  // mengenali sebuah QR code, jadi wajib ada supaya kerasa "QR sungguhan".
  const isFinderZone = (r, c) => {
    const zones = [[0, 0], [0, GRID - 7], [GRID - 7, 0]]
    return zones.some(([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7)
  }
  const isFinderRing = (r, c, zr, zc) => {
    const lr = r - zr, lc = c - zc
    if (lr < 0 || lr > 6 || lc < 0 || lc > 6) return false
    const onOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6
    const onInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
    return onOuter || onInner
  }

  const cells = []
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      let filled
      const zones = [[0, 0], [0, GRID - 7], [GRID - 7, 0]]
      const finderZone = zones.find(([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7)
      if (finderZone) {
        filled = isFinderRing(r, c, finderZone[0], finderZone[1])
      } else {
        filled = rand() > 0.55
      }
      if (filled) cells.push([r, c])
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QRIS code simulasi">
      <rect width={size} height={size} fill="#ffffff" />
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0A0A0A" />
      ))}
    </svg>
  )
}
