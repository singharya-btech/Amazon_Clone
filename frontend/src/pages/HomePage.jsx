import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { productAPI } from '../services/api'
import ProductSection from '../components/product/ProductSection'
import ProductCard from '../components/product/ProductCard'
import Spinner from '../components/ui/Spinner'

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Up to 40% off Electronics',
    subtitle: 'Shop the latest gadgets at unbeatable prices',
    cta: 'Shop Electronics',
    link: '/category/electronics',
    bg: 'from-blue-900 to-blue-700',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
  },
  {
    id: 2,
    title: 'New Season Fashion',
    subtitle: 'Discover the latest trends in clothing & accessories',
    cta: 'Shop Fashion',
    link: '/category/fashion',
    bg: 'from-purple-900 to-pink-700',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
  },
  {
    id: 3,
    title: 'Gaming Deals',
    subtitle: 'Level up your gaming setup with top brands',
    cta: 'Shop Gaming',
    link: '/category/gaming',
    bg: 'from-gray-900 to-green-900',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200',
  },
  {
    id: 4,
    title: 'Kitchen Essentials',
    subtitle: 'Everything you need for the perfect kitchen',
    cta: 'Shop Kitchen',
    link: '/category/kitchen',
    bg: 'from-orange-800 to-red-700',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
  },
]

const CATEGORY_CARDS = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Mobile Phones', slug: 'mobile-phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
  { name: 'Home Essentials', slug: 'home-essentials', image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400' },
  { name: 'Kitchen', slug: 'kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400' },
  { name: 'Gaming', slug: 'gaming', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
]

function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[current]

  return (
    <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover transition-all duration-700"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-70`} />
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{slide.title}</h1>
        <p className="text-sm md:text-lg text-gray-200 mb-6">{slide.subtitle}</p>
        <Link
          to={slide.link}
          className="inline-block bg-amazon hover:bg-amazon-dark text-black font-bold py-2 px-6 rounded-lg w-fit transition-colors"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Controls */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % HERO_SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-amazon' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, bsRes, allRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getBestSellers(),
          productAPI.getProducts({ page_size: 24 }),
        ])
        setFeatured(featRes.data.results || featRes.data)
        setBestSellers(bsRes.data.results || bsRes.data)
        setAllProducts(allRes.data.results || allRes.data)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  // Group products by category
  const byCategory = allProducts.reduce((acc, p) => {
    const cat = p.category_name || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-6">
      <HeroBanner />

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="card p-3 text-center hover:border-amazon border-2 border-transparent transition-all group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-16 object-cover rounded mb-2 group-hover:scale-105 transition-transform"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
            />
            <p className="text-xs font-medium text-gray-700 group-hover:text-amazon">{cat.name}</p>
          </Link>
        ))}
      </div>

      {/* Today's Deals Banner */}
      <div className="bg-gradient-to-r from-amazon-navy to-amazon-blue rounded-lg p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">⚡ Today's Deals</h2>
          <p className="text-gray-300 text-sm">Limited time offers — don't miss out!</p>
        </div>
        <Link to="/products?is_best_seller=true" className="bg-amazon hover:bg-amazon-dark text-black font-bold py-2 px-6 rounded-lg transition-colors">
          Shop Now
        </Link>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : (
        <>
          <ProductSection title="🔥 Featured Products" products={featured} viewAllLink="/products?is_featured=true" />
          <ProductSection title="🏆 Best Sellers" products={bestSellers} viewAllLink="/products?is_best_seller=true" />

          {Object.entries(byCategory).map(([category, products]) => (
            <ProductSection
              key={category}
              title={`${getCategoryEmoji(category)} ${category}`}
              products={products}
              viewAllLink={`/category/${category.toLowerCase().replace(/ /g, '-')}`}
            />
          ))}

          {/* All Products Grid */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recommended For You</h2>
              <Link to="/products" className="text-sm text-blue-600 hover:underline">See all products</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allProducts.slice(0, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getCategoryEmoji(name) {
  const map = {
    Electronics: '📱', 'Mobile Phones': '📱', Laptops: '💻',
    Fashion: '👗', Books: '📚', 'Home Essentials': '🏠',
    Kitchen: '🍳', Gaming: '🎮',
  }
  return map[name] || '🛍️'
}
