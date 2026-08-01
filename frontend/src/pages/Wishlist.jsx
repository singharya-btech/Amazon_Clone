import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Heart, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-amazon-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h1 className="text-2xl font-normal text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" /> Your Wishlist
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Items saved to your personal shopping list for future purchase.
          </p>
        </div>

        {wishlist?.items?.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-700">Your Wishlist is currently empty.</h2>
            <p className="text-xs text-gray-500 mt-1">Explore products and click the heart icon to save items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {wishlist.items.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
