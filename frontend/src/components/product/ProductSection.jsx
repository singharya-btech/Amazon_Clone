import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import ProductCard from './ProductCard'
import Spinner from '../ui/Spinner'

export default function ProductSection({ title, products = [], loading, viewAllLink }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  if (loading) return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Spinner className="py-8" />
    </div>
  )

  if (!products.length) return null

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-blue-600 hover:text-amazon hover:underline">
            See all
          </a>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-48" style={{ scrollSnapAlign: 'start' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
