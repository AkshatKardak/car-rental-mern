import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Calendar, MessageCircle, User, LogOut, Menu, X } from 'lucide-react';
import Logo from '../assets/logo.png';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation - Matching Landing Page Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50 shadow-lg shadow-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="RentRide Logo" className="h-10 w-auto object-contain" />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.button 
                whileHover={{ scale: 1.1, color: '#06b6d4' }}
                className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors"
              >
                Browse Cars
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, color: '#06b6d4' }}
                className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors"
              >
                My Bookings
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, color: '#06b6d4' }}
                className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors"
              >
                AI Assistant
              </motion.button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3 border-l border-purple-500/30 pl-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition border border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold">Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-cyan-400"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 border-t border-purple-500/30"
          >
            <div className="px-4 py-4 space-y-3">
              <button className="block w-full text-left text-gray-300 hover:text-cyan-400 py-2 px-4 rounded-lg hover:bg-slate-800 transition-all font-semibold">
                Browse Cars
              </button>
              <button className="block w-full text-left text-gray-300 hover:text-cyan-400 py-2 px-4 rounded-lg hover:bg-slate-800 transition-all font-semibold">
                My Bookings
              </button>
              <button className="block w-full text-left text-gray-300 hover:text-cyan-400 py-2 px-4 rounded-lg hover:bg-slate-800 transition-all font-semibold">
                AI Assistant
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-400 py-2 px-4 border-t border-purple-500/30 font-semibold"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white mb-8 shadow-lg shadow-purple-500/30"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-purple-100">Ready to find your perfect ride today?</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-full border border-purple-500/30">
                <Car className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Trips</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="bg-cyan-600/20 p-3 rounded-full border border-cyan-500/30">
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Trips</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-full border border-purple-500/30">
                <User className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
            >
              <Car className="w-5 h-5" />
              <span>Rent a Car Now</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              <span>AI Car Assistant</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
            >
              <Calendar className="w-5 h-5" />
              <span>View My Bookings</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Active Bookings Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Active Bookings</h3>
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No active bookings</p>
            <p className="text-gray-500 text-sm mb-4">Start your journey by renting a car today!</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
            >
              Browse Available Cars
            </motion.button>
          </div>
        </motion.div>

        {/* Recommended for You */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-purple-500/30 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder Car Cards */}
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900/50 border border-purple-500/30 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/30 transition"
              >
                <div className="bg-slate-800/50 h-48 flex items-center justify-center border-b border-purple-500/30">
                  <Car className="w-16 h-16 text-purple-500/50" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white mb-2">Premium Car Model {item}</h4>
                  <p className="text-gray-400 text-sm mb-3">Starting from <span className="text-cyan-400 font-bold">₹2,500/day</span></p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
