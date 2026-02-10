import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save } from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useTheme } from '../context/ThemeContext';

const AccountSettings = () => {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    fullName: 'Jyotsna Kardak',
    email: 'jyotsna.kardak@gmail.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    dateOfBirth: '1995-08-15',
    licenseNumber: 'MH12-20230045678',
    licenseExpiry: '2028-08-15'
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here to update user profile
    console.log('Updated profile:', formData);
    alert('Profile updated successfully!');
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
              Account Settings
            </h1>
            <p style={{ color: theme?.textSecondary || '#6b7280' }}>
              Manage your personal information and account details
            </p>
          </div>

          {/* Profile Image Upload */}
          <div 
            className="rounded-3xl p-8 mb-6 border"
            style={{ 
              backgroundColor: theme?.card || '#ffffff',
              borderColor: theme?.border || '#e5e7eb'
            }}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.fullName.charAt(0)
                  )}
                </div>
                <label 
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full cursor-pointer transition"
                >
                  <Camera size={16} />
                  <input 
                    id="profile-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ color: theme?.text || '#111827' }}
                >
                  {formData.fullName}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: theme?.textSecondary || '#6b7280' }}
                >
                  {formData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div 
              className="rounded-3xl p-8 border"
              style={{ 
                backgroundColor: theme?.card || '#ffffff',
                borderColor: theme?.border || '#e5e7eb'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* Address */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <MapPin size={16} className="inline mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    <Calendar size={16} className="inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* License Number */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>

                {/* License Expiry */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme?.text || '#111827' }}
                  >
                    License Expiry
                  </label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{
                      backgroundColor: theme?.background || '#f9fafb',
                      borderColor: theme?.border || '#e5e7eb',
                      color: theme?.text || '#111827'
                    }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AccountSettings;
