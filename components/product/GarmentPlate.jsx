'use client'
import { useId } from 'react'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'

/**
 * GarmentPlate — technical flat, bukan foto.
 * Satu viewBox 400x520 untuk semua kategori supaya proporsi konsisten.
 * Dipakai di hero, product card, gallery, cart, dan POS.
 */

const TONES = [
  { paper: '#F2F0E9', cloth: '#D8D3C6', shade: '#BFB9AA', stitch: '#4B4942', ink: '#141414' },
  { paper: '#EFEEE8', cloth: '#C7C3B8', shade: '#AEA99D', stitch: '#45433D', ink: '#141414' },
  { paper: '#F4F2EC', cloth: '#A8A59C', shade: '#8D8A82', stitch: '#33322E', ink: '#141414' },
  { paper: '#EDEBE4', cloth: '#8A877F', shade: '#706E67', stitch: '#F3F1EA', ink: '#141414' },
  { paper: '#F1EFE8', cloth: '#6B6963', shade: '#54524D', stitch: '#F3F1EA', ink: '#141414' },
  { paper: '#F5F3ED', cloth: '#4A4843', shade: '#33322F', stitch: '#F3F1EA', ink: '#141414' },
]

const CODES = {
  Jacket: 'JK',
  Tops: 'TP',
  Shirt: 'SH',
  Pants: 'PN',
  Essentials: 'ES',
  Accessories: 'AC',
}

const serialOf = (name = '') =>
  String([...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7)).padStart(4, '0')

function resolveKind(product) {
  const name = (product?.name || '').toLowerCase()
  const category = product?.category
  if (category === 'Jacket') return name.includes('trucker') ? 'trucker' : 'chore'
  if (category === 'Shirt') return name.includes('mini check') ? 'shirtShort' : 'shirtLong'
  if (category === 'Tops') return name.includes('longsleeve') ? 'teeLong' : 'teeShort'
  if (category === 'Pants') {
    if (name.includes('work') || name.includes('double-front')) return 'pantsWork'
    if (name.includes('jeans') || name.includes('denim')) return 'pantsJeans'
    return 'pantsChino'
  }
  if (category === 'Accessories') {
    if (name.includes('beanie')) return 'beanie'
    if (name.includes('cap')) return 'cap'
    if (name.includes('tote')) return 'tote'
  }
  if (category === 'Essentials') return name.includes('sock') ? 'socks' : 'teeShort'
  return 'teeShort'
}

const NOTES = {
  chore: [
    { x: 158, y: 192, tx: 16, ty: 176, anchor: 'start', label: 'CHEST POCKET' },
    { x: 200, y: 352, tx: 16, ty: 344, anchor: 'start', label: '4-HOLE BUTTON' },
    { x: 272, y: 158, tx: 384, ty: 148, anchor: 'end', label: 'YOKE SEAM' },
    { x: 286, y: 428, tx: 384, ty: 444, anchor: 'end', label: 'DOUBLE STITCH' },
  ],
  trucker: [
    { x: 152, y: 200, tx: 16, ty: 188, anchor: 'start', label: 'FLAP POCKET' },
    { x: 200, y: 340, tx: 16, ty: 332, anchor: 'start', label: 'SHANK BUTTON' },
    { x: 268, y: 158, tx: 384, ty: 148, anchor: 'end', label: 'YOKE SEAM' },
    { x: 200, y: 400, tx: 384, ty: 412, anchor: 'end', label: 'WAISTBAND' },
  ],
  shirtLong: [
    { x: 170, y: 126, tx: 16, ty: 118, anchor: 'start', label: 'POINT COLLAR' },
    { x: 160, y: 220, tx: 16, ty: 212, anchor: 'start', label: 'PATCH POCKET' },
    { x: 288, y: 300, tx: 384, ty: 292, anchor: 'end', label: 'SIDE SEAM' },
    { x: 260, y: 424, tx: 384, ty: 436, anchor: 'end', label: 'CURVED HEM' },
  ],
  shirtShort: [
    { x: 170, y: 126, tx: 16, ty: 118, anchor: 'start', label: 'POINT COLLAR' },
    { x: 160, y: 220, tx: 16, ty: 212, anchor: 'start', label: 'PATCH POCKET' },
    { x: 292, y: 232, tx: 384, ty: 224, anchor: 'end', label: 'SHORT SLEEVE' },
    { x: 260, y: 424, tx: 384, ty: 436, anchor: 'end', label: 'CURVED HEM' },
  ],
  teeShort: [
    { x: 200, y: 134, tx: 16, ty: 124, anchor: 'start', label: 'RIB NECK' },
    { x: 116, y: 196, tx: 16, ty: 188, anchor: 'start', label: 'DROP SHOULDER' },
    { x: 284, y: 300, tx: 384, ty: 292, anchor: 'end', label: 'SIDE SEAM' },
    { x: 260, y: 420, tx: 384, ty: 432, anchor: 'end', label: 'TWIN NEEDLE HEM' },
  ],
  teeLong: [
    { x: 200, y: 134, tx: 16, ty: 124, anchor: 'start', label: 'RIB NECK' },
    { x: 116, y: 196, tx: 16, ty: 188, anchor: 'start', label: 'DROP SHOULDER' },
    { x: 108, y: 372, tx: 16, ty: 364, anchor: 'start', label: 'RIB CUFF' },
    { x: 284, y: 300, tx: 384, ty: 292, anchor: 'end', label: 'SIDE SEAM' },
  ],
  pantsWork: [
    { x: 152, y: 108, tx: 16, ty: 100, anchor: 'start', label: 'BELT LOOP' },
    { x: 244, y: 144, tx: 384, ty: 136, anchor: 'end', label: 'COIN POCKET' },
    { x: 168, y: 326, tx: 16, ty: 318, anchor: 'start', label: 'KNEE PANEL' },
    { x: 252, y: 470, tx: 384, ty: 462, anchor: 'end', label: 'HEM STITCH' },
  ],
  pantsChino: [
    { x: 152, y: 108, tx: 16, ty: 100, anchor: 'start', label: 'BELT LOOP' },
    { x: 138, y: 150, tx: 16, ty: 142, anchor: 'start', label: 'SLANT POCKET' },
    { x: 232, y: 330, tx: 384, ty: 322, anchor: 'end', label: 'CREASE' },
    { x: 252, y: 470, tx: 384, ty: 462, anchor: 'end', label: 'HEM STITCH' },
  ],
  pantsJeans: [
    { x: 152, y: 108, tx: 16, ty: 100, anchor: 'start', label: 'BELT LOOP' },
    { x: 244, y: 144, tx: 384, ty: 136, anchor: 'end', label: 'COIN POCKET' },
    { x: 138, y: 150, tx: 16, ty: 142, anchor: 'start', label: 'RIVET' },
    { x: 252, y: 470, tx: 384, ty: 462, anchor: 'end', label: 'CHAIN STITCH' },
  ],
  beanie: [
    { x: 200, y: 150, tx: 16, ty: 144, anchor: 'start', label: 'CROWN SEAM' },
    { x: 150, y: 260, tx: 16, ty: 252, anchor: 'start', label: 'RIB KNIT' },
    { x: 250, y: 320, tx: 384, ty: 312, anchor: 'end', label: 'FOLDED CUFF' },
    { x: 200, y: 324, tx: 384, ty: 352, anchor: 'end', label: 'WOVEN LABEL' },
  ],
  cap: [
    { x: 200, y: 150, tx: 16, ty: 144, anchor: 'start', label: '6-PANEL CROWN' },
    { x: 176, y: 196, tx: 16, ty: 188, anchor: 'start', label: 'EYELET' },
    { x: 244, y: 220, tx: 384, ty: 212, anchor: 'end', label: 'WOVEN PATCH' },
    { x: 250, y: 284, tx: 384, ty: 300, anchor: 'end', label: 'CURVED BRIM' },
  ],
  tote: [
    { x: 170, y: 150, tx: 16, ty: 142, anchor: 'start', label: 'CANVAS HANDLE' },
    { x: 200, y: 286, tx: 384, ty: 278, anchor: 'end', label: 'INSIDE POCKET' },
    { x: 220, y: 420, tx: 384, ty: 434, anchor: 'end', label: 'REINFORCED BASE' },
    { x: 200, y: 232, tx: 16, ty: 224, anchor: 'start', label: 'WOVEN LABEL' },
  ],
  socks: [
    { x: 186, y: 174, tx: 16, ty: 166, anchor: 'start', label: 'RIB CUFF' },
    { x: 220, y: 360, tx: 384, ty: 352, anchor: 'end', label: 'CUSHIONED SOLE' },
    { x: 214, y: 300, tx: 384, ty: 292, anchor: 'end', label: 'EMBROIDERED LOGO' },
  ],
}

function garmentPaths(kind) {
  switch (kind) {
    case 'chore':
      return {
        body: 'M158 112 L122 120 L86 152 L62 244 L98 256 L110 212 L110 418 Q110 436 128 436 L272 436 Q290 436 290 418 L290 212 L302 256 L338 244 L314 152 L278 120 L242 112 L200 146 Z',
        render: ({ cloth, shade, stitch, ink }) => (
          <>
            <path d="M122 152 Q200 170 278 152" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4" />
            <path d="M200 146 L200 436" fill="none" stroke={ink} strokeWidth="1.4" />
            {[178, 222, 266, 310, 354, 398].map((y) => (
              <g key={y}>
                <circle cx="200" cy={y} r="3.4" fill={shade} stroke={ink} strokeWidth="1.2" />
                <circle cx="200" cy={y} r="1.1" fill={ink} />
              </g>
            ))}
            <rect x="126" y="184" width="62" height="62" fill={shade} stroke={ink} strokeWidth="1.5" />
            <path d="M126 198 Q157 206 188 198" fill="none" stroke={ink} strokeWidth="1.1" />
            <rect x="212" y="184" width="62" height="62" fill={shade} stroke={ink} strokeWidth="1.5" />
            <path d="M212 198 Q243 206 274 198" fill="none" stroke={ink} strokeWidth="1.1" />
            <path d="M118 300 L186 300 L186 376 L118 376 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M118 300 L186 326" fill="none" stroke={ink} strokeWidth="1.1" />
            <path d="M214 300 L282 300 L282 376 L214 376 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M214 300 L282 326" fill="none" stroke={ink} strokeWidth="1.1" />
            <path d="M110 212 L110 418 M290 212 L290 418" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M86 152 L110 212 M314 152 L290 212" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M62 244 L98 256 M338 244 L302 256" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M112 420 L288 420" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
            <rect x="184" y="152" width="32" height="14" fill="none" stroke={ink} strokeWidth="0.9" />
            <path d="M188 156 L212 156 M188 160 L208 160" fill="none" stroke={ink} strokeWidth="0.7" />
          </>
        ),
      }
    case 'trucker':
      return {
        body: 'M160 112 L124 120 L88 154 L68 238 L102 250 L112 208 L112 400 L158 406 L200 412 L242 406 L288 400 L288 208 L298 250 L332 238 L312 154 L276 120 L240 112 L200 144 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M124 152 Q200 176 276 152" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4" />
            <path d="M112 392 L288 392 M112 406 L288 406" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M200 144 L200 412" fill="none" stroke={ink} strokeWidth="1.4" />
            {[176, 218, 260, 302, 344].map((y) => (
              <circle key={y} cx="200" cy={y} r="3.3" fill={shade} stroke={ink} strokeWidth="1.2" />
            ))}
            <path d="M160 112 L200 144 L184 156 L146 128 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M240 112 L200 144 L216 156 L254 128 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <rect x="128" y="182" width="58" height="54" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M128 182 L186 182 L186 198 L128 198 Z" fill={shade} stroke={ink} strokeWidth="1.3" />
            <circle cx="157" cy="190" r="2" fill={ink} />
            <rect x="214" y="182" width="58" height="54" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M214 182 L272 182 L272 198 L214 198 Z" fill={shade} stroke={ink} strokeWidth="1.3" />
            <circle cx="243" cy="190" r="2" fill={ink} />
            <path d="M128 220 L128 392 M272 220 L272 392" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M88 154 L112 208 M312 154 L288 208" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M68 238 L102 250 M332 238 L298 250" fill="none" stroke={ink} strokeWidth="1.2" />
          </>
        ),
      }
    case 'shirtLong':
      return {
        body: 'M164 112 L132 120 L96 154 L76 246 L108 256 L120 214 L120 414 Q120 434 140 434 L260 434 Q280 434 280 414 L280 214 L292 256 L324 246 L304 154 L268 120 L236 112 L200 140 Z',
        plaid: true,
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M164 112 L200 140 L186 154 L150 130 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M236 112 L200 140 L214 154 L250 130 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M200 140 L200 434" fill="none" stroke={ink} strokeWidth="1.3" />
            {[178, 216, 254, 292, 330, 368].map((y) => (
              <circle key={y} cx="200" cy={y} r="3" fill={shade} stroke={ink} strokeWidth="1.1" />
            ))}
            <rect x="136" y="190" width="52" height="58" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M136 204 L188 204" fill="none" stroke={ink} strokeWidth="1" />
            <path d="M120 214 L120 414 M280 214 L280 414" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M96 154 L120 214 M304 154 L280 214" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M76 246 L108 256 M324 246 L292 256" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M120 414 Q200 426 280 414" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
          </>
        ),
      }
    case 'shirtShort':
      return {
        body: 'M164 112 L132 120 L102 150 L88 228 L120 238 L130 208 L130 414 Q130 434 148 434 L252 434 Q270 434 270 414 L270 208 L280 238 L312 228 L298 150 L268 120 L236 112 L200 140 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M164 112 L200 140 L186 154 L150 130 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M236 112 L200 140 L214 154 L250 130 Z" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M200 140 L200 434" fill="none" stroke={ink} strokeWidth="1.3" />
            {[178, 216, 254, 292, 330, 368].map((y) => (
              <circle key={y} cx="200" cy={y} r="3" fill={shade} stroke={ink} strokeWidth="1.1" />
            ))}
            <rect x="146" y="190" width="50" height="56" fill={shade} stroke={ink} strokeWidth="1.4" />
            <path d="M88 228 L120 238 M312 228 L280 238" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M130 214 L130 414 M270 214 L270 414" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M130 414 Q200 426 270 414" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
          </>
        ),
      }
    case 'teeShort':
      return {
        body: 'M160 112 L128 120 L100 150 L88 230 L120 240 L130 208 L130 410 Q130 430 148 430 L252 430 Q270 430 270 410 L270 208 L280 240 L312 230 L300 150 L272 120 L240 112 L200 138 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M170 118 Q200 146 230 118" fill="none" stroke={ink} strokeWidth="1.8" />
            <path d="M170 126 Q200 152 230 126" fill="none" stroke={stitch} strokeWidth="1.1" strokeDasharray="3 3" />
            <path d="M100 150 L130 208 M300 150 L270 208" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M130 208 L130 410 M270 208 L270 410" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M130 414 L270 414" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
            <path d="M88 230 L120 240 M312 230 L280 240" fill="none" stroke={ink} strokeWidth="1.2" />
          </>
        ),
      }
    case 'teeLong':
      return {
        body: 'M160 112 L128 120 L100 150 L88 260 L100 386 L132 388 L136 300 L136 208 L136 410 Q136 430 152 430 L248 430 Q264 430 264 410 L264 208 L268 300 L272 388 L304 386 L316 260 L304 150 L272 120 L240 112 L200 138 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M170 118 Q200 146 230 118" fill="none" stroke={ink} strokeWidth="1.8" />
            <path d="M170 126 Q200 152 230 126" fill="none" stroke={stitch} strokeWidth="1.1" strokeDasharray="3 3" />
            <path d="M100 150 L136 208 M304 150 L264 208" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M136 208 L136 410 M264 208 L264 410" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M100 386 L132 388 M304 386 L272 388" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M136 414 L264 414" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
          </>
        ),
      }
    case 'pantsWork':
      return {
        body: 'M122 100 L278 100 L278 122 L268 470 Q267 482 256 482 L232 482 Q222 482 221 472 L200 218 L179 472 Q178 482 168 482 L144 482 Q133 482 132 470 L122 122 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M122 112 L278 112 M122 124 L278 124" fill="none" stroke={ink} strokeWidth="1.3" />
            {[136, 174, 226, 264].map((x) => (
              <rect key={x} x={x} y="100" width="7" height="24" fill={shade} stroke={ink} strokeWidth="1" />
            ))}
            <path d="M200 124 L200 200 Q218 208 218 232" fill="none" stroke={ink} strokeWidth="1.2" />
            <circle cx="200" cy="118" r="3.2" fill={shade} stroke={ink} strokeWidth="1.1" />
            <path d="M132 128 L158 176 M268 128 L242 176" fill="none" stroke={ink} strokeWidth="1.2" />
            <rect x="236" y="132" width="26" height="20" fill={shade} stroke={ink} strokeWidth="1.1" />
            <path d="M132 128 L140 470 M268 128 L260 470" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <rect x="144" y="296" width="50" height="74" fill="none" stroke={stitch} strokeWidth="1.1" strokeDasharray="5 4" />
            <rect x="206" y="296" width="50" height="74" fill="none" stroke={stitch} strokeWidth="1.1" strokeDasharray="5 4" />
            <path d="M140 470 L164 470 M236 470 L260 470" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 3" />
          </>
        ),
        outside: ({ ink }) => (
          <path d="M122 196 L104 196 L104 238 L122 238" fill="none" stroke={ink} strokeWidth="1.2" />
        ),
      }
    case 'pantsChino':
      return {
        body: 'M122 100 L278 100 L278 122 L268 470 Q267 482 256 482 L232 482 Q222 482 221 472 L200 218 L179 472 Q178 482 168 482 L144 482 Q133 482 132 470 L122 122 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M122 112 L278 112 M122 124 L278 124" fill="none" stroke={ink} strokeWidth="1.3" />
            {[136, 174, 226, 264].map((x) => (
              <rect key={x} x={x} y="100" width="7" height="24" fill={shade} stroke={ink} strokeWidth="1" />
            ))}
            <path d="M200 124 L200 200 Q218 208 218 232" fill="none" stroke={ink} strokeWidth="1.2" />
            <circle cx="200" cy="118" r="3.2" fill={shade} stroke={ink} strokeWidth="1.1" />
            <path d="M132 128 L158 176 M268 128 L242 176" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M132 128 L140 470 M268 128 L260 470" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M168 236 L166 470 M232 236 L234 470" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M140 470 L164 470 M236 470 L260 470" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 3" />
          </>
        ),
      }
    case 'pantsJeans':
      return {
        body: 'M122 100 L278 100 L278 122 L268 470 Q267 482 256 482 L232 482 Q222 482 221 472 L200 218 L179 472 Q178 482 168 482 L144 482 Q133 482 132 470 L122 122 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M122 112 L278 112 M122 124 L278 124" fill="none" stroke={ink} strokeWidth="1.3" />
            {[136, 174, 226, 264].map((x) => (
              <rect key={x} x={x} y="100" width="7" height="24" fill={shade} stroke={ink} strokeWidth="1" />
            ))}
            <path d="M200 124 L200 200 Q218 208 218 232" fill="none" stroke={ink} strokeWidth="1.2" />
            <circle cx="200" cy="118" r="3.2" fill={shade} stroke={ink} strokeWidth="1.1" />
            <path d="M132 128 L158 176 M268 128 L242 176" fill="none" stroke={ink} strokeWidth="1.2" />
            <rect x="236" y="132" width="26" height="20" fill={shade} stroke={ink} strokeWidth="1.1" />
            {[[136, 132], [264, 132], [160, 176], [240, 176]].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={shade} stroke={ink} strokeWidth="1" />
            ))}
            <path d="M132 128 L140 470 M268 128 L260 470" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M140 470 L164 470 M236 470 L260 470" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 3" />
          </>
        ),
      }
    case 'beanie':
      return {
        body: 'M142 262 Q142 156 200 142 Q258 156 258 262 L258 318 L142 318 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <rect x="136" y="296" width="128" height="56" fill={shade} stroke={ink} strokeWidth="1.4" />
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i} d={`M${144 + i * 10} 298 L${144 + i * 10} 350`} stroke={ink} strokeWidth="0.8" opacity="0.45" />
            ))}
            <path d="M200 142 L200 296" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M170 150 Q158 220 158 296 M230 150 Q242 220 242 296" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <rect x="176" y="308" width="48" height="20" fill="#F5F3ED" stroke={ink} strokeWidth="0.9" />
            <path d="M182 314 L218 314 M182 319 L210 319" fill="none" stroke={ink} strokeWidth="0.7" />
          </>
        ),
      }
    case 'cap':
      return {
        body: 'M132 262 Q132 156 200 146 Q268 156 268 262 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M200 146 L200 262" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <path d="M166 152 Q156 210 156 262 M234 152 Q244 210 244 262" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="5 4" />
            <circle cx="200" cy="146" r="4" fill={shade} stroke={ink} strokeWidth="1.1" />
            <circle cx="176" cy="196" r="2.2" fill="none" stroke={ink} strokeWidth="1" />
            <circle cx="224" cy="196" r="2.2" fill="none" stroke={ink} strokeWidth="1" />
            <rect x="176" y="212" width="48" height="30" fill="#F5F3ED" stroke={ink} strokeWidth="0.9" />
            <path d="M184 222 L216 222 M184 228 L210 228" fill="none" stroke={ink} strokeWidth="0.7" />
          </>
        ),
        outside: ({ shade, ink }) => (
          <path d="M120 262 Q200 292 280 262 Q282 300 200 312 Q118 300 120 262 Z" fill={shade} stroke={ink} strokeWidth="1.5" />
        ),
      }
    case 'tote':
      return {
        body: 'M132 188 L268 188 L280 444 L120 444 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            <path d="M132 200 L268 200" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="5 4" />
            <rect x="150" y="252" width="100" height="70" fill="none" stroke={stitch} strokeWidth="1.1" strokeDasharray="5 4" />
            <path d="M120 420 L280 420 M124 432 L276 432" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 3" />
            <rect x="180" y="220" width="40" height="24" fill={shade} stroke={ink} strokeWidth="0.9" />
            <path d="M186 228 L214 228 M186 233 L208 233" fill="none" stroke={ink} strokeWidth="0.7" />
          </>
        ),
        outside: ({ stitch, ink }) => (
          <>
            <path d="M158 188 Q158 110 200 110 Q242 110 242 188" fill="none" stroke={ink} strokeWidth="5" />
            <path d="M166 188 Q166 124 200 124 Q234 124 234 188" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="4 4" />
          </>
        ),
      }
    case 'socks':
      return {
        body: 'M110 150 L156 150 L156 330 Q156 348 174 348 L198 348 Q210 348 210 360 L210 382 Q210 394 198 394 L158 394 Q138 394 138 374 L138 206 L110 206 Z M190 150 L236 150 L236 330 Q236 348 254 348 L278 348 Q290 348 290 360 L290 382 Q290 394 278 394 L238 394 Q218 394 218 374 L218 206 L190 206 Z',
        render: ({ shade, stitch, ink }) => (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={`a${i}`} d={`M${114 + i * 8} 154 L${114 + i * 8} 202`} stroke={ink} strokeWidth="0.8" opacity="0.5" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={`b${i}`} d={`M${194 + i * 8} 154 L${194 + i * 8} 202`} stroke={ink} strokeWidth="0.8" opacity="0.5" />
            ))}
            <path d="M138 206 L110 206 M218 206 L190 206" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M138 374 Q150 382 158 394 M218 374 Q230 382 238 394" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="4 3" />
            <path d="M198 348 Q210 352 210 360 M278 348 Q290 352 290 360" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="4 3" />
            <path d="M114 178 L148 178 M194 178 L228 178" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M166 320 L196 320 M246 320 L276 320" fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="3 3" />
          </>
        ),
      }
    default:
      return garmentPaths('teeShort')
  }
}

export default function GarmentPlate({
  product,
  view = 'front',
  className,
  showMeta = true,
  showNotes = false,
  compact = false,
  marks = true,
}) {
  const reactId = useId()
  const uid = reactId.replace(/:/g, '')
  const { t, productName } = useI18n()
  const tone = TONES[(parseInt(product?.id?.replace('p', ''), 10) || 1) % TONES.length]
  const kind = resolveKind(product)
  const shape = garmentPaths(kind)
  const notes = NOTES[kind] || []
  const serial = serialOf(product?.name)
  const code = `${CODES[product?.category] || 'EG'}-${String((parseInt(product?.id?.replace('p', ''), 10) || 1)).padStart(2, '0')}`
  const fabric = (product?.fabric || '').split('·')[0].trim()
  const label = productName(product) || product?.name || 'EGAX garment'

  const hatchId = `hatch-${uid}`
  const clipId = `clip-${uid}`
  const gridId = `grid-${uid}`
  const detailClipId = `detail-${uid}`
  const colors = { cloth: tone.cloth, shade: tone.shade, stitch: tone.stitch, ink: tone.ink }

  const viewLabel = view === 'detail' ? t('plate.detail') : view === 'label' ? t('plate.label') : t('plate.front')

  return (
    <div
      role="img"
      aria-label={`${label}, ${t('plate.flat').toLowerCase()}`}
      className={cn('relative overflow-hidden', className)}
      style={{ background: tone.paper }}
    >
      <svg viewBox="0 0 400 520" className="block h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={tone.ink} strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={tone.ink} strokeWidth="0.7" opacity="0.18" />
          </pattern>
          <clipPath id={clipId}>
            <path d={shape.body} />
          </clipPath>
          <clipPath id={detailClipId}>
            <rect x="34" y="58" width="332" height="404" />
          </clipPath>
        </defs>

        {!compact && <rect width="400" height="520" fill={`url(#${gridId})`} />}

        {!compact && marks && (
          <g stroke={tone.ink} strokeWidth="1" opacity="0.45">
            <path d="M16 10 V22 M10 16 H22" />
            <path d="M384 10 V22 M378 16 H390" />
            <path d="M16 498 V510 M10 504 H22" />
            <path d="M384 498 V510 M378 504 H390" />
          </g>
        )}

        {view === 'label' ? (
          <g>
            <rect x="62" y="132" width="276" height="256" fill="#F7F5EF" stroke={tone.ink} strokeWidth="2" />
            <rect x="74" y="144" width="252" height="232" fill="none" stroke={tone.ink} strokeWidth="0.8" strokeDasharray="3 4" />
            <text x="200" y="186" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="16" fontWeight="600" letterSpacing="3" fill={tone.ink}>EGAX STUDIOS</text>
            <text x="200" y="214" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="10" letterSpacing="2" fill={tone.ink}>JAKARTA · SS 2026</text>
            <path d="M110 232 H290" stroke={tone.ink} strokeWidth="0.8" />
            <text x="200" y="262" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="11" fill={tone.ink}>{fabric || '100% COTTON'}</text>
            <text x="200" y="284" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="10" fill={tone.stitch}>MADE IN INDONESIA</text>
            <text x="110" y="318" fontFamily="var(--font-mono), monospace" fontSize="10" fill={tone.ink}>Nº {serial}</text>
            <text x="290" y="318" textAnchor="end" fontFamily="var(--font-mono), monospace" fontSize="10" fill={tone.ink}>{code}</text>
            <g fill={tone.ink}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <rect key={i} x={112 + i * 11} y="336" width={i % 3 === 0 ? 3 : 1.5} height={i % 4 === 0 ? 34 : 26} />
              ))}
            </g>
            <text x="200" y="392" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="2" fill={tone.ink}>EGAX-STD-{serial}</text>
          </g>
        ) : view === 'detail' ? (
          <g clipPath={`url(#${detailClipId})`}>
            <g transform="translate(200 260) scale(2.05) translate(-200 -260)">
              <path d={shape.body} fill={tone.cloth} stroke={tone.ink} strokeWidth="1.6" strokeLinejoin="round" />
              <path d={shape.body} fill={`url(#${hatchId})`} />
              <g clipPath={`url(#${clipId})`}>
                {shape.render(colors)}
              </g>
              {shape.outside?.(colors)}
            </g>
            <rect x="34" y="58" width="332" height="404" fill="none" stroke={tone.ink} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          </g>
        ) : (
          <>
            <path d={shape.body} fill={tone.cloth} stroke={tone.ink} strokeWidth="2" strokeLinejoin="round" />
            <path d={shape.body} fill={`url(#${hatchId})`} />
            {shape.plaid && (
              <g clipPath={`url(#${clipId})`}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <path key={`v${i}`} d={`M${60 + i * 38} 100 L${60 + i * 38} 450`} stroke={tone.ink} strokeWidth="0.7" opacity="0.16" />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <path key={`h${i}`} d={`M60 ${120 + i * 34} L340 ${120 + i * 34}`} stroke={tone.ink} strokeWidth="0.7" opacity="0.16" />
                ))}
              </g>
            )}
            <g clipPath={`url(#${clipId})`}>
              {shape.render(colors)}
            </g>
            {shape.outside?.(colors)}
            <path d={shape.body} fill="none" stroke={tone.ink} strokeWidth="2" strokeLinejoin="round" />
            {showNotes && notes.map((n, i) => (
              <g key={i}>
                <path d={`M${n.x} ${n.y} L${n.tx + (n.anchor === 'end' ? 4 : -4)} ${n.ty - 4}`} stroke={tone.ink} strokeWidth="0.8" opacity="0.7" />
                <circle cx={n.x} cy={n.y} r="2.6" fill="none" stroke={tone.ink} strokeWidth="1" />
                <text x={n.tx} y={n.ty} textAnchor={n.anchor} fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="0.6" fill={tone.ink}>{n.label}</text>
              </g>
            ))}
          </>
        )}
      </svg>

      {showMeta && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex items-start justify-between gap-3 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-text1">
            <span>Nº {serial}</span>
            <span>{code}</span>
          </div>
          <div className="flex items-end justify-between gap-3 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-text1">
            <span className="max-w-[60%] truncate">{fabric || label}</span>
            <span>{viewLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}
