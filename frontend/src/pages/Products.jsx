import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Filter, Star, SlidersHorizontal } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, categories, loading } = useSelector((state) => state.products);

  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '');

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const isDealParam = searchParams.get('is_deal') || '';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (categoryParam) params.category = categoryParam;
    if (searchParam) params.search = searchParam;
    if (isDealParam) params.is_deal = isDealParam;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (minRating) params.min_rating = minRating;
    if (ordering) params.ordering = ordering;

    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  const handleFilterApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('min_price', minPrice); else newParams.delete('min_price');
    if (maxPrice) newParams.set('max_price', maxPrice); else newParams.delete('max_price');
    if (minRating) newParams.set('min_rating', minRating); else newParams.delete('min_rating');
    if (ordering) newParams.set('ordering', ordering); else newParams.delete('ordering');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-amazon-background py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white p-5 rounded-lg border border-gray-200 h-fit space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amazon-orange" /> Filters
            </h3>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-cyan-700 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Category</h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li
                onClick={() => handleCategorySelect('')}
                className={`cursor-pointer hover:text-amazon-orange ${!categoryParam ? 'font-bold text-amazon-orange' : ''}`}
              >
                All Categories
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`cursor-pointer hover:text-amazon-orange ${categoryParam === cat.slug ? 'font-bold text-amazon-orange' : ''}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <form onSubmit={handleFilterApply} className="border-t pt-4">
            <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Price Range ($)</h4>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none"
              />
            </div>
            <button type="submit" className="amazon-btn-secondary w-full text-xs py-1">
              Go
            </button>
          </form>

          {/* Customer Rating Filter */}
          <div className="border-t pt-4">
            <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Customer Rating</h4>
            <div className="space-y-2 text-xs">
              {[4, 3, 2, 1].map((stars) => (
                <div
                  key={stars}
                  onClick={() => {
                    setMinRating(stars.toString());
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('min_rating', stars.toString());
                    setSearchParams(newParams);
                  }}
                  className={`flex items-center gap-1 cursor-pointer hover:text-amazon-orange ${
                    minRating === stars.toString() ? 'font-bold text-amazon-orange' : 'text-gray-700'
                  }`}
                >
                  <div className="flex text-amazon-orange">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span>& Up</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid & Controls */}
        <main className="flex-1">
          {/* Header Bar */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-800">{products.length}</span> results
                {searchParam && <span> for "<span className="font-bold">{searchParam}</span>"</span>}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by:
              </label>
              <select
                value={ordering}
                onChange={(e) => {
                  setOrdering(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) newParams.set('ordering', e.target.value);
                  else newParams.delete('ordering');
                  setSearchParams(newParams);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-gray-50"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
