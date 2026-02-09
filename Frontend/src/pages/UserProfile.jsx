import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Phone, MapPin, Camera, Save, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const UserProfile = () => {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profileImage: ''
    });

    const theme = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        cardBg: isDarkMode ? '#1e293b' : '#ffffff',
        text: isDarkMode ? '#f1f5f9' : '#1F2937',
        textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
        border: isDarkMode ? '#334155' : '#e5e7eb',
        inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
    };

    // Simulated fetch - replace with actual API call
    useEffect(() => {
        // Fetch user data logic here
        // For now using local storage or mock
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData({
            name: user.name || 'John Doe',
            email: user.email || 'john@example.com',
            phone: user.phone || '+91 9876543210',
            address: user.address || '123, Main Street, City',
            profileImage: user.profileImage || 'https://via.placeholder.com/150'
        });
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            toast.success('Profile updated successfully!');
            // Update local storage if needed
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300" style={{ backgroundColor: theme.bg }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ backgroundColor: theme.cardBg }}>
                    {/* Header/Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <img
                                    src={userData.profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                                    style={{ borderColor: theme.cardBg }}
                                />
                                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition shadow-md">
                                    <Camera size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <h1 className="text-3xl font-black mb-1" style={{ color: theme.text }}>{userData.name}</h1>
                        <p className="text-sm font-medium mb-8" style={{ color: theme.textSecondary }}>{userData.email}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.textSecondary }} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.textSecondary }} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border opacity-60 cursor-not-allowed"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.textSecondary }} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.textSecondary }} />
                                        <input
                                            type="text"
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t" style={{ borderColor: theme.border }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;
