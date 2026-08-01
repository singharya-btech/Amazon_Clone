import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refreshToken')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
        localStorage.setItem('accessToken', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch (_) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (data) => api.post('/auth/logout/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
  getAddresses: () => api.get('/auth/addresses/'),
  createAddress: (data) => api.post('/auth/addresses/', data),
  updateAddress: (id, data) => api.patch(`/auth/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`),
}

export const productAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (slug) => api.get(`/products/${slug}/`),
  getFeatured: () => api.get('/products/featured/'),
  getBestSellers: () => api.get('/products/best-sellers/'),
  getCategories: () => api.get('/products/categories/'),
  getCategory: (slug) => api.get(`/products/categories/${slug}/`),
  getCategoryProducts: (slug, params) => api.get(`/products/categories/${slug}/products/`, { params }),
  getReviews: (slug) => api.get(`/products/${slug}/reviews/`),
  addReview: (slug, data) => api.post(`/products/${slug}/reviews/`, data),
}

export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addItem: (data) => api.post('/cart/items/', data),
  updateItem: (itemId, data) => api.patch(`/cart/items/${itemId}/`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
  clearCart: () => api.delete('/cart/'),
}

export const orderAPI = {
  getOrders: () => api.get('/orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/create/', data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
}

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist/'),
  addItem: (data) => api.post('/wishlist/', data),
  removeItem: (productId) => api.delete(`/wishlist/${productId}/`),
}

export default api
