import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Search, ShoppingCart, MapPin, ChevronDown,
  User, Package, Heart, LogOut, Menu, X, Globe
} from 'lucide-react'
import { logoutUser } from '../../store/slices/authSlice'
import { resetCart } from '../../store/slices/cartSlice'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const { total_items } = useSelector((s) => s.cart)
  const [query, setQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    dispatch(resetCart())
    setAccountOpen(false)
    navigate('/')
  }

  const categories = [
    'Electronics', 'Mobile Phones', 'Laptops', 'Fashion',
    'Books', 'Home Essentials', 'Kitchen', 'Gaming'
  ]

  return (
    <header className="sticky top-0 z-40">
      {/* Main navbar */}
      <nav className="bg-amazon-navy text-white">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center gap-2 h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 border-2 border-transparent hover:border-white rounded px-1 py-0.5">
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-xl tracking-tight">amazon</span>
              <span className="text-amazon text-xs font-medium">.clone</span>
            </div>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer flex-shrink-0">
            <MapPin size={16} className="text-gray-300 mt-1" />
            <div className="flex flex-col leading-none">
              <span className="text-gray-300 text-xs">Deliver to</span>
              <span className="text-white text-sm font-bold">India</span>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
            <div className="flex w-full rounded-md overflow-hidden">
              <select className="bg-gray-200 text-gray-700 text-sm px-2 border-r border-gray-300 focus:outline-none hidden md:block">
                <option>All</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Amazon Clone"
                className="flex-1 px-3 py-2 text-gray-900 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-amazon hover:bg-amazon-dark px-4 flex items-center justify-center transition-colors">
                <Search size={20} className="text-gray-900" />
              </button>
            </div>
          </form>

          {/* Language */}
          <div className="hidden lg:flex items-center gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer flex-shrink-0">
            <Globe size={16} />
            <span className="text-sm font-bold">EN</span>
            <ChevronDown size={12} />
          </div>

          {/* Account */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="border-2 border-transparent hover:border-white rounded px-2 py-1 text-left"
            >
              <div className="text-xs text-gray-300">
                {isAuthenticated ? `Hello, ${user?.first_name || user?.username}` : 'Hello, sign in'}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">Account & Lists</span>
                <ChevronDown size={12} />
              </div>
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white text-gray-900 rounded-lg shadow-xl border z-50">
                {!isAuthenticated ? (
                  <div className="p-4 border-b text-center">
                    <Link
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block w-full bg-amazon hover:bg-amazon-dark text-black font-medium py-2 px-4 rounded-lg text-sm mb-2"
                    >
                      Sign In
                    </Link>
                    <p className="text-xs text-gray-600">
                      New customer?{' '}
                      <Link to="/register" onClick={() => setAccountOpen(false)} className="text-blue-600 hover:underline">
                        Start here
                      </Link>
                    </p>
                  </div>
                ) : null}
                <div className="py-2">
                  {isAuthenticated && (
                    <>
                      <Link to="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                        <User size={16} /> Your Account
                      </Link>
                      <Link to="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                        <Package size={16} /> Your Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm">
                        <Heart size={16} /> Your Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm w-full text-red-600">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <Link to="/orders" className="hidden md:block border-2 border-transparent hover:border-white rounded px-2 py-1 flex-shrink-0">
            <div className="text-xs text-gray-300">Returns</div>
            <div className="text-sm font-bold">& Orders</div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 flex-shrink-0">
            <div className="relative">
              <ShoppingCart size={28} />
              {total_items > 0 && (
                <span className="absolute -top-2 -right-1 bg-amazon text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {total_items > 99 ? '99+' : total_items}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden sm:block">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden border-2 border-transparent hover:border-white rounded p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Category bar */}
      <div className="bg-amazon-blue text-white">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-1 px-3 py-1 hover:bg-amazon-light rounded text-sm font-medium whitespace-nowrap flex-shrink-0">
            <Menu size={16} /> All
          </button>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
              className="px-3 py-1 hover:bg-amazon-light rounded text-sm whitespace-nowrap flex-shrink-0"
            >
              {cat}
            </Link>
          ))}
          <Link to="/products?is_best_seller=true" className="px-3 py-1 hover:bg-amazon-light rounded text-sm whitespace-nowrap flex-shrink-0 text-amazon font-medium">
            Today's Deals
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-amazon-navy text-white border-t border-amazon-light">
          <div className="p-4 space-y-2">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-amazon text-black text-center py-2 rounded font-medium text-sm">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 border border-white text-center py-2 rounded text-sm">Register</Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 pb-2 border-b border-amazon-light">
                <User size={20} />
                <span className="font-medium">{user?.first_name} {user?.last_name}</span>
              </div>
            )}
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm hover:text-amazon border-b border-amazon-light/30"
              >
                {cat}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm pt-2">
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
