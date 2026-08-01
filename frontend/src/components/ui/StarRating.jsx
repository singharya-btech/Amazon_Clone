import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, count, size = 16 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'text-amazon fill-amazon' : 'text-gray-300 fill-gray-300'}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-blue-600 hover:text-orange-500 cursor-pointer">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
