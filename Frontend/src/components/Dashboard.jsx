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
    <div className="min-h-screen bg-background-secondary">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-border-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="RentRide Logo" className="h-10 w-auto object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-text-primary hover:text-primary font-medium transition-colors">
                Browse Cars
              </button>
              <button className="text-text-primary hover:text-primary font-medium transition-colors">
                My Bookings
              </button>
              <button className="text-text-primary hover:text-primary font-medium transition-colors">
                AI Assistant
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-4 pl-6 border-l border-border-light">
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">{user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-text-primary hover:text-primary"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border-light">
            <div className="px-4 py-4 space-y-3">
              <button className="block w-full text-left text-text-primary hover:text-primary py-2 px-4 rounded-lg font-medium">
                Browse Cars
              </button>
              <button className="block w-full text-left text-text-primary hover:text-primary py-2 px-4 rounded-lg font-medium">
                My Bookings
              </button>
              <button className="block w-full text-left text-text-primary hover:text-primary py-2 px-4 rounded-lg font-medium">
                AI Assistant
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-500 py-2 px-4 border-t border-border-light font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-primary rounded-xl p-8 text-white mb-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-white/90">Ready to find your perfect ride today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-text-primary mt-1">0</p>
              </div>
              <div className="bg-background-secondary p-3 rounded-full">
                <Car className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Upcoming Trips</p>
                <p className="text-3xl font-bold text-text-primary mt-1">0</p>
              </div>
              <div className="bg-background-secondary p-3 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Trips</p>
                <p className="text-3xl font-bold text-text-primary mt-1">0</p>
              </div>
              <div className="bg-background-secondary p-3 rounded-full">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-3 bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-lg transition font-semibold">
              <Car className="w-5 h-5" />
              <span>Rent a Car Now</span>
            </button>

            <button className="flex items-center justify-center space-x-3 bg-white border border-primary text-primary hover:bg-background-secondary px-6 py-4 rounded-lg transition font-semibold">
              <MessageCircle className="w-5 h-5" />
              <span>AI Car Assistant</span>
            </button>

            <button className="flex items-center justify-center space-x-3 bg-white border border-border-light text-text-secondary hover:bg-background-secondary px-6 py-4 rounded-lg transition font-semibold">
              <Calendar className="w-5 h-5" />
              <span>View My Bookings</span>
            </button>
          </div>
        </div>

        {/* Active Bookings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-4">Active Bookings</h3>
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No active bookings</p>
            <p className="text-text-secondary text-sm mb-4">Start your journey by renting a car today!</p>
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition font-semibold">
              Browse Available Cars
            </button>
          </div>
        </div>

        {/* Recommended for You */}
        <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-border-light rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div className="bg-background-secondary h-48 flex items-center justify-center border-b border-border-light">
                  <Car className="w-16 h-16 text-text-secondary/50" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-text-primary mb-2">Premium Car Model {item}</h4>
                  <p className="text-text-secondary text-sm mb-3">
                    Starting from <span className="text-primary font-bold">₹2,500/day</span>
                  </p>
                  <button className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
