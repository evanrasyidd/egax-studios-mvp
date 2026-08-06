# EGAX Studios

Fashion e-commerce built with Next.js 15, Tailwind CSS, Framer Motion, Zustand.

**Design language:** minimal archive / brutalist — putih-hitam monochrome (paper #FAFAF8, ink #111111), satu typeface Archivo untuk semua peran, tanpa shadow/dekorasi, hairline rules tipis, archive numbering (Nº serial produk, section 01–05). Signaturnya: hero archive catalog card (Nº + visual garmen + harga di atas putih).

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
- `/gallery` — Photo gallery
- `/about` — Brand story
- `/contact` — Contact form
- `/account` — Login / Register
- `/account/orders` — Order history + tracking timeline
- `/account/wishlist` — Wishlist
- `/admin` — Admin dashboard
- `/admin/vouchers` — Kelola promo code (admin)

## Features
- Hero archive catalog: headline grotesk hitam besar (WEAR / THE NOISE.) + kartu katalog bernomor (Nº serial, visual garmen di tone abu garment, nama & harga) sebagai signature element — semuanya tipografi/SVG, tanpa foto stock
- Sticky navbar with underline animation
- Mega menu dropdown (Catalog)
- Mobile fullscreen menu
- Cart drawer (Zustand + localStorage) dengan slide-in animation
- Wishlist (Zustand + localStorage)
- Search modal
- Checkout simulation ala payment gateway: QRIS (dengan pseudo-QR visual), E-Wallet (GoPay/OVO/Dana), Virtual Account (BCA/BNI/Mandiri) — masing-masing punya state machine waiting → checking → success/failed dengan kemungkinan gagal acak (realistis, bukan instant-success)
- 15-minute payment countdown
- Order history dengan tanggal ISO timestamp (akurat untuk sorting/analitik)
- Admin panel (products, orders, users) dengan dashboard revenue chart (mini bar chart 7 hari, dari data order asli)
- POS kasir standalone dengan PIN auth sendiri, cart kasir terpisah dari cart customer, dan transaksi otomatis tercatat ke order store yang sama dengan shop online (dibedakan lewat field `channel`)
- 25 mock products across 6 categories, masing-masing dengan representasi visual `GarmentIcon` per kategori (bukan foto asli — ganti ke foto produk real kapan saja sudah tersedia)
- Pre Order, New Collection, Featured, Best Seller sections
- Paper-white sections dengan hairline rules & archive numbering (01/02/03)
- Responsive: mobile, tablet, desktop

## Known limitations / next steps
- `CompleteTheFit` (related products di halaman produk) baca dari `constants/products.js` langsung, bukan `useAdminStore` — jadi tidak ikut update kalau admin edit/hapus produk dari dashboard
- Foto produk masih representasi `GarmentIcon`, bukan foto asli — ganti `product.images` dan render `<img>` begitu foto tersedia
- Belum ada store customer terpusat — daftar di `/admin/users` diturunkan dari `order.customer`, bukan tabel user sungguhan

## Security Notes
Audit yang sudah dilakukan terhadap project ini:
- **`.gitignore`** sudah ada (sebelumnya tidak ada sama sekali) — `node_modules`, `.next`, dan file `.env*` tidak akan ke-commit
- **Tidak ada API key/secret pihak ketiga** yang ke-hardcode di kode manapun (sudah di-scan pattern Stripe/Google/AWS/GitHub/Supabase)
- **Tidak ada endpoint API publik** — sebelumnya ada `/api/mock-payment` yang dead code (tidak dipanggil dari manapun) dan publicly exposed tanpa rate-limit, sudah dihapus. Semua fitur (checkout, POS, auth) berjalan client-side, tidak ada permukaan API untuk di-spam/DDoS
- **Tidak ada `dangerouslySetInnerHTML`/`eval`** di kode manapun
- **Password admin & PIN kasir disimpan sebagai hash SHA-256 + salt** (`lib/staffCrypto.js`), bukan plaintext — localStorage tidak lagi membocorkan credential asli kalau dibuka lewat DevTools
- **Session token** untuk login admin/kasir di-derive dari hash credential staff, bukan boolean polos — mencegah bypass login dengan mengetik `isLoggedIn: true` langsung di console

Batasan yang tetap berlaku (karakteristik dasar SPA tanpa backend, bukan bug):
- Semua "auth" di project ini adalah **client-side only** — validasinya berjalan di browser, jadi levelnya cukup untuk demo/portfolio, bukan pengganti backend auth sungguhan untuk data yang benar-benar sensitif
- Siapa pun dengan akses fisik/devtools ke browser yang sedang login bisa membaca state aplikasi saat itu juga (ini berlaku untuk semua SPA berbasis localStorage, bukan spesifik ke project ini)
- Payment (QRIS/E-Wallet/VA) adalah simulasi murni, tidak terhubung gateway pembayaran asli — sesuai desain awal project ini
