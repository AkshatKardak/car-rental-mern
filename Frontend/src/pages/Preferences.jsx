import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Bell, Globe, MapPin, CreditCard, Shield, Save } from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useTheme } from '../context/ThemeContext';

const Preferences = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    notifications: {
      bookingUpdates: true,
      promotions: false,
      newsletter: true,
      smsAlerts: false
    },
    language: 'en',
    currency: 'INR',
    defaultLocation: 'Mumbai',
    autoPayment: true,
    twoFactorAuth: false
  });

  const handleToggle = (category, key) => {
    if (category) {
      setPreferences({
        ...preferences,
        [category]: {
          ...preferences[category],
          [key]: !preferences[category][key]
        }
      });
    } else {
      setPreferences({
        ...preferences,
        [key]: !preferences[key]
      });
    }
  };

  const handleChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    alert('Preferences saved successfully!');
  };

  return (
    <div 
      className="min-h-screen pb-20"
      style={{ backgroundColor: theme?.background || '#f9fafb' }}
    >
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: theme?.text || '#111827' }}
            >
              Preferences
            </h1>
            <p style={{ color: theme?.textSecondary || '#6b7280' }}>
              Customize your RentRide experience
            </p>
          </div>

          {/* Appearance */}
          <div 
            className="rounded-3xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme?.card || '#ffffff',
              borderColor: theme?.border || '#e5e7eb'
            }}
          >
            <h3 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme?.text || '#111827' }}
            >
              <Moon size={20} className="text-green-500" />
              Appearance
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: theme?.text || '#111827' }}
                >
                  Dark Mode
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme?.textSecondary || '#6b7280' }}
                >
                  Use dark theme across the app
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition ${
                  isDarkMode ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div 
            className="rounded-3xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme?.card || '#ffffff',
              borderColor: theme?.border || '#e5e7eb'
            }}
          >
            <h3 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme?.text || '#111827' }}
            >
              <Bell size={20} className="text-green-500" />
              Notifications
            </h3>
            
            {Object.entries({
              bookingUpdates: 'Booking Updates',
              promotions: 'Promotions & Offers',
              newsletter: 'Newsletter',
              smsAlerts: 'SMS Alerts'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: theme?.border }}>
                <p style={{ color: theme?.text || '#111827' }}>{label}</p>
                <button
                  onClick={() => handleToggle('notifications', key)}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.notifications[key] ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences.notifications[key] ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Regional Settings */}
          <div 
            className="rounded-3xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme?.card || '#ffffff',
              borderColor: theme?.border || '#e5e7eb'
            }}
          >
            <h3 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme?.text || '#111827' }}
            >
              <Globe size={20} className="text-green-500" />
              Regional Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme?.text || '#111827' }}
                >
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    backgroundColor: theme?.background || '#f9fafb',
                    borderColor: theme?.border || '#e5e7eb',
                    color: theme?.text || '#111827'
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme?.text || '#111827' }}
                >
                  Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    backgroundColor: theme?.background || '#f9fafb',
                    borderColor: theme?.border || '#e5e7eb',
                    color: theme?.text || '#111827'
                  }}
                >
                  <option value="INR">₹ INR - Indian Rupee</option>
                  <option value="USD">$ USD - US Dollar</option>
                  <option value="EUR">€ EUR - Euro</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold mb-2 flex items-center gap-2"
                  style={{ color: theme?.text || '#111827' }}
                >
                  <MapPin size={16} />
                  Default Pickup Location
                </label>
                <select
                  value={preferences.defaultLocation}
                  onChange={(e) => handleChange('defaultLocation', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{
                    backgroundColor: theme?.background || '#f9fafb',
                    borderColor: theme?.border || '#e5e7eb',
                    color: theme?.text || '#111827'
                  }}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div 
            className="rounded-3xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme?.card || '#ffffff',
              borderColor: theme?.border || '#e5e7eb'
            }}
          >
            <h3 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme?.text || '#111827' }}
            >
              <Shield size={20} className="text-green-500" />
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="font-semibold"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <CreditCard size={16} className="inline mr-2" />
                    Auto Payment
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: theme?.textSecondary || '#6b7280' }}
                  >
                    Automatically charge saved card for bookings
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(null, 'autoPayment')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.autoPayment ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences.autoPayment ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="font-semibold"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    Two-Factor Authentication
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: theme?.textSecondary || '#6b7280' }}
                  >
                    Add an extra layer of security
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(null, 'twoFactorAuth')}
                  className={`relative w-14 h-8 rounded-full transition ${
                    preferences.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences.twoFactorAuth ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2"
            >
              <Save size={20} />
              Save Preferences
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Preferences;
