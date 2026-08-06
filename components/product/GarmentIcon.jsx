'use client'

/**
 * Placeholder produk: siluet garmen flat-vector casual (drop shoulder,
 * oversized, relaks) -- BUKAN pengganti foto produk asli. Begitu Ega punya
 * foto produk real, ganti lewat `product.images` dan render <img>.
 *
 * viewBox tetap 0 0 64 64 buat semua kategori biar proporsi konsisten.
 */
const STROKE = '#111111'
const SW = 3

const GARMENTS = {
  Hoodie: ({ fill, shade, detail }) => (
    <>
      {/* hood */}
      <path d="M25 14 Q32 6 39 14 L39 19 Q32 15 25 19 Z" fill={shade} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      {/* body + drop-shoulder sleeves */}
      <path d="M15 25 Q14 12 24 12 L32 19 L40 12 Q50 12 49 25 L55 34 L48 36 L45 33 L45 53 Q45 57 41 57 L23 57 Q19 57 19 53 L19 33 L16 36 L9 34 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      {/* drawstrings */}
      <line x1="29" y1="17" x2="29" y2="24" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="17" x2="35" y2="24" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="25" r="1.6" fill={detail} />
      <circle cx="35" cy="25" r="1.6" fill={detail} />
      {/* kangaroo pocket */}
      <rect x="24" y="40" width="16" height="10" rx="3" fill="none" stroke={detail} strokeWidth="2" />
    </>
  ),
  Jacket: ({ fill, shade, detail }) => (
    <>
      {/* body + sleeves */}
      <path d="M15 25 Q14 12 24 12 L32 19 L40 12 Q50 12 49 25 L55 34 L48 36 L45 33 L45 53 Q45 57 41 57 L23 57 Q19 57 19 53 L19 33 L16 36 L9 34 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      {/* collar */}
      <path d="M28 15 L32 20 L36 15 L34 12.5 L32 14.5 L30 12.5 Z" fill={shade} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      {/* front placket */}
      <line x1="32" y1="23" x2="32" y2="50" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      {/* chest pockets */}
      <rect x="21" y="30" width="8" height="9" rx="1.5" fill="none" stroke={detail} strokeWidth="2" />
      <rect x="35" y="30" width="8" height="9" rx="1.5" fill="none" stroke={detail} strokeWidth="2" />
      {/* sleeve cuffs */}
      <line x1="9" y1="33" x2="16" y2="35.5" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="33" x2="48" y2="35.5" stroke={detail} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  Shirt: ({ fill, shade, detail }) => (
    <>
      {/* body + short sleeves */}
      <path d="M15 25 Q14 12 24 12 L28 15 L36 15 L40 12 Q50 12 49 25 L55 34 L48 36 L45 33 L45 53 Q45 57 41 57 L23 57 Q19 57 19 53 L19 33 L16 36 L9 34 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      {/* collar */}
      <path d="M28 15 L32 20 L36 15 L34 12.5 L32 14.5 L30 12.5 Z" fill={shade} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      {/* buttons */}
      <line x1="32" y1="24" x2="32" y2="50" stroke={detail} strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
    </>
  ),
  Tops: ({ fill, shade, detail }) => (
    <>
      {/* body + long sleeves */}
      <path d="M15 25 Q14 12 24 12 L32 19 L40 12 Q50 12 49 25 L52 52 Q52 55 49 55 L45 55 Q42 55 42 52 L42 20 L42 55 Q42 58 39 58 L25 58 Q22 58 22 55 L22 20 L22 52 Q22 55 19 55 L15 55 Q12 55 12 52 L15 25 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      {/* crew neck band */}
      <path d="M27 12 Q32 17 37 12 L37 15 Q32 19 27 15 Z" fill={shade} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      {/* small chest pocket */}
      <rect x="25" y="30" width="11" height="12" rx="1.5" fill="none" stroke={detail} strokeWidth="2" />
    </>
  ),
  Pants: ({ fill, shade, detail }) => (
    <>
      <path d="M21 8 L43 8 L44 26 L53 58 Q53 61 49 61 L43 61 Q40 61 39.5 58 L34 30 L30 58 Q29.5 61 26 61 L20 61 Q17 61 17 58 L20 26 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <line x1="32" y1="8" x2="32" y2="27" stroke={detail} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="15" width="7" height="5" fill={shade} stroke={STROKE} strokeWidth="1.8" />
      <rect x="35" y="15" width="7" height="5" fill={shade} stroke={STROKE} strokeWidth="1.8" />
    </>
  ),
  Accessories: ({ fill, shade, detail }) => (
    <>
      <path d="M12 38 Q12 18 32 18 Q52 18 52 38 L52 40 L12 40 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 18 Q52 18 52 38 L44 38 Q42 24 32 22 Z" fill={shade} />
      <path d="M12 33 Q32 40 52 33 L52 37 Q32 44 12 37 Z" fill={shade} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="32" cy="27" r="2" fill={detail} />
    </>
  ),
  Essentials: ({ fill, shade, detail }) => (
    <>
      {/* body + drop-shoulder sleeves */}
      <path d="M15 25 Q14 12 24 12 L32 19 L40 12 Q50 12 49 25 L55 34 L48 36 L45 33 L45 53 Q45 57 41 57 L23 57 Q19 57 19 53 L19 33 L16 36 L9 34 Z" fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      {/* crew neck band */}
      <path d="M27 12 Q32 17 37 12 L37 15 Q32 19 27 15 Z" fill={shade} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
      {/* kangaroo pocket */}
      <rect x="23" y="38" width="18" height="11" rx="3" fill="none" stroke={detail} strokeWidth="2" />
    </>
  ),
}

const DEFAULT_GARMENT = GARMENTS.Shirt

/**
 * @param {string} category - kategori produk (Jacket, Hoodie, Shirt, Tops, Pants, Accessories, Essentials)
 * @param {string} fill - warna base garmen
 * @param {string} shade - warna panel kontras (color blocking, bukan gradient)
 * @param {string} detail - warna aksen kecil (drawstring, jahitan, logo dot)
 * @param {number} scale - faktor ukuran (dipertahankan sama seperti versi pixel lama biar semua call site gak perlu berubah)
 */
export default function GarmentIcon({ category, fill = '#FFFFFF', shade = 'rgba(0,0,0,0.18)', detail = '#111111', scale = 6 }) {
  const Shape = GARMENTS[category] || DEFAULT_GARMENT
  const size = scale * 16
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }} aria-hidden="true">
      <Shape fill={fill} shade={shade} detail={detail} />
    </svg>
  )
}
