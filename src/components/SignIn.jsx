import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/logo.png';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy credentials for testing
  const DUMMY_USER = {
    email: 'user@demo.com',
    password: 'demo123'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check dummy credentials OR accept any login for demo
      if (formData.email && formData.password) {
        // Create dummy user data
        const userData = {
          id: 'dummy-user-id-123',
          name: formData.email.split('@')[0], // Use email prefix as name
          email: formData.email,
          phone: '+91 9876543210',
          role: 'user'
        };

        // Store dummy token and user data
        localStorage.setItem('token', 'dummy-jwt-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Please enter email and password');
      }
      setLoading(false);
    }, 1000); // 1 second delay to simulate API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={Logo} alt="RentRide Logo" className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
          <p className="text-cyan-400 text-sm font-semibold mb-2">🎯 Demo Mode - Use any credentials to login</p>
          <p className="text-gray-400 text-xs">Just enter any email and password to test the app</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-white placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 font-semibold hover:text-cyan-300">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-400">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
