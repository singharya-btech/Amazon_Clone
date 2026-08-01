import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { fetchCart } from '../store/slices/cartSlice'
import { useCart } from '../hooks/useCartWishlist'
import { formatPrice, getImageUrl } from '../utils/helpers'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { items, subtotal, tax, grand_total, loading, removeItem, updateItem } = useCart()

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart())
  }, [isAuthenticated, dispatch])

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Please sign in to view your cart</p>
      <Link to="/login" className="btn-amazon inline-block px-8 py-3 rounded-lg font-medium">Sign In</Link>
    </div>
  )

  if (loading) return <Spinner size="lg" className="py-32" />

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your Amazon Clone Cart is empty</h2>
      <p className="text-gray-500 mb-6">Shop today's deals</p>
      <Link to="/products" className="btn-amazon inline-block px-8 py-3 rounded-lg font-medium">Continue Shopping</Link>
    </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-3xl font-medium mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm flex gap-4">
              <Link to={`/products/${item.product?.slug}`} className="flex-shrink-0">
                <img
                  src={getImageUrl(item.product)}
                  alt={item.product?.name}
                  className="w-24 h-24 object-contain rounded"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?.slug}`} className="hover:text-amazon">
                  <h3 className="font-medium text-sm line-clamp-2">{item.product?.name}</h3>
                </Link>
                {item.product?.brand && <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>}
                <p className="text-green-600 text-xs mt-1">In Stock</p>

                <div className="flex items-center gap-4 mt-3">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-300 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product?.stock}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg">{formatPrice(item.total_price)}</p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">{formatPrice(item.product?.price)} each</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-5 shadow-sm sticky top-20">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Order Total</span>
                <span>{formatPrice(grand_total)}</span>
              </div>
            </div>

            <Button
              fullWidth
              className="mt-4"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Link to="/products" className="block text-center text-sm text-blue-600 hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
