import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeCartItem, updateCartItem } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { showToast } from '../store/slices/uiSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, total_items, subtotal, tax, grand_total, loading } = useSelector((s) => s.cart)
  const { isAuthenticated } = useSelector((s) => s.auth)

  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to add items to cart', type: 'error' }))
      return false
    }
    const result = await dispatch(addToCart({ product_id: productId, quantity }))
    if (addToCart.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Added to cart!', type: 'success' }))
      return true
    }
    dispatch(showToast({ message: 'Failed to add to cart', type: 'error' }))
    return false
  }

  const removeItem = (itemId) => dispatch(removeCartItem(itemId))
  const updateItem = (itemId, quantity) => dispatch(updateCartItem({ itemId, quantity }))
  const isInCart = (productId) => items.some((i) => i.product?.id === productId)
  const getCartItem = (productId) => items.find((i) => i.product?.id === productId)

  return { items, total_items, subtotal, tax, grand_total, loading, addItem, removeItem, updateItem, isInCart, getCartItem }
}

export const useWishlist = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((s) => s.wishlist)
  const { isAuthenticated } = useSelector((s) => s.auth)

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to use wishlist', type: 'error' }))
      return
    }
    const inWishlist = items.some((i) => i.product?.id === productId)
    if (inWishlist) {
      await dispatch(removeFromWishlist(productId))
      dispatch(showToast({ message: 'Removed from wishlist', type: 'info' }))
    } else {
      await dispatch(addToWishlist(productId))
      dispatch(showToast({ message: 'Added to wishlist!', type: 'success' }))
    }
  }

  const isInWishlist = (productId) => items.some((i) => i.product?.id === productId)

  return { items, toggleWishlist, isInWishlist }
}
