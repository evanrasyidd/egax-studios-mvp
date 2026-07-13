'use client'

/**
 * Placeholder produk: siluet garmen flat-vector bold-outline (bold cartoon
 * streetwear style) -- BUKAN pengganti foto produk asli. Begitu Ega punya
 * foto produk real, ganti lewat `product.images` dan render <img> biasa.
 *
 * Dulu ini pixel-art grid 16x16 (fit ke tema arcade lama). Sekarang vector
 * shape dengan outline ink tebal + color-blocking, biar nyambung sama
 * signature ink-frame yang dipake di seluruh UI, dan tetap tajam di ukuran
 * berapa pun (vector, bukan raster pixelated).
 *
 * viewBox tetap 0 0 64 64 buat semua kategori biar proporsi konsisten.
 */
const STROKE = '#14120F'
const SW = 3.5

const GARMENTS = {
  Hoodie: ({ fill, shade, detail }) => (
    <>
      <path d="M20 14 Q32 4 44 14 L48 20 L42 24 L42 20 Q32 14 22 20 L22 24 L16 20 Z" fill={shade} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M16 20 L10 26 L14 34 L20 30 L20 56 Q20 60 24 60 L40 60 Q44 60 44 56 L44 30 L50 34 L54 26 L48 20 L42 24 L42 20 L22 20 L22 24 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="29" cy="38" r="1.8" fill={detail} />
      <circle cx="35" cy="38" r="1.8" fill={detail} />
      <path d="M29 38 Q32 44 35 38" fill="none" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <rect x="26" y="46" width="12" height="7" rx="2" fill="none" stroke={detail} strokeWidth="2" />
    </>
  ),
  Shirt: ({ fill, shade, detail }) => (
    <>
      <path d="M24 12 L32 18 L40 12 L52 20 L47 30 L42 26 L42 56 Q42 59 39 59 L25 59 Q22 59 22 56 L22 26 L17 30 L12 20 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M24 12 Q32 20 40 12 L37 16 Q32 20 27 16 Z" fill={shade} stroke={STROKE} strokeWidth={2.5} strokeLinejoin="round" />
      <line x1="32" y1="24" x2="32" y2="52" stroke={detail} strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
    </>
  ),
  Tops: ({ fill, shade, detail }) => (
    <>
      <path d="M23 14 L32 20 L41 14 L38 24 L38 56 Q38 59 35 59 L29 59 Q26 59 26 56 L26 24 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M23 14 L18 26 L23 28 L26 20 Z" fill={shade} stroke={STROKE} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M41 14 L46 26 L41 28 L38 20 Z" fill={shade} stroke={STROKE} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx="32" cy="34" r="2" fill={detail} />
    </>
  ),
  Pants: ({ fill, shade, detail }) => (
    <>
      <path d="M20 8 L44 8 L45 24 L52 58 Q52 60 49 60 L42 60 Q40 60 39.5 58 L34 30 L30 58 Q29.5 60 27 60 L20 60 Q17 60 17 58 L19 24 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <line x1="32" y1="8" x2="32" y2="26" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <rect x="21" y="14" width="8" height="6" fill={shade} stroke={STROKE} strokeWidth="2" />
      <rect x="35" y="14" width="8" height="6" fill={shade} stroke={STROKE} strokeWidth="2" />
    </>
  ),
  Accessories: ({ fill, shade, detail }) => (
    <>
      <path d="M12 36 Q12 18 32 18 Q52 18 52 36 L52 38 L12 38 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 18 Q52 18 52 36 L44 36 Q42 24 32 22 Z" fill={shade} />
      <path d="M52 36 Q58 36 58 40 Q58 43 52 43 L48 43 L48 36 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="32" cy="27" r="2" fill={detail} />
    </>
  ),
  Essentials: ({ fill, shade, detail }) => (
    <>
      <path d="M24 12 L32 17 L40 12 L51 19 L46 29 L41 25 L41 56 Q41 59 38 59 L26 59 Q23 59 23 56 L23 25 L18 29 L13 19 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="32" cy="17" r="5.5" fill={shade} stroke={STROKE} strokeWidth={2.5} />
      <line x1="26" y1="34" x2="38" y2="34" stroke={detail} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
}

const DEFAULT_GARMENT = GARMENTS.Shirt

/**
 * @param {string} category - kategori produk (Hoodie, Shirt, Tops, Pants, Accessories, Essentials)
 * @param {string} fill - warna base garmen
 * @param {string} shade - warna panel kontras (color blocking, bukan gradient)
 * @param {string} detail - warna aksen kecil (drawstring, jahitan, logo dot)
 * @param {number} scale - faktor ukuran (dipertahankan sama seperti versi pixel lama biar semua call site gak perlu berubah)
 */
export default function GarmentIcon({ category, fill = '#FFFFFF', shade = 'rgba(0,0,0,0.18)', detail = '#FF2E7E', scale = 6 }) {
  const Shape = GARMENTS[category] || DEFAULT_GARMENT
  const size = scale * 16
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }} aria-hidden="true">
      <Shape fill={fill} shade={shade} detail={detail} />
    </svg>
  )
}
