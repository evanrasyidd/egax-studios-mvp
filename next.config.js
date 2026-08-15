/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tidak ada gambar remote yang di-render di project ini:
  // - Semua placeholder produk pakai GarmentIcon SVG (bukan foto)
  // - Hero memakai tipografi + SVG signature, bukan hotlink Unsplash
  // Kalau nanti foto produk asli masuk lewat next/image, daftarin
  // domain-nya di `images.remotePatterns` dulu atau next/image bakal 500.
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
