import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { productAPI } from '../services/api'
import ProductCard from '../components/product/ProductCard'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

const SORT_OPTIONS = [
  { label: 'Newest', value: '-created_at' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Name A-Z', value: 'name' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    brand: searchParams.get('brand') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    is_featured: searchParams.get('is_featured') || '',
    is_best_seller: searchParams.get('is_best_seller') || '',
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) }
        const { data } = await productAPI.getProducts(params)
        setProducts(data.results || data)
        setCount(data.count || (data.results || data).length)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [filters, page])

  const applyFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ min_price: '', max_price: '', brand: '', ordering: '-created_at', is_featured: '', is_best_seller: '' })
    setPage(1)
  }

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-gray-500">{count} results</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.ordering}
            onChange={(e) => applyFilter('ordering', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <X size={14} /> Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Min Price (₹)</label>
              <input
                type="number" placeholder="0"
                value={filters.min_price}
                onChange={(e) => applyFilter('min_price', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Max Price (₹)</label>
              <input
                type="number" placeholder="9999"
                value={filters.max_price}
                onChange={(e) => applyFilter('max_price', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Brand</label>
              <input
                type="text" placeholder="e.g. Apple, Sony"
                value={filters.brand}
                onChange={(e) => applyFilter('brand', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
              />
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!filters.is_featured} onChange={(e) => applyFilter('is_featured', e.target.checked ? 'true' : '')} />
                Featured only
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!filters.is_best_seller} onChange={(e) => applyFilter('is_best_seller', e.target.checked ? 'true' : '')} />
                Best sellers only
              </label>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products found</p>
          <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${p === page ? 'bg-amazon text-black' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
