import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Package, Lock, LogOut, Plus } from 'lucide-react';
import { logout } from '../redux/authSlice';
import AddressModal from '../components/AddressModal';
import api from '../services/api';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  const fetchAddresses = () => {
    api.get('/accounts/addresses/').then((res) => {
      setAddresses(res.data.results || res.data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts/change-password/', passwordData);
      setPasswordMsg('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '' });
    } catch (err) {
      setPasswordMsg('Failed to change password. Please check old password.');
    }
  };

  return (
    <div className="min-h-screen bg-amazon-background py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-normal text-gray-900">Your Account</h1>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* User Profile Info */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
            <User className="w-8 h-8 text-amazon-orange shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-sm text-gray-900">{user?.first_name} {user?.last_name}</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.phone || 'No phone provided'}</p>
            </div>
          </div>

          {/* Your Orders Link */}
          <div
            onClick={() => navigate('/orders')}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4 cursor-pointer hover:border-amazon-gold transition"
          >
            <Package className="w-8 h-8 text-amazon-orange shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-sm text-gray-900">Your Orders</h2>
              <p className="text-xs text-gray-500">Track, return, or buy items again</p>
            </div>
          </div>

          {/* Logout Action Card */}
          <div
            onClick={handleLogout}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4 cursor-pointer hover:border-red-400 transition"
          >
            <LogOut className="w-8 h-8 text-red-500 shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-sm text-red-600">Sign Out</h2>
              <p className="text-xs text-gray-500">Logout from your account safely</p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amazon-orange" /> Your Shipping Addresses
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="amazon-btn-primary text-xs py-1.5 flex items-center gap-1 font-bold"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-gray-300 rounded-lg p-4 text-xs space-y-1 relative bg-gray-50">
                <p className="font-bold text-gray-900">{addr.full_name}</p>
                <p className="text-gray-700">{addr.address_line1}</p>
                {addr.address_line2 && <p className="text-gray-700">{addr.address_line2}</p>}
                <p className="text-gray-700">{addr.city}, {addr.state} {addr.postal_code}</p>
                <p className="text-gray-700">{addr.country}</p>
                <p className="text-gray-500">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Password Change Box */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 max-w-md">
          <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amazon-orange" /> Change Password
          </h2>

          {passwordMsg && (
            <p className="text-xs font-bold text-blue-700 bg-blue-50 p-2 rounded">{passwordMsg}</p>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                required
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                className="w-full border rounded p-2 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full border rounded p-2 outline-none"
              />
            </div>
            <button type="submit" className="amazon-btn-secondary w-full py-1.5 font-bold">
              Update Password
            </button>
          </form>
        </div>

        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddressSaved={fetchAddresses}
        />
      </div>
    </div>
  );
};

export default Profile;
