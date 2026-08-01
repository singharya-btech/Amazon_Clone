import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle } from 'lucide-react'
import { orderAPI } from '../services/api'
import { fetchCart } from '../store/slices/cartSlice'
import { formatPrice } from '../utils/helpers'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { items, subtotal, tax, grand_total } = useSelector((s) => s.cart)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm()

  if (!isAuthenticated) {
    navigate('/login', { state: { from: { pathname: '/checkout' } } })
    return null
  }

  if (items.length === 0 && !success) {
    navigate('/cart')
    return null
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const { data: order } = await orderAPI.createOrder(data)
      setSuccess(order)
      dispatch(fetchCart())
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-2">Order #{success.order_number}</p>
      <p className="text-gray-500 text-sm mb-6">Total: {formatPrice(success.grand_total)}</p>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="btn-amazon px-6 py-2 rounded-lg font-medium">View Orders</Link>
        <Link to="/products" className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">Continue Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded mb-4">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" error={errors.shipping_name?.message}
                  {...register('shipping_name', { required: 'Full name is required' })} />
                <Input label="Phone" error={errors.shipping_phone?.message}
                  {...register('shipping_phone', { required: 'Phone is required' })} />
                <div className="sm:col-span-2">
                  <Input label="Address" error={errors.shipping_address?.message}
                    {...register('shipping_address', { required: 'Address is required' })} />
                </div>
                <Input label="City" error={errors.shipping_city?.message}
                  {...register('shipping_city', { required: 'City is required' })} />
                <Input label="State" error={errors.shipping_state?.message}
                  {...register('shipping_state', { required: 'State is required' })} />
                <Input label="Postal Code" error={errors.shipping_postal_code?.message}
                  {...register('shipping_postal_code', { required: 'Postal code is required' })} />
                <Input label="Country" defaultValue="India"
                  {...register('shipping_country')} />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm & more' },
                  { value: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks' },
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" value={method.value} defaultChecked={method.value === 'cod'}
                      {...register('payment_method')} className="text-amazon" />
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Place Order • {formatPrice(grand_total)}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-5 shadow-sm sticky top-20">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 text-sm">
                  <span className="text-gray-600 flex-1 line-clamp-1">{item.product?.name}</span>
                  <span className="font-medium flex-shrink-0">×{item.quantity}</span>
                  <span className="flex-shrink-0">{formatPrice(item.total_price)}</span>
                </div>
              ))}
            </div>
            <hr className="mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">FREE</span></div>
              <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(grand_total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
