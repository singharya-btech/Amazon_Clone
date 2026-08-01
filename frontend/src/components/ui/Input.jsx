import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full border rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amazon focus:border-transparent',
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
