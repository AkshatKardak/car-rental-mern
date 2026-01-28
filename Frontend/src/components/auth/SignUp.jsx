import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api'; // Use centralized API

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', { 
        name: formData.name, 
        email: formData.email 
      });

      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running on port 5005.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid registration data');
      } else if (err.response?.status === 409) {
        setError('Email already exists. Please use a different email or sign in.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
            Create Account
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Join RentRide today
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 outline-none"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                color: theme.text
              }}
              placeholder="Enter your name"
              required
              minLength={2}
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 outline-none"
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder="Create a password (min 6 characters)"
                required
                minLength={6}
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

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 outline-none"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                color: theme.text
              }}
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.primary
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p 
          className="text-center mt-6"
          style={{ color: theme.textSecondary }}
        >
          Already have an account?{' '}
          <Link 
            to="/signin" 
            className="font-semibold hover:underline"
            style={{ color: theme.primary }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
