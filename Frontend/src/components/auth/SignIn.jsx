import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Dark Mode Toggle - Top Right */}
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

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
