const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://egax-studios.vercel.app'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/pos', '/account', '/checkout'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
