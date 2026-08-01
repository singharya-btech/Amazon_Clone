import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const AddressModal = ({ isOpen, onClose, onAddressSaved }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    is_default: false
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/accounts/addresses/', formData);
      onAddressSaved();
      onClose();
    } catch (err) {
      alert('Failed to save address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Add a New Shipping Address</h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Address Line 1</label>
            <input
              type="text"
              required
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-gray-700">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-gray-700">Postal Code</label>
              <input
                type="text"
                required
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-1 focus:ring-amazon-gold outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="amazon-btn-primary w-full py-2 mt-4 font-bold text-sm shadow"
          >
            {loading ? 'Saving...' : 'Add Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
