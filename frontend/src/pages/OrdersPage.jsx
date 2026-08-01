import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { orderAPI } from '../services/api'
import { formatPrice, formatDate } from '../utils/helpers'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'prime', processing: 'prime',
  shipped: 'prime', delivered: 'success', cancelled: 'danger', refunded: 'default',
}

export default function OrdersPage() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    orderAPI.getOrders()
      .then(({ data }) => setOrders(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleCancel = async (orderId) => {
    setCancelling(orderId)
    try {
      const { data } = await orderAPI.cancelOrder(orderId)
      setOrders((prev) => prev.map((o) => o.id === orderId ? data : o))
    } catch (_) {}
    setCancelling(null)
  }

  if (!isAuthenticated) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <Package size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Sign in to see your orders</h2>
      <Link to="/login" className="btn-amazon inline-block px-8 py-3 rounded-lg font-medium mt-4">Sign In</Link>
    </div>
  )

  if (loading) return <Spinner size="lg" className="py-32" />

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No orders yet</p>
          <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center gap-4 border-b">
                <div>
                  <p className="text-xs text-gray-500">ORDER PLACED</p>
                  <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">TOTAL</p>
                  <p className="text-sm font-medium">{formatPrice(order.grand_total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ORDER #</p>
                  <p className="text-sm font-medium font-mono">{order.order_number}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <Badge variant={STATUS_COLORS[order.status] || 'default'}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    Details {expanded === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="px-5 py-4">
                <div className="flex gap-3 flex-wrap">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-contain rounded border"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-sm text-gray-500 self-center">+{order.items.length - 3} more items</p>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === order.id && (
                <div className="border-t px-5 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p className="font-medium">{order.shipping_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                        <p>{order.shipping_country}</p>
                        <p>{order.shipping_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Order Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span>{formatPrice(order.tax)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">FREE</span></div>
                        <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>{formatPrice(order.grand_total)}</span></div>
                      </div>
                    </div>
                  </div>

                  {['pending', 'confirmed'].includes(order.status) && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={cancelling === order.id}
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
