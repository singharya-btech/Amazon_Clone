import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser, clearError } from '../../store/slices/authSlice'
import { fetchCart } from '../../store/slices/cartSlice'
import { fetchWishlist } from '../../store/slices/wishlistSlice'
import { getErrorMessage } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, from, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-bold text-amazon-navy">amazon<span className="text-amazon">.clone</span></span>
      </Link>

      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-6">
        <h1 className="text-2xl font-medium mb-4">Sign in</h1>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded mb-4">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
            })}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded" {...register('remember')} />
            <label htmlFor="remember" className="text-sm text-gray-700">Keep me signed in</label>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-600 text-center">
          By signing in, you agree to our{' '}
          <Link to="#" className="text-blue-600 hover:underline">Conditions of Use</Link>
          {' '}and{' '}
          <Link to="#" className="text-blue-600 hover:underline">Privacy Notice</Link>.
        </div>
      </div>

      <div className="w-full max-w-sm mt-4">
        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-500">New to Amazon Clone?</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <Link
          to="/register"
          className="block w-full text-center border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Create your Amazon Clone account
        </Link>
      </div>
    </div>
  )
}
