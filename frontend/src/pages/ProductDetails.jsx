import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, clearCurrentProduct } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist } from '../redux/wishlistSlice';
import RatingStars from '../components/RatingStars';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
    
    // Fetch related products
    api.get(`/products/${slug}/related/`).then((res) => {
      setRelatedProducts(res.data);
    }).catch(() => {});

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setActiveImage(currentProduct.main_image);
    }
  }, [currentProduct]);

  if (loading || !currentProduct) return <Loader fullScreen />;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: currentProduct.id, quantity }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: currentProduct.id, quantity }));
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${slug}/reviews/`, {
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      dispatch(fetchProductDetail(slug));
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid: Images | Product Specs | Purchase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: Image Gallery (4 Cols) */}
          <div className="lg:col-span-5 flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveImage(currentProduct.main_image)}
                className={`w-14 h-14 border rounded p-1 ${activeImage === currentProduct.main_image ? 'border-amazon-gold ring-2 ring-amazon-gold' : 'border-gray-200'}`}
              >
                <img src={currentProduct.main_image} alt="" className="w-full h-full object-contain" />
              </button>
              {currentProduct.images?.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-14 h-14 border rounded p-1 ${activeImage === img.image_url ? 'border-amazon-gold ring-2 ring-amazon-gold' : 'border-gray-200'}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Preview Image */}
            <div className="flex-1 border border-gray-200 rounded-lg p-4 h-96 flex items-center justify-center">
              <img src={activeImage || currentProduct.main_image} alt={currentProduct.title} className="max-h-full object-contain" />
            </div>
          </div>

          {/* Center: Details & Specs (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{currentProduct.title}</h1>
              {currentProduct.brand && (
                <p className="text-xs text-cyan-700 hover:underline cursor-pointer mt-1">Brand: {currentProduct.brand}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <RatingStars rating={currentProduct.rating} numReviews={currentProduct.num_reviews} />
              </div>
            </div>

            <hr />

            {/* Price Box */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-red-700">-{Math.round(currentProduct.discount_percentage)}%</span>
                <span className="text-3xl font-extrabold text-gray-900">${currentProduct.final_price}</span>
              </div>
              {currentProduct.discount_percentage > 0 && (
                <p className="text-xs text-gray-500">
                  Typical price: <span className="line-through">${currentProduct.price}</span>
                </p>
              )}
            </div>

            {/* Features & Description */}
            <div>
              <h3 className="font-bold text-xs text-gray-800 uppercase mb-1">About this item</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{currentProduct.description}</p>
            </div>

            {/* Specifications Table */}
            {currentProduct.specifications?.length > 0 && (
              <div className="border-t pt-3">
                <h3 className="font-bold text-xs text-gray-800 uppercase mb-2">Technical Details</h3>
                <div className="space-y-1 text-xs">
                  {currentProduct.specifications.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-2 py-1 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">{spec.key}</span>
                      <span className="text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Purchase & Stock Box (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="border border-gray-300 rounded-lg p-5 bg-gray-50 space-y-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">${currentProduct.final_price}</div>

              <div className="text-xs space-y-2">
                <p className="text-cyan-700 hover:underline cursor-pointer">FREE Returns</p>
                <p className="text-gray-700">FREE delivery <span className="font-bold">Tomorrow</span>.</p>
                <p className="text-green-700 font-bold text-sm">
                  {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>

              {/* Quantity Selector */}
              {currentProduct.stock > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <label className="font-bold text-gray-700">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 bg-white outline-none"
                  >
                    {[...Array(Math.min(10, currentProduct.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="amazon-btn-primary w-full py-2 text-xs font-bold shadow flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-amazon-orange hover:bg-orange-600 text-white rounded py-2 text-xs font-bold shadow transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Security Badges */}
              <div className="border-t pt-3 space-y-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-gray-500" /> Secure transaction</div>
                <div className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-gray-500" /> Ships from Amazon</div>
                <div className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5 text-gray-500" /> 30-day Return Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
            <RatingStars rating={currentProduct.rating} numReviews={currentProduct.num_reviews} />

            {/* Write a Review Box */}
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
              <h3 className="font-bold text-xs text-gray-800">Write a customer review</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="border rounded p-1 text-xs w-full outline-none"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full border rounded p-2 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="amazon-btn-secondary w-full text-xs py-1.5 font-bold"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b pb-2">Top reviews</h3>
            {currentProduct.reviews?.length === 0 ? (
              <p className="text-xs text-gray-500">No reviews yet. Be the first to write a review!</p>
            ) : (
              currentProduct.reviews?.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-800">{review.user_name || review.user_username}</span>
                    <span className="text-[10px] text-gray-400">Verified Purchase</span>
                  </div>
                  <RatingStars rating={review.rating} showCount={false} />
                  <p className="text-xs text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="border-t mt-12 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
