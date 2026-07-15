# EGAX Studios

Fashion e-commerce built with Next.js 15, Tailwind CSS, Framer Motion, Zustand, React Three Fiber + Rapier.

## Requirements
- Node.js v18+
- npm v9+

## Setup
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

⚠️ Project ini sekarang pakai React Three Fiber + Rapier untuk 3D hero (lihat `components/three/`). Setelah pull, **wajib** `npm install` ulang karena ada dependency baru: `three@^0.184`, `@react-three/fiber@^9.6` (bukan v8 — v8 itu khusus React 18 dan akan bikin ERESOLVE error karena project ini React 19), `@react-three/rapier@^2.1` (bukan v1, yang masih nargetin fiber v8/React 18).

**Kalau kamu pernah install versi sebelumnya yang masih ada `@react-three/drei`**: jalankan `npm install` lagi setelah pull untuk membersihkannya — drei sudah dihapus dari dependency karena fitur `Environment`/HDRI yang dipakainya (download environment map dari CDN eksternal) terbukti jadi kandidat kuat penyebab `THREE.WebGLRenderer: Context Lost`. Hero sekarang pakai lighting manual (ambient + directional + point light) yang tidak depend ke resource eksternal apa pun, lebih ringan dan lebih stabil.

Kalau masih kena `ERESOLVE unable to resolve dependency tree` setelah ini, cek dulu `npm ls react` buat pastiin cuma ada satu versi React di tree, lalu `npm install` lagi. Sebagai jalan darurat (bukan solusi utama) bisa pakai `npm install --legacy-peer-deps`.

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
- `/product/[slug]` — Product detail
- `/checkout` — Checkout simulation (QRIS, E-Wallet, Virtual Account)
- `/pos` — POS kasir (PIN-gated, terpisah dari admin)
- `/editorial` — Editorial lookbook
- `/gallery` — Photo gallery
- `/about` — Brand story
- `/contact` — Contact form
- `/account` — Login / Register
- `/account/orders` — Order history
- `/account/wishlist` — Wishlist
- `/admin` — Admin dashboard

## Features
- Dark editorial aesthetic dengan 3D abstract fragmented geometry di hero (React Three Fiber + Rapier, lazy-mount via IntersectionObserver, fallback statis untuk device tanpa WebGL atau saat WebGL context loss terjadi, lighting manual tanpa dependency ke environment map/CDN eksternal)
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
- White background product sections (YB LABS inspired)
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
