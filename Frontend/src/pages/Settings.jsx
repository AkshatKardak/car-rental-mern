import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Bell, Lock, Shield, Smartphone, Moon, Globe, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    const theme = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        cardBg: isDarkMode ? '#1e293b' : '#ffffff',
        text: isDarkMode ? '#f1f5f9' : '#1F2937',
        textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
        border: isDarkMode ? '#334155' : '#e5e7eb',
        hover: isDarkMode ? '#334155' : '#f3f4f6',
    };

    const Section = ({ title, children }) => (
        <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 ml-2" style={{ color: theme.textSecondary }}>{title}</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                {children}
            </div>
        </div>
    );

    const ToggleItem = ({ icon: Icon, title, description, checked, onChange }) => (
        <div className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-opacity-50 transition-colors" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm" style={{ color: theme.text }}>{title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{description}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300" style={{ backgroundColor: theme.bg }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2" style={{ color: theme.text }}>Settings</h1>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>Manage your preferences and account settings</p>
                </div>

                <Section title="Appearance">
                    <ToggleItem
                        icon={Moon}
                        title="Dark Mode"
                        description="Switch between light and dark themes"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                </Section>

                <Section title="Notifications">
                    <ToggleItem
                        icon={Bell}
                        title="Push Notifications"
                        description="Receive alerts about your bookings"
                        checked={true}
                        onChange={() => toast.success('Preference updated')}
                    />
                    <ToggleItem
                        icon={Smartphone}
                        title="SMS Alerts"
                        description="Get important updates via SMS"
                        checked={false}
                        onChange={() => toast.success('Preference updated')}
                    />
                </Section>

                <Section title="Privacy & Security">
                    <div className="flex items-center justify-between p-4 border-b last:border-0 cursor-pointer hover:bg-opacity-50 transition-colors group" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-600">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm" style={{ color: theme.text }}>Change Password</h4>
                                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>Update your account password</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                    <ToggleItem
                        icon={Shield}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security"
                        checked={false}
                        onChange={() => toast.success('Preference updated')}
                    />
                </Section>

                <div className="text-center mt-12">
                    <button className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors">
                        Sign Out
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Version 1.0.2</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
