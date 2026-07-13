# EGAX Studios

> Built in the Dark. Worn in the Streets.

Platform e-commerce streetwear dark editorial untuk brand EGAX Studios. Dibangun sebagai satu aplikasi Next.js yang menggabungkan customer-facing shop, admin dashboard, dan POS kasir — tanpa database eksternal, semua state persisted di localStorage via Zustand.

---

## Fitur

### Customer Shop
- **Homepage** — hero section, pre-order banner, new collection, featured collection, bestseller, editorial banner, social CTA, newsletter
- **Catalog** — browsing produk dengan filter kategori dan mega menu
- **Product Detail** (`/product/[slug]`) — pilih ukuran, tambah ke cart, recently viewed
- **Cart** — slide panel, update qty, remove item, persistent antar sesi
- **Wishlist** — simpan produk favorit, persistent via localStorage
- **Checkout** — pilih metode pengiriman, simulasi payment (QRIS / Virtual Account BCA/BNI/Mandiri)
- **Checkout Success** — halaman konfirmasi dengan order ID
- **Account** — profil, riwayat pesanan, wishlist, alamat tersimpan, settings
- **Editorial** — lookbook & artikel brand
- **Gallery** — foto koleksi
- **About & Contact** — halaman brand

### Admin Dashboard (`/admin`)
- Login dengan username + password, session token di-derive dari hash credential (SHA-256 + salt)
- Manajemen produk — tambah, edit, hapus, toggle sold out / pre-order
- Kelola pesanan customer — lihat semua order, update status
- Manajemen user — lihat daftar customer, ban/unban
- Manajemen staff — tambah/edit/hapus admin & kasir, set password/PIN (tersimpan sebagai hash, bukan plaintext)

### POS Kasir (`/pos`)
- Login via PIN (tanpa username) — sistem mencocokkan PIN ke kasir aktif
- Cart kasir terpisah dari cart customer
- Simulasi transaksi langsung di kasir

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript (JSConfig path alias) |
| Styling | Tailwind CSS v3 |
| Animasi | Framer Motion 11 |
| State Management | Zustand 5 (persist middleware) |
| 3D / WebGL | Three.js + React Three Fiber + Rapier |
| Icons | Lucide React |

### Typography
- `Press Start 2P` — pixel display (`--font-pixel`)
- `Bebas Neue` — heading display (`--font-display`)
- `Inter` — body text (`--font-body`)

### Palet Warna
| Token | Hex | Penggunaan |
|---|---|---|
| `bg` | `#0A0A0A` | Background utama |
| `surface` | `#141414` | Card/panel |
| `card` | `#1B1B1B` | Nested card |
| `accent` | `#540A21` | Aksen merah gelap |
| `pink` | `#FF2D9B` | Highlight/CTA |
| `text1` | `#F5F5F3` | Teks primer |
| `text2` | `#A1A1AA` | Teks sekunder |

---

## Struktur Folder

```
app/
├── (root)/                     # Customer-facing pages dengan shared layout (Navbar + Footer)
│   ├── page.js                 # Homepage
│   ├── catalog/                # Halaman katalog produk
│   ├── product/[slug]/         # Halaman detail produk
│   ├── editorial/              # Editorial / lookbook
│   ├── gallery/                # Galeri foto
│   ├── about/                  # Halaman about brand
│   └── contact/                # Halaman kontak
├── (shop)/                     # Halaman shop dengan layout berbeda
│   ├── checkout/               # Halaman checkout
│   └── checkout/success/       # Halaman konfirmasi order
├── account/                    # Dashboard customer (profil, pesanan, wishlist, alamat)
├── admin/                      # Admin dashboard (protected)
│   ├── page.js                 # Overview admin
│   ├── orders/                 # Manajemen pesanan
│   ├── products/               # Manajemen produk
│   ├── staff/                  # Manajemen staff
│   └── users/                  # Manajemen customer
├── pos/                        # POS kasir (protected via PIN)
└── layout.js                   # Root layout (font, StoreHydration)

components/
├── account/                    # Komponen halaman account
├── admin/                      # Komponen admin dashboard
├── cart/                       # Cart slide panel & item
├── checkout/                   # Form checkout, payment modal
├── layout/                     # Navbar, Footer, shared layout
├── pos/                        # Interface POS kasir
├── product/                    # Product card, detail, size picker
├── providers/                  # StoreHydration provider
├── search/                     # Search overlay
├── sections/                   # Homepage sections
├── three/                      # 3D scene (FragmentScene + lazy + fallback)
└── ui/                         # Komponen UI reusable

store/
├── authStore.js                # State auth customer (email login)
├── adminAuthStore.js           # State auth admin (username+password, session token)
├── adminStore.js               # State data admin (produk, banned users)
├── cartStore.js                # Cart customer (persist localStorage)
├── orderStore.js               # Riwayat order customer
├── posStore.js                 # Session & cart kasir POS
├── staffStore.js               # Data seluruh staff (admin + kasir), hash credential
├── uiStore.js                  # UI state (cart open, search open, menu open)
└── wishlistStore.js            # Wishlist customer

lib/
├── mockAuth.js                 # Simulasi login/register customer (in-memory array)
├── mockPayment.js              # Simulasi QRIS + VA payment + delay + failure rate
├── staffCrypto.js              # Hash SHA-256+salt, verifyCredential, deriveSessionToken
└── utils.js                    # Utilities umum

constants/
├── products.js                 # Data produk seed
├── categories.js               # Daftar kategori & nav links
├── editorial.js                # Konten editorial
└── lookbook.js                 # Data lookbook/gallery

hooks/
├── useAuth.js                  # Hook customer auth
├── useCart.js                  # Hook cart
├── useHydrated.js              # Guard SSR hydration mismatch + trigger seed hashing
├── useRecentlyViewed.js        # Produk terakhir dilihat
├── useSearch.js                # Search logic
├── useStaffSessionGuard.js     # Re-verify session staff saat mount (auto-logout kalau invalid)
└── useWishlist.js              # Hook wishlist
```

---

## Arsitektur State

Semua state disimpan di Zustand dengan `persist` middleware (localStorage). Tidak ada API route, tidak ada database.

| Store | Persist Key | Keterangan |
|---|---|---|
| `authStore` | `egax-auth` | Session customer |
| `adminAuthStore` | `egax-admin-auth` | Session admin |
| `adminStore` | `egax-admin` | Data produk & banned users |
| `cartStore` | `egax-cart` | Cart customer |
| `orderStore` | `egax-orders` | Riwayat order |
| `posStore` | `egax-pos` | Session & cart kasir |
| `staffStore` | `egax-staff` | Data staff + credential hash |
| `wishlistStore` | `egax-wishlist` | Wishlist customer |

Semua store menggunakan `skipHydration: true` dan di-rehydrate secara manual lewat `StoreHydration` provider — ini mencegah hydration mismatch antara server render dan client.

---

## Keamanan (Client-side Auth)

Project ini tidak punya backend, jadi auth berjalan sepenuhnya di client. Beberapa lapisan yang dipasang:

**Credential hashing** (`lib/staffCrypto.js`): Password admin dan PIN kasir tidak disimpan plaintext di localStorage. Yang tersimpan adalah `hash + salt` (SHA-256 via Web Crypto API). Membuka DevTools → Application → Local Storage tidak akan membocorkan password/PIN asli.

**Session token derivasi** (`deriveSessionToken`): Token sesi di-derive dari `staffId + credentialHash`. Mengetik `isLoggedIn: true` langsung di localStorage tidak cukup — `verifySession()` di `adminAuthStore` dan `posStore` akan mencocokkan token terhadap hash staff aktif. Token otomatis invalid kalau password/PIN staff diganti.

**Auto-logout** (`useStaffSessionGuard`): Re-verifikasi sesi dijalankan setiap mount halaman protected. Sesi yang sudah tidak valid (staff dihapus/dinonaktifkan, credential berubah) akan di-logout otomatis.

> **Catatan jujur:** Ini bukan pengganti backend auth sungguhan. Source code bisa dibaca browser, dan logic bisa di-reverse-engineer dengan usaha. Proteksi ini cukup untuk konteks demo/portfolio — bukan untuk data yang benar-benar sensitif di production.

---

## Simulasi Payment

Diimplementasikan di `lib/mockPayment.js`:

- **QRIS** — generate string QRIS mock sesuai format standar QRIS Indonesia
- **Virtual Account** — generate nomor VA random dengan prefix bank (BCA `8277`, BNI `8887`, Mandiri `8998`)
- **Delay realistis** — 1.8–3.2 detik (simulasi polling webhook payment gateway)
- **Failure rate** — 4% kemungkinan gagal secara acak (saldo tidak cukup / koneksi bank)

---

## Kredensial Demo

| Role | Field | Value |
|---|---|---|
| Admin | Username | `admin` |
| Admin | Password | `egax2026` |
| Kasir | PIN | `482917` |
| Customer | Email | `admin@egaxstudios.com` |
| Customer | Password | `password123` |

Kredensial admin dan kasir di atas adalah seed default yang akan di-hash saat pertama kali app di-load. Bisa diganti lewat halaman `/admin/staff`.

---

## Setup & Development

```bash
# Clone repo
git clone https://github.com/evanrasyidd/egax-studios.git
cd egax-studios

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

| URL | Keterangan |
|---|---|
| `/` | Homepage |
| `/catalog` | Katalog produk |
| `/product/[slug]` | Detail produk |
| `/checkout` | Checkout |
| `/account` | Dashboard customer |
| `/admin` | Admin dashboard |
| `/pos` | POS kasir |

Tidak ada environment variable yang dibutuhkan — semua state berjalan lokal di browser.

---

## Deployment (Vercel)

```bash
npm run build
```

Push ke GitHub, connect di Vercel, deploy. Tidak ada environment variable yang perlu diset — tidak ada API eksternal.

**Catatan:** Karena state disimpan di localStorage, data tidak sinkron antar browser atau antar device. Setiap browser/tab baru mulai dari state awal (seed produk + seed staff).

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Jalankan production build lokal
npm run lint     # ESLint check
```

---

## Author

**Evan Rasyid Ega Pratama**
GitHub & Instagram: [@evanrasyidd](https://github.com/evanrasyidd)
