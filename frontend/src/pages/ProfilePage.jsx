import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { User, Package, MapPin, Lock, LogOut, Plus, Trash2, Edit2 } from 'lucide-react'
import { logoutUser, fetchProfile } from '../store/slices/authSlice'
import { resetCart } from '../store/slices/cartSlice'
import { authAPI } from '../services/api'
import { formatDate } from '../utils/helpers'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
]

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [tab, setTab] = useState('profile')
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

  const profileForm = useForm({ defaultValues: { first_name: user?.first_name, last_name: user?.last_name, phone: user?.phone } })
  const passwordForm = useForm()
  const addressForm = useForm()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (tab === 'addresses') loadAddresses()
  }, [tab])

  const loadAddresses = async () => {
    setLoadingAddresses(true)
    try {
      const { data } = await authAPI.getAddresses()
      setAddresses(data)
    } catch (_) {}
    setLoadingAddresses(false)
  }

  const handleProfileSave = async (data) => {
    setProfileSaving(true)
    try {
      await authAPI.updateProfile(data)
      dispatch(fetchProfile())
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (_) {}
    setProfileSaving(false)
  }

  const handlePasswordChange = async (data) => {
    setPasswordSaving(true)
    setPasswordError(null)
    try {
      await authAPI.changePassword({ old_password: data.old_password, new_password: data.new_password })
      setPasswordSuccess(true)
      passwordForm.reset()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err.response?.data?.old_password?.[0] || 'Failed to change password')
    }
    setPasswordSaving(false)
  }

  const handleAddAddress = async (data) => {
    try {
      await authAPI.createAddress(data)
      await loadAddresses()
      setShowAddressForm(false)
      addressForm.reset()
    } catch (_) {}
  }

  const handleDeleteAddress = async (id) => {
    try {
      await authAPI.deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch (_) {}
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    dispatch(resetCart())
    navigate('/')
  }

  if (!user) return <Spinner size="lg" className="py-32" />

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-amazon-navy text-white text-center">
              <div className="w-16 h-16 bg-amazon rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
            </div>
            <nav className="p-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${tab === id ? 'bg-amazon/10 text-amazon font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
              <Link
                to="/orders"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                <Package size={16} /> Your Orders
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              {profileSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded mb-4">Profile updated successfully!</div>}
              <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" {...profileForm.register('first_name')} />
                  <Input label="Last Name" {...profileForm.register('last_name')} />
                </div>
                <Input label="Email" value={user.email} disabled className="bg-gray-50" />
                <Input label="Username" value={user.username} disabled className="bg-gray-50" />
                <Input label="Phone" type="tel" {...profileForm.register('phone')} />
                <div className="text-xs text-gray-500">Member since {formatDate(user.created_at)}</div>
                <Button type="submit" loading={profileSaving} size="sm">Save Changes</Button>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {tab === 'addresses' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Your Addresses</h2>
                <Button size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                  <Plus size={16} /> Add Address
                </Button>
              </div>

              {showAddressForm && (
                <form onSubmit={addressForm.handleSubmit(handleAddAddress)} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <h3 className="font-medium text-sm">New Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name" {...addressForm.register('full_name', { required: true })} />
                    <Input label="Phone" {...addressForm.register('phone', { required: true })} />
                    <div className="col-span-2">
                      <Input label="Address Line 1" {...addressForm.register('address_line1', { required: true })} />
                    </div>
                    <Input label="City" {...addressForm.register('city', { required: true })} />
                    <Input label="State" {...addressForm.register('state', { required: true })} />
                    <Input label="Postal Code" {...addressForm.register('postal_code', { required: true })} />
                    <Input label="Country" defaultValue="India" {...addressForm.register('country')} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Save Address</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                  </div>
                </form>
              )}

              {loadingAddresses ? <Spinner /> : addresses.length === 0 ? (
                <p className="text-gray-500 text-sm">No addresses saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-lg p-4 relative">
                      {addr.is_default && <span className="absolute top-2 right-2 text-xs bg-amazon text-black px-2 py-0.5 rounded">Default</span>}
                      <p className="font-medium text-sm">{addr.full_name}</p>
                      <p className="text-sm text-gray-600">{addr.address_line1}</p>
                      {addr.address_line2 && <p className="text-sm text-gray-600">{addr.address_line2}</p>}
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postal_code}</p>
                      <p className="text-sm text-gray-600">{addr.country}</p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="mt-2 text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Change Password</h2>
              {passwordSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded mb-4">Password changed successfully!</div>}
              {passwordError && <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded mb-4">{passwordError}</div>}
              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4 max-w-sm">
                <Input label="Current Password" type="password"
                  error={passwordForm.formState.errors.old_password?.message}
                  {...passwordForm.register('old_password', { required: 'Current password is required' })} />
                <Input label="New Password" type="password"
                  error={passwordForm.formState.errors.new_password?.message}
                  {...passwordForm.register('new_password', { required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
                <Input label="Confirm New Password" type="password"
                  error={passwordForm.formState.errors.confirm?.message}
                  {...passwordForm.register('confirm', {
                    required: 'Please confirm password',
                    validate: (v) => v === passwordForm.watch('new_password') || 'Passwords do not match',
                  })} />
                <Button type="submit" loading={passwordSaving} size="sm">Update Password</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
