import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import StarRating from '../ui/StarRating'
import Badge from '../ui/Badge'
import { formatPrice, getImageUrl } from '../../utils/helpers'
import { useCart, useWishlist } from '../../hooks/useCartWishlist'

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="card group relative flex flex-col h-full">
      {/* Wishlist button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
        aria-label="Toggle wishlist"
      >
        <Heart
          size={18}
          className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        />
      </button>

      {/* Discount badge */}
      {product.discount_percentage > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="danger">-{product.discount_percentage}%</Badge>
        </div>
      )}

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block overflow-hidden rounded-t-lg bg-gray-50">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }}
        />
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        )}

        <Link to={`/products/${product.slug}`} className="hover:text-amazon">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.average_rating} count={product.review_count} size={14} />

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>

        {product.stock === 0 ? (
          <p className="text-xs text-red-600 mt-1">Out of Stock</p>
        ) : product.stock < 5 ? (
          <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
        ) : (
          <p className="text-xs text-green-600 mt-1">In Stock</p>
        )}

        <div className="mt-auto pt-3">
          <button
            onClick={() => addItem(product.id)}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              inCart
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-amazon hover:bg-amazon-dark text-black'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={16} />
            {inCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
