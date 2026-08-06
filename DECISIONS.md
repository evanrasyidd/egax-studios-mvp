# DECISIONS — EGAX Studios

## Redesign style → Minimal archive / brutalist — Agu 2026
**Masalah:** User gak suka style lama (cartoon comic: border ink tebal + offset shadow, Anton/Bangers, pop pink-kuning-biru di atas cream). Fitur & menu harus tetap sama, cuma style diganti.

**Yang dicoba:**
1. **Industrial workwear / tech pack** (Space Grotesk + IBM Plex Mono, manila paper, orange safety, hairline spec sheet) — user coba, TIDAK cocok ("jelek, kurang cocok"). Ditulis ulang.
2. **Minimal archive / brutalist** (putih-hitam pekat, satu typeface, tanpa dekorasi, spacing lebar, garis tipis — WTAPS/Undercover vibe) — user pilih ini, FINAL.

**Keputusan akhir:**
- **Monochrome total**: bg #FAFAF8 (paper putih hangat), text1 #111111 (hitam pekat), text2 #7A7A7A, border #E5E4E0 (rule tipis). `pink`/`accent` token = HITAM (nama token dipertahankan biar ~100 file pemakai tidak diedit satu-satu).
- **Satu typeface**: Archivo untuk SEMUA peran (display/body/mono) — di `globals.css`, `--font-body` & `--font-mono` di-alias ke `--font-display`; layout.js cuma load Archivo SATU kali (3x instance sebelumnya boros).
- Semua shadow dihapus (boxShadow ink/ink-sm/ink-lg = none), border di-normalisasi ke 1px hairline.
- Hero = archive catalog card: Nº serial + foto garmen placeholder (GarmentIcon) di atas tone abu-abu garment + nama/kategori/harga, headline grotesk hitam besar tracking ketat.
- Utility `arch-label` (micro label uppercase 10px tracking 0.16em) — rename dari `spec-label` industrial.

**Kenapa:** Arah ini paling dekat dengan selera user (dia dulunya suka cream+ink, cuma gak suka elemen komik); monochrome + satu font = anti-generic karena beda jauh dari template AI yang pasti pakai gradient/2 font/pop color; archive numbering (Nº, section 01–05) jadi signature yang memang lahir dari konten (catalog garmen).

## Animasi → GSAP (ganti Framer Motion) — Agu 2026
**Masalah:** User bilang animasi kaku; minta GSAP. Framer Motion cuma dipakai di hero (intro), sisanya CSS biasa.
**Keputusan akhir:** GSAP 3.15 + `@gsap/react` (useGSAP). Framer Motion di-uninstall total (dead code, bundle home turun 43.8kB → 10kB). SplitText sekarang gratis di paket npm.
**Implementasi:**
- `components/providers/ScrollAnimations.jsx` — satu bahasa gerak global via matchMedia (reduced-motion = mati): `[data-reveal]` fade-up, `.product-card` & `.archive-tile` batch stagger, `[data-speed]` parallax halus, `[data-zoom]` settle scale 1.12→1. Mount di root layout.
- Hero: timeline intro (badge → headline SplitText per kata → sub → CTA → card) + parallax scrub.
- SectionHeading: SplitText word reveal per section (dependencies: [title] biar re-split saat ganti bahasa).
- Navbar: scroll progress line (strip 2px hitam, scrub di scrollHeight).
- Footer: giant wordmark "EGAX STUDIOS" (clamp 64–220px) slide-up reveal scrub.
**Gotcha:** Semua tween ada di ScrollAnimations + HeroSection + SectionHeading + Navbar + Footer — jangan sebar timeline baru di komponen lain. `data-zoom` butuh parent `overflow-hidden` biar gak bocor.

## Landing hero "wow" pass — Agu 2026
**Keputusan:** Hero home jadi satu momen signature penuh (masih monochrome, no gradient):
- **Intro curtain** (sekali per sesi via sessionStorage `egax-intro`): overlay hitam z-[90] + counter "Nº 000→001" + label "Loading Archive · SS26", curtain slide-up 0.7s.
- **Headline flip-in**: per kata `yPercent:120 + rotation:5 → 0`, stagger 0.055, power4.out — efek kata jatuh & berhenti.
- **Scroll-out fold-away**: pas scroll keluar, kata-kata headline `yPercent:85 + opacity:0` (scrub), card turun, headline naik tipis.
- **Buttons**: sweep fill hover (layer `btn-sweep-fill` translate-y-full → 0, solid color, bukan gradient) + panah slide + **magnetic** (gsap.quickTo, desktop & pointer:fine doang).
**Gotcha:** Intro di-skip kalau `sessionStorage` udah set; reduced-motion skip total (overlay opacity-0 default CSS). Kalau user komplain intro kebanyakan, hapus blok "1." & "2." timeline + overlay JSX.

## Mojibake incident (PowerShell) — Agu 2026
**Masalah:** Karakter `·`, `→`, `●`, `─` di banyak file jadi `Â·`, `â†'`, `�?�` — keliatan di UI ("Est. 2026 Â· JKT").
**Akar:** `Get-Content` di PowerShell 5.1 default baca file UTF-8 **tanpa BOM** sebagai ANSI (cp1252) → karakter multi-byte ke-double-encode saat `Set-Content -Encoding UTF8`.
**Fix:** Script repair di `C:\Users\evanr\AppData\Local\Temp\opencode\fix-mojibake2.ps1` (mapping char cp1252 → char asli, misal [E2,2020,2019] → →).
**Gotcha:** JANGAN edit file JS pakai PowerShell `Get-Content`/`Set-Content` — pakai tool edit/write (UTF-8 aman). Kalau terpaksa pakai PowerShell, WAJIB `-Encoding UTF8` di Get-Content DAN Set-Content. Karakter yang udah jadi U+FFFD tidak bisa di-reverse.

## Navbar sticky bug — Agu 2026
**Masalah:** Navbar terasa "ngebug" pas scroll — kontennya ketutup strip ticker.
**Akar:** `MarqueeTicker` sticky `top-0 z-50` + Navbar sticky `top-0 z-40` (ke-overwrite dari `top-8` pas redesign industrial) — dua-duanya nempel di top 0, ticker menang z-index, 32px atas navbar kegelapin.
**Fix:** Navbar `sticky top-8 z-[65]` (top-8 = tinggi ticker h-8), mobile menu `z-[55]` (di atas ticker z-50, di bawah navbar z-[65] biar tombol close tetap kelihatan).

## Gotcha archive (berlaku umum)
- `pink` token sekarang HITAM — `bg-pink text-black` harus diubah jadi `bg-pink text-white` (sudah diganti di semua tempat: checkout, admin, POS, account).
- `text-pink` = hitam di semua label — kalau nanti mau aksen (misal merah archive), cukup ubah SATU token `pink` di tailwind.config + globals.css.
- `arch-label` class untuk semua label kecil — pakai itu, jangan hardcode font-size/tracking manual.
- Placeholder garment tones grayscale ada di `GARMENT_TONES` (HeroSection) & array COLORS di tiap komponen — samakan kalau mau ubah palet produk.
