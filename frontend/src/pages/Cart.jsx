import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartQuantity, removeFromCart } from '../redux/cartSlice';
import Loader from '../components/Loader';
import { Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async () => {
    try {
      // Create order from cart with sample shipping address
      await api.post('/orders/create/', {
        shipping_address: {
          full_name: 'John Doe',
          phone: '+1 234 567 8900',
          address_line1: '123 Amazon Way',
          city: 'Seattle',
          state: 'WA',
          postal_code: '98101',
          country: 'United States'
        },
        payment_method: 'Credit Card'
      });
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-amazon-background py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h1 className="text-2xl font-normal text-gray-900">Shopping Cart</h1>
            <span className="text-xs text-gray-500">Price</span>
          </div>

          {cart.items?.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
              <h2 className="text-xl font-bold text-gray-700">Your Amazon Cart is empty.</h2>
              <p className="text-xs text-gray-500">Check your Wishlist or continue browsing deals.</p>
              <Link to="/products" className="amazon-btn-primary inline-block text-xs py-2 px-6">
                Shop Today's Deals
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-6 text-xs">
                  <img
                    src={item.product?.main_image}
                    alt={item.product?.title}
                    className="w-28 h-28 object-contain shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item.product?.slug}`} className="font-bold text-sm text-gray-900 hover:text-amazon-orange line-clamp-2">
                        {item.product?.title}
                      </Link>
                      <p className="text-green-700 font-semibold mt-1">In Stock</p>
                      <p className="text-gray-500 mt-0.5">Eligible for FREE Shipping</p>
                    </div>

                    {/* Quantity & Delete Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-300 rounded bg-gray-50">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-gray-200 font-bold text-gray-700"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-cyan-700 hover:underline font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-900">${item.subtotal}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Box (4 Cols) */}
        {cart.items?.length > 0 && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-gray-900 border-b pb-2">Order Summary</h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.total_items}):</span>
                  <span>${cart.total_price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (18%):</span>
                  <span>${cart.tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Handling:</span>
                  <span className="text-green-700 font-bold">FREE</span>
                </div>
                <hr />
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                  <span>Grand Total:</span>
                  <span className="text-red-700">${cart.grand_total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="amazon-btn-primary w-full py-2.5 font-bold text-xs shadow-md"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% Purchase Protection with Amazon Security.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
