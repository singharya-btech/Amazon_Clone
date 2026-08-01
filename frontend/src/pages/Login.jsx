import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { loginUser, clearError } from '../redux/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!username.trim() || !password) {
      setFormError('Please enter both username/email and password.');
      return;
    }
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      {/* Amazon Logo */}
      <Link to="/" className="mb-6">
        <span className="text-3xl font-extrabold text-amazon-blue">
          amazon<span className="text-amazon-gold">.clone</span>
        </span>
      </Link>

      {/* Login Form Box */}
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-normal text-gray-900 mb-4">Sign in</h1>

        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-xs flex items-start gap-2 rounded">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">There was a problem</p>
              <p>{error || formError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Email or mobile phone number
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold focus:ring-1 focus:ring-amazon-gold outline-none"
                placeholder="username or email"
                autoFocus
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Password</label>
              <a href="#" className="text-blue-600 hover:underline text-[11px]">
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-amazon-gold focus:ring-1 focus:ring-amazon-gold outline-none pr-10"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-amazon-gold focus:ring-amazon-gold"
            />
            <label htmlFor="remember" className="text-gray-700 cursor-pointer">
              Keep me signed in. <span className="text-blue-600 hover:underline">Details</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="amazon-btn-primary w-full py-2 font-medium text-sm shadow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-amazon-blue border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
          By continuing, you agree to Amazon Clone's{' '}
          <a href="#" className="text-blue-600 hover:underline">Conditions of Use</a> and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
        </p>
      </div>

      {/* New to Amazon Divider */}
      <div className="w-full max-w-sm mt-6 text-center relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <span className="relative bg-white px-3 text-xs text-gray-500">New to Amazon?</span>
      </div>

      <Link
        to="/register"
        className="w-full max-w-sm mt-3 amazon-btn-secondary text-center text-xs py-2 font-medium shadow"
      >
        Create your Amazon account
      </Link>
    </div>
  );
};

export default Login;
