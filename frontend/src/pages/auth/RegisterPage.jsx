import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { fetchCart } from '../../store/slices/cartSlice'
import { getErrorMessage } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) navigate('/')
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      dispatch(fetchCart())
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-bold text-amazon-navy">amazon<span className="text-amazon">.clone</span></span>
      </Link>

      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-6">
        <h1 className="text-2xl font-medium mb-4">Create account</h1>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded mb-4">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.first_name?.message}
              {...register('first_name', { required: 'Required' })}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.last_name?.message}
              {...register('last_name', { required: 'Required' })}
            />
          </div>

          <Input
            label="Username"
            placeholder="johndoe"
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscores only' },
            })}
          />

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

          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+1 234 567 8900"
            {...register('phone')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              error={errors.confirm_password?.message}
              {...register('confirm_password', {
                required: 'Please confirm password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-8 text-gray-500">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            Create your Amazon Clone account
          </Button>
        </form>

        <p className="mt-4 text-xs text-gray-600 text-center">
          By creating an account, you agree to our{' '}
          <Link to="#" className="text-blue-600 hover:underline">Conditions of Use</Link>.
        </p>
      </div>

      <div className="w-full max-w-sm mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
      </div>
    </div>
  )
}
