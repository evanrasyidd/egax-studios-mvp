import { PRODUCTS } from '@/constants/products'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://egax-studios.vercel.app'

export default function sitemap() {
  const paths = [
    { path: '', priority: 1 },
    { path: '/catalog', priority: 0.9 },
    { path: '/editorial', priority: 0.7 },
    { path: '/gallery', priority: 0.7 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.6 },
    { path: '/policies', priority: 0.5 },
    ...PRODUCTS.map((p) => ({ path: `/product/${p.slug}`, priority: 0.8 })),
  ]

  return paths.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }))
}
