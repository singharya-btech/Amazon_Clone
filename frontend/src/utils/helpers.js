import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

export const getImageUrl = (product) => {
  if (product?.image) return product.image
  if (product?.image_url) return product.image_url
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
}

export const getErrorMessage = (error) => {
  if (!error) return 'Something went wrong'
  if (typeof error === 'string') return error
  if (error.detail) return error.detail
  const firstKey = Object.keys(error)[0]
  if (firstKey) {
    const val = error[firstKey]
    return Array.isArray(val) ? val[0] : val
  }
  return 'Something went wrong'
}

export const truncate = (str, n) => (str?.length > n ? str.slice(0, n) + '...' : str)