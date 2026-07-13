/** @type {import('next').NextConfig} */
const nextConfig = {
  // next/image gak dipake sama sekali di project ini (semua placeholder
  // produk pake GarmentIcon SVG, bukan foto remote) -- jadi gak ada
  // remotePatterns yang perlu didaftarin, dan quota "Image Optimization -
  // Transformations" di Vercel gak akan ke-charge sama sekali.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
