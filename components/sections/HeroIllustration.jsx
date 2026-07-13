/**
 * Ilustrasi hero flat-vector (bold cartoon streetwear) -- pengganti 3D
 * scene yang sebelumnya dipake (dihapus karena bentuk pipih yang di-physics
 * tumbling keliatan gepeng/aneh dari sudut-sudut tertentu, dan secara
 * konsep juga kerasa gak nyambung).
 *
 * Gaya di sini ngikutin referensi ilustrasi flat-vector tebal ala brand
 * kartun (outline hitam tebal, warna solid, style playful/pop) -- murni
 * CSS + SVG statis, gak ada 3D/physics sama sekali. Animasi cuma float
 * halus lewat CSS keyframes, jauh lebih murah & selalu kebaca jelas dari
 * sudut manapun karena ini flat 2D illustration, bukan objek 3D.
 */
export default function HeroIllustration() {
  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-[55%] pointer-events-none select-none overflow-hidden">
      <style>{`
        @keyframes hero-float-a {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%      { transform: translateY(-18px) rotate(-1deg); }
        }
        @keyframes hero-float-b {
          0%, 100% { transform: translateY(0px) rotate(8deg); }
          50%      { transform: translateY(-14px) rotate(11deg); }
        }
        @keyframes hero-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hero-float-c {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%      { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes hero-float-d {
          0%, 100% { transform: translateY(0px) rotate(14deg); }
          50%      { transform: translateY(-20px) rotate(9deg); }
        }
      `}</style>

      {/* Hoodie besar -- elemen utama */}
      <svg
        viewBox="0 0 200 200"
        className="absolute"
        style={{
          width: 'min(46vw, 460px)',
          right: '-4%',
          top: '18%',
          animation: 'hero-float-a 6s ease-in-out infinite',
        }}
      >
        <path
          d="M62 62 Q100 18 138 62 L150 78 L128 92 L128 78 Q100 56 72 78 L72 92 L50 78 Z"
          fill="#FFD400" stroke="#14120F" strokeWidth="6" strokeLinejoin="round"
        />
        <path
          d="M50 78 L28 96 L40 122 L64 106 L64 168 Q64 180 76 180 L124 180 Q136 180 136 168 L136 106 L160 122 L172 96 L150 78 L128 92 L128 78 L72 78 L72 92 Z"
          fill="#2E4BFF" stroke="#14120F" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
        />
        <circle cx="90" cy="118" r="4.5" fill="#14120F" />
        <circle cx="110" cy="118" r="4.5" fill="#14120F" />
        <path d="M90 118 Q100 132 110 118" fill="none" stroke="#14120F" strokeWidth="5" strokeLinecap="round" />
        <rect x="80" y="140" width="40" height="22" rx="4" fill="none" stroke="#14120F" strokeWidth="5" />
        <rect x="66" y="60" width="14" height="14" rx="3" fill="#FF2E7E" stroke="#14120F" strokeWidth="4" transform="rotate(20 73 67)" />
      </svg>

      {/* Cap kecil -- elemen pendukung, ngambang beda ritme */}
      <svg
        viewBox="0 0 120 90"
        className="absolute hidden sm:block"
        style={{
          width: 'min(18vw, 170px)',
          right: '38%',
          top: '8%',
          animation: 'hero-float-b 5s ease-in-out infinite',
        }}
      >
        <path
          d="M14 46 Q14 12 60 12 Q106 12 106 46 L106 50 L14 50 Z"
          fill="#FF2E7E" stroke="#14120F" strokeWidth="6" strokeLinejoin="round"
        />
        <path d="M106 46 Q118 46 118 54 Q118 60 106 60 L98 60 L98 46 Z"
          fill="#FF2E7E" stroke="#14120F" strokeWidth="6" strokeLinejoin="round" />
        <circle cx="60" cy="26" r="5" fill="#14120F" />
      </svg>

      {/* Sneaker -- elemen ke-3, di area bawah biar gak numpuk sama hoodie */}
      <svg
        viewBox="0 0 200 110"
        className="absolute hidden sm:block"
        style={{
          width: 'min(30vw, 280px)',
          right: '2%',
          bottom: '10%',
          animation: 'hero-float-c 7s ease-in-out infinite',
        }}
      >
        <path
          d="M14 90 Q10 68 26 62 L46 54 Q58 44 74 46 L100 50 Q118 40 138 46 L168 58 Q188 64 188 80 L188 90 Q188 96 182 96 L20 96 Q14 96 14 90 Z"
          fill="#FF2E7E" stroke="#14120F" strokeWidth="6" strokeLinejoin="round"
        />
        <path d="M14 90 L188 90 L188 96 Q188 100 182 100 L20 100 Q14 100 14 94 Z"
          fill="#14120F" />
        <path d="M74 46 L82 62 M92 48 L98 64 M110 49 L114 66"
          fill="none" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
        <path d="M46 54 Q64 66 90 64 Q120 62 138 46"
          fill="none" stroke="#14120F" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* Swing tag -- elemen ke-4, kecil di atas dekat cap */}
      <svg
        viewBox="0 0 80 60"
        className="absolute hidden md:block"
        style={{
          width: 'min(10vw, 96px)',
          right: '4%',
          top: '10%',
          animation: 'hero-float-d 5.5s ease-in-out infinite',
        }}
      >
        <path
          d="M6 26 L34 6 Q38 3 42 6 L74 28 Q78 31 74 35 L46 55 Q42 58 38 55 L6 34 Q3 31 6 26 Z"
          fill="#FFD400" stroke="#14120F" strokeWidth="5" strokeLinejoin="round"
        />
        <circle cx="30" cy="18" r="5" fill="#FAF7F0" stroke="#14120F" strokeWidth="4" />
      </svg>

      {/* Aksen bintang kecil ngambang -- detail playful, jangan berlebihan */}
      <svg viewBox="0 0 40 40" className="absolute" style={{ width: 28, right: '30%', top: '58%', animation: 'hero-spin-slow 9s linear infinite' }}>
        <path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="#14120F" />
      </svg>
      <svg viewBox="0 0 40 40" className="absolute hidden sm:block" style={{ width: 20, right: '15%', top: '30%', animation: 'hero-spin-slow 7s linear infinite reverse' }}>
        <path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="#2E4BFF" />
      </svg>
    </div>
  )
}
