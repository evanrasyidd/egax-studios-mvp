# EGAX Studios

Fashion e-commerce built with Next.js 15, Tailwind CSS, GSAP/ScrollTrigger, Zustand.

**Design language:** minimal archive / specimen catalogue. Monochrome paper #FAFAF8, ink #111111, hairline rules, no decorative shadows. Archivo untuk display/body, IBM Plex Mono untuk label teknis, angka, dan spesifikasi. Signature: technical flat garmen (SVG) di plate bernomor, bukan foto stock. Semua produk punya flat sendiri per kategori (chore, trucker, flannel, chino, jeans, beanie, cap, tote, socks).

## Requirements
- Node.js v18+
- npm v9+

## Setup
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Env opsional: `NEXT_PUBLIC_SITE_URL` (domain production) dipakai `app/sitemap.js` & `app/robots.js`. Kalau tidak di-set, fallback ke `https://egax-studios.vercel.app`.

> Catatan: dependency Three.js (`three`, `@react-three/fiber`, `@react-three/rapier`) sudah dihapus karena 3D scene hero tidak pernah di-mount dan jadi dead code. Kalau suatu saat 3D dibutuhkan lagi, tinggal install ulang — versi yang dipakai sebelumnya: `three@^0.185`, `@react-three/fiber@^9.6` (khusus React 19, bukan v8), `@react-three/rapier@^2.2`.

## Admin Access
`/admin` sekarang ada di balik login gate (username + password) -- akun yang tidak ada di Staff Management tidak bisa masuk sama sekali.

**Kredensial admin default (seed awal, ganti setelah deploy):**
- Username: `admin`
- Password: `egax2026`
- URL: `/admin`

Setelah login pertama kali, kamu bisa tambah admin lain atau kasir baru lewat menu **Staff** di sidebar admin (`/admin/staff`). Admin baru login pakai username+password seperti di atas; kasir baru login pakai PIN saja (cukup ketik PIN di `/pos`, sistem otomatis cocokkan ke nama kasirnya -- tidak perlu pilih nama manual).

Catatan keamanan: sistem tidak akan membiarkan satu-satunya admin aktif dihapus atau dinonaktifkan (siapa pun akunnya, bukan cuma akun default) — supaya tidak ada yang ke-lock out dari panel sendiri. Begitu ada admin lain yang aktif, akun default ini juga bisa dihapus/diganti seperti akun lainnya.

⚠️ **Kalau kamu pernah pakai versi project ini SEBELUM password/PIN di-hash** (localStorage browser kamu masih punya data lama), **wajib clear localStorage dulu** sebelum pakai versi ini: buka DevTools &rarr; Application &rarr; Local Storage &rarr; hapus semua key yang diawali `egax-` (terutama `egax-staff`, `egax-admin-auth`, `egax-pos`), lalu refresh. Tanpa ini, staff yang dibuat di versi lama tidak akan bisa login lagi karena field credential-nya berubah format (dari plaintext `password`/`pin` jadi `passwordHash`/`pinHash` + salt).

Soal keamanan credential: password admin dan PIN kasir sekarang disimpan sebagai **hash SHA-256 + salt** (lihat `lib/staffCrypto.js`), bukan plaintext. Login juga tidak lagi bisa di-bypass cuma dengan mengetik `isLoggedIn: true` di console DevTools — ada session token yang di-derive dari hash credential staff dan diverifikasi ulang secara periodik. Tetap penting dipahami: ini auth client-side tanpa backend asli, jadi levelnya cukup untuk demo/portfolio, bukan pengganti auth server-side untuk data yang benar-benar sensitif.

## POS Kasir
- URL: `/pos` (standalone, login terpisah dari `/admin` — pakai PIN, bukan username/password)
- **PIN kasir demo default: `482917`** (nama: "Kasir Demo") — sudah ada di seed awal, bisa langsung dicoba
- Kasir login cukup ketik PIN-nya saja; sistem otomatis mencocokkan ke nama kasir yang sesuai (PIN dijamin unik antar kasir aktif)
- Admin bisa tambah kasir lain lewat **Staff &rarr; Tambah Staff &rarr; Kasir** (isi nama + PIN 4-6 digit)
- Kalau kasir dinonaktifkan/dihapus dari Staff Management, sesi yang sedang login otomatis logout dalam beberapa detik (auto-revalidasi)
- Akses cepat juga tersedia lewat sidebar admin (tombol "POS Kasir")

## Pages
- `/` — Homepage
- `/catalog` — Product catalog with filter & sort
- `/product/[slug]` — Product detail (spec sheet + size guide)
- `/compare` — Compare up to 4 products side-by-side
- `/checkout` — Checkout simulation (QRIS, E-Wallet, Virtual Account, voucher code)
- `/pos` — POS kasir (PIN-gated, terpisah dari admin, print struk)
- `/editorial` — Editorial lookbook
- `/gallery` — Archive / contact sheet
- `/about` — Brand story
- `/contact` — Contact form
- `/policies` — Refund, shipping, privacy, terms, legal, cookies
- `/account` — Login / Register
- `/account/orders` — Order history + tracking timeline
- `/account/wishlist` — Wishlist
- `/admin` — Admin dashboard
- `/admin/vouchers` — Kelola promo code (admin)

## Features
- Hero archive catalogue: headline Archivo besar (WEAR / EVERYDAY.) + kartu spesimen bernomor (Nº serial, technical flat, nama, harga)
- Technical flat SVG per produk: front view, detail crop, dan woven label view di halaman produk
- GSAP motion: hanging tag preloader, hero entrance/scroll-out, section heading mask reveal, scroll-reactive index strip, horizontal scrub reel, sequential archive stack, footer wordmark cascade, product gallery view transition, cart line stagger, search/mega menu entrance
- Reduced-motion fallback untuk semua momen besar: reel jadi native horizontal scroll, stack jadi tumpukan statis, semua pin/scrub mati
- Sticky navbar dengan mega menu Catalog yang bisa hover, klik, dan keyboard
- Mobile menu fullscreen dengan focus trap, Escape, dan close button
- Cart drawer dan search modal dengan role dialog, focus trap, Escape, dan focus restore
- Wishlist dan compare tersedia di product card (bukan hover-only)
- Checkout simulation ala payment gateway: QRIS (pseudo-QR visual), E-Wallet (GoPay/OVO/Dana), Virtual Account (BCA/BNI/Mandiri), state machine waiting → checking → success/failed
- 15-minute payment countdown
- Order history dengan tanggal ISO timestamp, timeline status, dan modal detail
- Admin panel (products, orders, staff, users, vouchers) dengan revenue chart dari data order asli
- POS kasir standalone dengan PIN auth, cart terpisah, dan print struk
- 24 produk di 6 kategori, semua memakai technical flat yang konsisten
- Halaman produk SSG (24 slug), metadata per produk, canonical, dan JSON-LD `Product`
- Open Graph image dinamis di `/opengraph-image`
- Storefront responsive di 320, 375, 390, 768, 1024, 1440
- Fokus keyboard, skip link, kontras AA, label form, dan touch target 44px

## Known limitations / next steps
- Visual produk saat ini technical flat, bukan foto. Kalau foto asli tersedia, ganti `GarmentPlate` di gallery/card dengan `next/image` dan simpan foto di `product.images`. Plate tetap bisa dipakai sebagai fallback.
- Semua data (cart, order, staff, produk) hidup di localStorage. Ini demo/portfolio, bukan backend commerce.
- Produk yang ditambahkan lewat admin dashboard tidak masuk `generateStaticParams` dan sitemap. Mereka tetap bisa dibuka lewat dynamic params, tapi metadata/SEO-nya memakai fallback.
- Belum ada payment gateway asli; semua status pembayaran disimulasikan.
- Belum ada automated browser test untuk checkout dan auth. Kalau project naik ke produksi, tambahkan smoke test (Playwright) untuk alur cart → checkout → order dan login admin/POS.

## Security Notes
Audit yang sudah dilakukan terhadap project ini:
- **`.gitignore`** sudah ada (sebelumnya tidak ada sama sekali) — `node_modules`, `.next`, dan file `.env*` tidak akan ke-commit
- **Tidak ada API key/secret pihak ketiga** yang ke-hardcode di kode manapun (sudah di-scan pattern Stripe/Google/AWS/GitHub/Supabase)
- **Tidak ada endpoint API publik** — sebelumnya ada `/api/mock-payment` yang dead code (tidak dipanggil dari manapun) dan publicly exposed tanpa rate-limit, sudah dihapus. Semua fitur (checkout, POS, auth) berjalan client-side, tidak ada permukaan API untuk di-spam/DDoS
- **`dangerouslySetInnerHTML` hanya dipakai untuk JSON-LD produk** di server component (`app/(shop)/product/[slug]/page.js`), isinya `JSON.stringify` dari data statis `constants/products.js`, bukan input user. Tidak ada `eval`.
- **Password admin & PIN kasir disimpan sebagai hash SHA-256 + salt** (`lib/staffCrypto.js`), bukan plaintext — localStorage tidak lagi membocorkan credential asli kalau dibuka lewat DevTools
- **Session token** untuk login admin/kasir di-derive dari hash credential staff, bukan boolean polos — mencegah bypass login dengan mengetik `isLoggedIn: true` langsung di console

Batasan yang tetap berlaku (karakteristik dasar SPA tanpa backend, bukan bug):
- Semua "auth" di project ini adalah **client-side only** — validasinya berjalan di browser, jadi levelnya cukup untuk demo/portfolio, bukan pengganti backend auth sungguhan untuk data yang benar-benar sensitif
- Siapa pun dengan akses fisik/devtools ke browser yang sedang login bisa membaca state aplikasi saat itu juga (ini berlaku untuk semua SPA berbasis localStorage, bukan spesifik ke project ini)
- Payment (QRIS/E-Wallet/VA) adalah simulasi murni, tidak terhubung gateway pembayaran asli — sesuai desain awal project ini
