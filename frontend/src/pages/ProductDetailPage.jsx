import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react'
import { productAPI } from '../services/api'
import { useCart, useWishlist } from '../hooks/useCartWishlist'
import { formatPrice, getImageUrl } from '../utils/helpers'
import StarRating from '../components/ui/StarRating'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ProductCard from '../components/product/ProductCard'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { addItem, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setReviewSuccess(false)
      try {
        const { data } = await productAPI.getProduct(slug)
        setProduct(data)
        if (data.category?.slug) {
          const relRes = await productAPI.getCategoryProducts(data.category.slug, { page_size: 6 })
          setRelated((relRes.data.results || relRes.data).filter((p) => p.slug !== slug).slice(0, 5))
        }
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [slug])

  const handleAddToCart = () => addItem(product.id, quantity)

  const onReviewSubmit = async (data) => {
    setReviewSubmitting(true)
    try {
      await productAPI.addReview(slug, data)
      const { data: updated } = await productAPI.getProduct(slug)
      setProduct(updated)
      setReviewSuccess(true)
      reset()
    } catch (_) {}
    setReviewSubmitting(false)
  }

  if (loading) return <Spinner size="lg" className="py-32" />
  if (!product) return (
    <div className="text-center py-32">
      <p className="text-xl text-gray-500">Product not found</p>
      <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">Browse products</Link>
    </div>
  )

  const allImages = [
    { image_url: getImageUrl(product), is_primary: true },
    ...(product.images || []),
  ]

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-amazon">Home</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-amazon">{product.category.name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <img
              src={allImages[selectedImage]?.image_url || getImageUrl(product)}
              alt={product.name}
              className="w-full h-80 object-contain"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }}
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${i === selectedImage ? 'border-amazon' : 'border-gray-200'}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-1 space-y-4">
          {product.brand && <p className="text-blue-600 text-sm font-medium">{product.brand}</p>}
          <h1 className="text-2xl font-medium text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-3">
            <StarRating rating={product.average_rating} count={product.review_count} size={18} />
          </div>

          <hr />

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (
              <>
                <span className="text-lg text-gray-500 line-through">{formatPrice(product.original_price)}</span>
                <Badge variant="danger">Save {product.discount_percentage}%</Badge>
              </>
            )}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <dt className="text-gray-500 w-28 flex-shrink-0">{key}:</dt>
                    <dd className="text-gray-900 font-medium">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Buy Box */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-5 shadow-sm space-y-4 sticky top-20">
            <div className="text-2xl font-bold">{formatPrice(product.price)}</div>

            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">FREE delivery</span>
              <span className="text-gray-600">on orders over ₹499</span>
            </div>

            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}

            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            <Button
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={isInCart(product.id) ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              <ShoppingCart size={18} />
              {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
            </Button>

            <Button
              fullWidth
              variant="secondary"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} className={isInWishlist(product.id) ? 'fill-white' : ''} />
              {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>

            <div className="space-y-2 pt-2 border-t text-xs text-gray-600">
              <div className="flex items-center gap-2"><Shield size={14} className="text-gray-400" /> Secure transaction</div>
              <div className="flex items-center gap-2"><RotateCcw size={14} className="text-gray-400" /> Free 30-day returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="text-center">
            <div className="text-5xl font-bold">{product.average_rating}</div>
            <StarRating rating={product.average_rating} size={20} />
            <div className="text-sm text-gray-500 mt-1">{product.review_count} reviews</div>
          </div>
        </div>

        {/* Review Form */}
        {isAuthenticated && !reviewSuccess && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Rating</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
                  {...register('rating', { required: true })}
                >
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
                  placeholder="Summary of your review"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Review</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amazon"
                  placeholder="Share your experience..."
                  {...register('comment', { required: 'Review is required' })}
                />
                {errors.comment && <p className="text-xs text-red-600 mt-1">{errors.comment.message}</p>}
              </div>
              <Button type="submit" loading={reviewSubmitting} size="sm">Submit Review</Button>
            </form>
          </div>
        )}

        {reviewSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✓ Your review has been submitted successfully!
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews?.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            product.reviews?.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-amazon-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {review.user_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.user_name}</p>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  {review.is_verified && <Badge variant="success" className="ml-auto">Verified Purchase</Badge>}
                </div>
                <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                <p className="text-sm text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
