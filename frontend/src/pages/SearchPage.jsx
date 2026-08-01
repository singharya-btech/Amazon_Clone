import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { productAPI } from '../services/api'
import ProductCard from '../components/product/ProductCard'
import Spinner from '../components/ui/Spinner'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!query) return
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await productAPI.getProducts({ search: query })
        setProducts(data.results || data)
        setCount(data.count || (data.results || data).length)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [query])

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Search size={20} className="text-gray-500" />
        <h1 className="text-xl font-medium">
          {query ? (
            <>{count} results for <span className="text-amazon font-bold">"{query}"</span></>
          ) : 'Search for products'}
        </h1>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : !query ? (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Enter a search term to find products</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No results for "{query}"</p>
          <p className="text-sm text-gray-400 mt-2">Try different keywords or browse our categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
