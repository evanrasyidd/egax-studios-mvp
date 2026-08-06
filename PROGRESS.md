# PROGRESS — EGAX Studios

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
