import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/')
      .then((res) => {
        setOrders(res.data.results || res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-amazon-background py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-normal text-gray-900">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-700">No orders placed yet.</h2>
            <p className="text-xs text-gray-500 mt-1">When you place an order, it will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden text-xs">
              {/* Order Top Banner Header */}
              <div className="bg-gray-100 p-4 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-600">
                <div>
                  <span className="block uppercase text-[10px] font-bold text-gray-500">Order Placed</span>
                  <span className="font-semibold text-gray-800">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block uppercase text-[10px] font-bold text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">${order.grand_total}</span>
                </div>
                <div>
                  <span className="block uppercase text-[10px] font-bold text-gray-500">Ship To</span>
                  <span className="font-semibold text-cyan-700 hover:underline cursor-pointer">{order.full_name}</span>
                </div>
                <div className="text-right">
                  <span className="block uppercase text-[10px] font-bold text-gray-500">Order # {order.order_number}</span>
                  <span className="text-cyan-700 hover:underline cursor-pointer">Order Details</span>
                </div>
              </div>

              {/* Order Status & Items */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  {order.status === 'Delivered' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Truck className="w-5 h-5 text-amazon-orange" />
                  )}
                  <span className="text-base font-bold text-gray-900">
                    Status: <span className="text-amazon-orange">{order.status}</span>
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-t border-gray-100 pt-3">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-contain shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">{item.product_name}</h3>
                        <p className="text-gray-500">Qty: {item.quantity} | Price: ${item.price}</p>
                      </div>
                      <button className="amazon-btn-primary text-xs py-1">
                        Buy it again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
