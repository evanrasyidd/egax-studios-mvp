import { PRODUCTS, getProductBySlug } from '@/constants/products'
import ProductDetail from '@/components/product/ProductDetail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://egax-studios.vercel.app'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product',
      description: 'EGAX Studios product.',
    }
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · EGAX Studios`,
      description: product.description,
      type: 'website',
      url: `/product/${product.slug}`,
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        brand: { '@type': 'Brand', name: 'EGAX Studios' },
        sku: product.id.toUpperCase(),
        category: product.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IDR',
          price: product.price,
          availability: product.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          url: `${SITE_URL}/product/${product.slug}`,
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail slug={slug} />
    </>
  )
}
