import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="text-4xl font-bold text-amazon-navy">amazon<span className="text-amazon">.clone</span></span>
      </div>
      <div className="border-t border-gray-300 pt-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Looking for something?</h1>
        <p className="text-gray-600 mb-2">
          We're sorry. The Web address you entered is not a functioning page on our site.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          <strong>HTTP 404</strong> - File not found
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-amazon px-6 py-2 rounded-lg font-medium">Go to Amazon Clone's Home Page</Link>
          <Link to="/products" className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
