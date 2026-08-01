import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { registerUser, clearError } from '../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirm_password) {
      setValidationError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    dispatch(registerUser(formData)).then((res) => {
      if (!res.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4 pb-12">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-extrabold text-amazon-blue">
          amazon<span className="text-amazon-gold">.clone</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-normal text-gray-900 mb-4">Create account</h1>

        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-xs flex items-start gap-2 rounded">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Registration Error</p>
              <p>{validationError || (typeof error === 'string' ? error : JSON.stringify(error))}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-gray-700 mb-1">First name</label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Mobile number or email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Re-enter password</label>
            <input
              type="password"
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="amazon-btn-primary w-full py-2 mt-4 font-medium text-sm shadow flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-4 border-t pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
