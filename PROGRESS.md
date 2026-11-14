# PROGRESS — EGAX Studios

## Catalogue refresh — technical flats, a11y, GSAP pass

- **Visual produk**: `GarmentIcon` diganti `GarmentPlate` (SVG technical flat 400x520). Ada front view, detail crop, dan label view. Dipakai di hero, product card, reel, cart, compare, POS, editorial, gallery.
- **Tipografi**: Archivo (display/body) + IBM Plex Mono (label teknis, angka, spesifikasi). Floor label 11px, body 13-14px.
- **Kontras**: `text2` digelapkan ke `#5F5F5F`; semua teks alpha `text-text2/xx` dihapus. Plate produk memakai band solid, bukan teks putih di abu.
- **Navbar mobile**: logo + search + cart + hamburger muat di 320-390px. EN/ID, account, compare pindah ke menu. Menu mobile punya focus trap, Escape, scroll lock.
- **Reel + stack**: section tidak lagi `overflow-hidden` (itu yang mematikan sticky). Reel desktop pin/scrub, mobile native scroll-snap. Stack desktop sequential card stack, reduced-motion/mobile jadi tumpukan statis yang semua kartunya kebaca.
- **GSAP**: hero entrance + scroll-out tanpa tween yang rebutan property; section heading pakai SplitText mask; ticker digerakkan scroll (bukan loop tanpa henti); product gallery view transition; cart line stagger; search/mega menu entrance; footer wordmark cascade.
- **Motion global** dikurangi: tidak ada `data-skew`, `data-speed`, `data-zoom`, atau drift produk yang jalan terus. Hanya entrance sekali + tiga momen scrub (hero, reel, stack).
- **A11y**: skip link, satu `<main id="main">` per layout, `:focus-visible` global, label form terhubung, error `role=alert`, dialog `role=dialog` + `aria-modal`, focus trap + Escape untuk menu/search/cart/address/account modal.
- **Home composition**: The Index (kategori), Production Schedule (pre-order), New Arrivals split layout, dark Specimen feature, ranked Best Sellers ledger, Drop Reel, Archive Stack, Lookbook index, Social contact sheet. Newsletter section dihapus; form footer jadi satu-satunya drop-alert form.
- **SEO**: 24 halaman produk SSG (`generateStaticParams`), metadata per produk, canonical, JSON-LD Product, sitemap termasuk produk + policies, Open Graph image.
- **Dead code**: `GarmentIcon`, `Newsletter`, Three.js, Framer Motion sudah tidak dipakai/dihapus.
- Last verified: `npm run lint` clean, `next build` 52 static pages, keyboard/focus smoke check untuk menu/search.

## Status terkini
Fashion e-commerce Next.js 15 (EGAX Studios) — redesain style dari **cartoon comic streetwear** ke **minimal archive / brutalist** (putih-hitam monochrome, satu typeface Archivo, tanpa dekorasi). Dua arah dicoba: industrial workbench (ditolak user) → archive (final). **GSAP sudah diimplementasi** (hero timeline SplitText + scroll reveal global), Framer Motion di-uninstall. Bug navbar sticky (ketutup ticker) sudah fix. **Brand voice diganti ke casual** ("EVERYDAY" — copy lama "loud/noise/volume knob" dihapus), GarmentIcon di-redesign jadi siluet casual (drop shoulder, kangaroo pocket), hover button hero jadi invert sweep, scrollbar halaman dihapus. Fitur & menu 100% tidak diubah. Build sukses, lint bersih.

## Next steps
- [ ] Review visual manual di browser — terutama GarmentIcon baru (pastikan tiap kategori kebaca) & copy casual
- [ ] Kalau user minta aksen warna (misal merah archive / abu), cukup ubah token `pink` di tailwind.config + globals.css
- [ ] Foto produk asli kalau sudah ada — ganti GarmentIcon via `product.images`

## Known issues / belum sempurna
- Hero copy masih "WEAR THE NOISE." (biar nggak ubah konten), treatment visual sudah archive
- EditorialBanner/SocialCTA pakai tone abu muda + teks gelap (sudah disesuaikan kontras)
- `text-pink` di banyak label = hitam (monochrome) — wajar, bukan bug

## Yang user harus isi manual
- Approve final direction archive (atau minta tweak)
- Foto produk asli kalau sudah ada (placeholder sekarang grayscale garment tones)
