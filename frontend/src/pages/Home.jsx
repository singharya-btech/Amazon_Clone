import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { fetchProducts, fetchCategories } from '../redux/productSlice';
import { Zap, TrendingUp, Award, Smartphone, Laptop, Shirt, BookOpen, HomeIcon, Utensils, Gamepad2 } from 'lucide-react';

const categoryIcons = {
  'electronics': Zap,
  'mobile-phones': Smartphone,
  'laptops-computers': Laptop,
  'fashion': Shirt,
  'books': BookOpen,
  'home-essentials': HomeIcon,
  'kitchen': Utensils,
  'gaming': Gamepad2,
};

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, deals, bestsellers, trending, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading && products.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-amazon-background pb-12">
      {/* Hero Carousel */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-24 relative z-20 space-y-8">
        {/* Category Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => {
            const Icon = categoryIcons[cat.slug] || Zap;
            return (
              <div key={cat.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-amazon-orange" /> {cat.name}
                  </h3>
                  <div className="w-full h-40 rounded overflow-hidden mb-3 bg-gray-100">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover hover:scale-105 transition" />
                  </div>
                </div>
                <Link to={`/products?category=${cat.slug}`} className="text-xs font-bold text-cyan-700 hover:text-amazon-orange hover:underline">
                  Shop now
                </Link>
              </div>
            );
          })}
        </div>

        {/* Today's Deals Section */}
        {deals.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-600 fill-red-600 animate-bounce" /> Today's Deals
              </h2>
              <Link to="/products?is_deal=true" className="text-xs font-bold text-cyan-700 hover:underline">
                See all deals
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {deals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers Section */}
        {bestsellers.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amazon-gold fill-amazon-gold" /> Best Sellers
              </h2>
              <Link to="/products?is_bestseller=true" className="text-xs font-bold text-cyan-700 hover:underline">
                Explore Best Sellers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Trending & Recommended Products Grid */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" /> Trending & Recommended
            </h2>
            <Link to="/products" className="text-xs font-bold text-cyan-700 hover:underline">
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
