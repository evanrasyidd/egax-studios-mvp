/**
 * Signature hero graphic: comic boombox + sound-burst rings.
 * Kenapa boombox, bukan cluster hoodie/cap/sneaker (versi sebelumnya):
 * tagline hero adalah "LOUD ON THE STREETS. NO VOLUME KNOB." dan subline
 * "MADE LOUD" -- boombox literally jadi payoff visual dari kata "loud" itu,
 * sementara cluster produk lama gak nyambung sama copy sama sekali.
 *
 * Satu elemen besar + sound-wave arcs di kedua speaker = satu titik fokus
 * ("spend courage in one place"), bukan 4 elemen ngambang bobot rata.
 * Cassette tape jadi satu-satunya elemen satelit, bukan kompetitor.
 */
export default function HeroIllustration() {
  // halftone dot cluster -- dibangkitin lewat loop biar gak nulis manual
  const dots = []
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if ((row + col) % 2 === 0) continue
      dots.push({ cx: col * 9 + 4, cy: row * 9 + 4, r: 1.6 - row * 0.15 })
    }
  }

  return (
    <div className="hero-illustration-root absolute right-0 top-0 h-full w-full md:w-[55%] pointer-events-none select-none overflow-hidden">
      <style>{`
        /*
          Beat-thump, bukan float sine -- ini boombox lagi mainin lagu keras,
          jadi gerakannya harus kerasa kayak "hentakan bass", bukan ngambang
          tenang generic. Attack cepat, settle lambat, ada micro-overshoot.
        */
        @keyframes hero-beat {
          0%   { transform: scale(1)     rotate(-3deg); }
          8%   { transform: scale(1.05)  rotate(-1.2deg); }
          18%  { transform: scale(0.985) rotate(-3.6deg); }
          30%  { transform: scale(1.012) rotate(-3deg); }
          100% { transform: scale(1)     rotate(-3deg); }
        }
        /* Ripple beneran: membesar + fade keluar dari speaker, sinkron beat */
        @keyframes hero-ripple {
          0%   { opacity: 0.95; transform: scale(0.75); }
          60%  { opacity: 0.2;  transform: scale(1.25); }
          100% { opacity: 0;    transform: scale(1.5); }
        }
        /* Reel kaset muter beneran -- fungsional, bukan dekorasi kosong */
        @keyframes reel-spin { to { transform: rotate(360deg); } }
        /* Antena bergetar dikit kena bass */
        @keyframes antenna-buzz {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(2.5deg); }
        }
        @keyframes hero-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .beat-main   { animation: hero-beat 1.15s cubic-bezier(.3,.9,.4,1) infinite; transform-box: fill-box; transform-origin: center; }
        .ripple      { transform-box: fill-box; transform-origin: center; animation: hero-ripple 1.15s ease-out infinite; }
        .ripple-b    { animation-delay: 0.12s; }
        .ripple-c    { animation-delay: 0.24s; }
        .reel        { transform-box: fill-box; transform-origin: center; animation: reel-spin 3.2s linear infinite; }
        .antenna-tip { transform-box: fill-box; transform-origin: center; animation: antenna-buzz 1.15s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hero-illustration-root * { animation: none !important; }
        }
      `}</style>

      {/* Halftone texture -- tekstur dot komik, satu warna ink opacity rendah,
          bukan gradient. Nempel di pojok kanan-atas sebagai action-line. */}
      <svg
        viewBox="0 0 60 60"
        className="absolute hidden md:block"
        style={{ width: 130, right: '6%', top: '4%', opacity: 0.35 }}
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#14120F" />
        ))}
      </svg>

      {/* ── Boombox -- signature tunggal, gerakannya "beat", bukan ngambang ── */}
      <svg
        viewBox="0 0 240 200"
        className="beat-main absolute"
        style={{
          width: 'min(50vw, 480px)',
          right: '-2%',
          top: '22%',
        }}
      >
        {/* sound-burst kiri -- ripple keluar, sinkron beat */}
        <path className="ripple" d="M16 96 Q2 96 2 82"  fill="none" stroke="#14120F" strokeWidth="5" strokeLinecap="round" />
        <path className="ripple ripple-b" d="M14 106 Q-8 106 -8 78" fill="none" stroke="#2E4BFF" strokeWidth="5" strokeLinecap="round" />
        <path className="ripple ripple-c" d="M12 118 Q-18 118 -18 72" fill="none" stroke="#14120F" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

        {/* sound-burst kanan */}
        <path className="ripple" d="M224 96 Q238 96 238 82" fill="none" stroke="#14120F" strokeWidth="5" strokeLinecap="round" />
        <path className="ripple ripple-b" d="M226 106 Q248 106 248 78" fill="none" stroke="#FF2E7E" strokeWidth="5" strokeLinecap="round" />
        <path className="ripple ripple-c" d="M228 118 Q258 118 258 72" fill="none" stroke="#14120F" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

        {/* handle */}
        <path d="M70 58 Q120 10 170 58" fill="none" stroke="#14120F" strokeWidth="8" strokeLinecap="round" />

        {/* antenna -- bergetar kena bass */}
        <g className="antenna-tip">
          <path d="M168 46 L196 14" fill="none" stroke="#14120F" strokeWidth="5" strokeLinecap="round" />
          <circle cx="196" cy="14" r="5" fill="#FFD400" stroke="#14120F" strokeWidth="4" />
        </g>

        {/* body */}
        <rect x="20" y="58" width="200" height="106" rx="16" fill="#FF2E7E" stroke="#14120F" strokeWidth="7" />

        {/* left speaker */}
        <circle cx="66" cy="112" r="36" fill="#FFD400" stroke="#14120F" strokeWidth="6" />
        <circle cx="66" cy="112" r="22" fill="#2E4BFF" stroke="#14120F" strokeWidth="5" />
        <circle cx="66" cy="112" r="8"  fill="#14120F" />

        {/* right speaker */}
        <circle cx="174" cy="112" r="36" fill="#FFD400" stroke="#14120F" strokeWidth="6" />
        <circle cx="174" cy="112" r="22" fill="#2E4BFF" stroke="#14120F" strokeWidth="5" />
        <circle cx="174" cy="112" r="8"  fill="#14120F" />

        {/* cassette window tengah */}
        <rect x="102" y="80" width="36" height="26" rx="4" fill="#FAF7F0" stroke="#14120F" strokeWidth="5" />
        <circle cx="112" cy="93" r="6" fill="none" stroke="#14120F" strokeWidth="3" />
        <circle cx="128" cy="93" r="6" fill="none" stroke="#14120F" strokeWidth="3" />

        {/* tombol kontrol */}
        <rect x="102" y="140" width="10" height="10" rx="2" fill="#14120F" />
        <rect x="116" y="140" width="10" height="10" rx="2" fill="#FAF7F0" stroke="#14120F" strokeWidth="3" />
        <rect x="130" y="140" width="10" height="10" rx="2" fill="#14120F" />
      </svg>

      {/* Cassette tape -- diam, tapi reel-nya beneran muter (fungsional, bukan cuma ngambang) */}
      <svg
        viewBox="0 0 100 66"
        className="absolute hidden sm:block"
        style={{
          width: 'min(16vw, 140px)',
          right: '30%',
          bottom: '14%',
          transform: 'rotate(8deg)',
        }}
      >
        <rect x="4" y="4" width="92" height="58" rx="8" fill="#FAF7F0" stroke="#14120F" strokeWidth="6" />
        <rect x="16" y="18" width="68" height="20" rx="3" fill="none" stroke="#14120F" strokeWidth="4" />
        <circle className="reel" cx="34" cy="28" r="8" fill="none" stroke="#14120F" strokeWidth="4" strokeDasharray="4 3" />
        <circle className="reel" cx="66" cy="28" r="8" fill="none" stroke="#14120F" strokeWidth="4" strokeDasharray="4 3" />
        <path d="M20 50 L80 50" stroke="#FF2E7E" strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* satu bintang komik -- aksen kecil, bukan cluster */}
      <svg
        viewBox="0 0 40 40"
        className="absolute hidden sm:block"
        style={{ width: 22, right: '10%', top: '48%', animation: 'hero-spin-slow 8s linear infinite' }}
      >
        <path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="#14120F" />
      </svg>
    </div>
  )
}
