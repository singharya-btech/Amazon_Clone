import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, Trash2 } from 'lucide-react'
import { fetchWishlist } from '../store/slices/wishlistSlice'
import { useWishlist, useCart } from '../hooks/useCartWishlist'
import { formatPrice, getImageUrl } from '../utils/helpers'
import StarRating from '../components/ui/StarRating'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { items, loading } = useSelector((s) => s.wishlist)
  const { toggleWishlist } = useWishlist()
  const { addItem } = useCart()

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist())
  }, [isAuthenticated, dispatch])

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <Heart size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your Wishlist is empty</h2>
      <p className="text-gray-500 mb-6">Sign in to save your favorite items</p>
      <Link to="/login" className="btn-amazon inline-block px-8 py-3 rounded-lg font-medium">Sign In</Link>
    </div>
  )

  if (loading) return <Spinner size="lg" className="py-32" />

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Your Wishlist <span className="text-gray-500 font-normal text-lg">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">Your wishlist is empty</p>
          <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card flex flex-col">
              <div className="relative">
                <button
                  onClick={() => toggleWishlist(item.product?.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow hover:shadow-md"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                <Link to={`/products/${item.product?.slug}`}>
                  <img
                    src={getImageUrl(item.product)}
                    alt={item.product?.name}
                    className="w-full h-48 object-contain p-4 bg-gray-50 rounded-t-lg"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
                  />
                </Link>
              </div>

              <div className="p-3 flex flex-col flex-1">
                <Link to={`/products/${item.product?.slug}`} className="hover:text-amazon">
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.product?.name}</h3>
                </Link>
                <StarRating rating={item.product?.average_rating} count={item.product?.review_count} size={13} />
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-bold">{formatPrice(item.product?.price)}</span>
                  {item.product?.original_price > item.product?.price && (
                    <span className="text-xs text-gray-500 line-through">{formatPrice(item.product?.original_price)}</span>
                  )}
                </div>
                <div className="mt-auto pt-3">
                  <Button
                    fullWidth
                    size="sm"
                    onClick={() => addItem(item.product?.id)}
                    disabled={item.product?.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
