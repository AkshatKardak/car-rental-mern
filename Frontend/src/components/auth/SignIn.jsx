import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithFirebase, loginWithGoogle } from '../../services/firebaseAuthService';
import api from '../../services/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useFirebase, setUseFirebase] = useState(true); // Toggle between Firebase and traditional
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Firebase Login
  const handleFirebaseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginWithFirebase(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Traditional Login (Fallback)
  const handleTraditionalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useFirebase ? handleFirebaseSubmit : handleTraditionalSubmit;

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#FFFFFF',
    cardBg: isDarkMode ? '#1e293b' : '#FFFFFF',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#E5E7EB',
    inputBg: isDarkMode ? '#1e293b' : '#F8F9FA',
    primary: isDarkMode ? '#10b981' : '#10b981',
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-xl transition-all duration-300 hover:scale-110 z-50"
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#F8F9FA',
          border: `1px solid ${theme.border}`
        }}
      >
        {isDarkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} style={{ color: theme.textSecondary }} />
        )}
      </button>

      <div 
        className="max-w-md w-full rounded-2xl shadow-2xl p-8 transition-all duration-300"
        style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`
        }}
      >
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text }}
          >
            Welcome Back
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Sign in to your RentRide account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border flex items-center gap-3" style={{
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
            borderColor: '#EF4444'
          }}>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-6 px-6 py-3 rounded-xl border font-bold flex items-center justify-center gap-3 hover:shadow-md transition-all disabled:opacity-50"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
            color: theme.text
          }}
        >
          <FcGoogle className="w-6 h-6" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
          <span className="text-sm" style={{ color: theme.textSecondary }}>OR</span>
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 outline-none"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                color: theme.text
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 outline-none"
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.textSecondary }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.primary
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Authentication Method (for testing) */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setUseFirebase(!useFirebase)}
            className="text-xs"
            style={{ color: theme.textSecondary }}
          >
            {useFirebase ? 'Using Firebase Auth' : 'Using Traditional Auth'}
          </button>
        </div>

        <p 
          className="text-center mt-6"
          style={{ color: theme.textSecondary }}
        >
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-semibold hover:underline"
            style={{ color: theme.primary }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
