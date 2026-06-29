import ProductCard from './ProductCard'
export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <div className="py-20 text-center"><p className="text-text2 text-sm">No products found.</p></div>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
      {products.map((p,i) => <ProductCard key={p.id} product={p} index={i}/>)}
    </div>
  )
}
