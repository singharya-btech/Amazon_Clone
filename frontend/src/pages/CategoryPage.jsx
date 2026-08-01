import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/product/ProductCard'
import Spinner from '../components/ui/Spinner'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState('-created_at')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [catRes, prodRes] = await Promise.all([
          productAPI.getCategory(slug),
          productAPI.getCategoryProducts(slug, { ordering }),
        ])
        setCategory(catRes.data)
        setProducts(prodRes.data.results || prodRes.data)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [slug, ordering])

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-amazon">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{category?.name || slug}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{category?.name || slug}</h1>
          {category?.description && <p className="text-gray-500 text-sm mt-1">{category.description}</p>}
          <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
        </div>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon"
        >
          <option value="-created_at">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products in this category yet</p>
          <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">Browse all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
