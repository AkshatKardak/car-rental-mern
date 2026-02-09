import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2, X } from 'lucide-react';

const Notifications = () => {
    const { isDarkMode } = useTheme();

    // Mock Data
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', title: 'Booking Confirmed', message: 'Your booking for Porsche 911 has been confirmed.', time: '2 hours ago', read: false },
        { id: 2, type: 'warning', title: 'Payment Pending', message: 'You have a pending damage payment for Booking #12345.', time: '5 hours ago', read: false },
        { id: 3, type: 'info', title: 'New Feature', message: 'Try our new AI Damage Analysis feature!', time: '1 day ago', read: true },
        { id: 4, type: 'alert', title: 'Maintenance Alert', message: 'Server maintenance scheduled for tonight.', time: '2 days ago', read: true },
    ]);

    const theme = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        cardBg: isDarkMode ? '#1e293b' : '#ffffff',
        text: isDarkMode ? '#f1f5f9' : '#1F2937',
        textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
        border: isDarkMode ? '#334155' : '#e5e7eb',
        hover: isDarkMode ? '#334155' : '#f3f4f6',
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
            case 'alert': return <Bell className="text-red-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300" style={{ backgroundColor: theme.bg }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2" style={{ color: theme.text }}>Notifications</h1>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>Stay updated with your activities</p>
                    </div>
                    <div className="flex gap-2">
                        {notifications.some(n => !n.read) && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: theme.text }} />
                                <p className="font-bold" style={{ color: theme.textSecondary }}>No notifications yet</p>
                            </motion.div>
                        ) : (
                            notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className={`relative p-5 rounded-2xl border shadow-sm group ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                                    style={{
                                        backgroundColor: theme.cardBg,
                                        borderColor: !notification.read ? theme.border : theme.border
                                    }}
                                >
                                    <div className="flex gap-4">
                                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10 ${notification.type === 'success' ? 'bg-green-500' :
                                                notification.type === 'warning' ? 'bg-orange-500' :
                                                    notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`font-bold text-sm mb-1 ${!notification.read ? 'text-blue-600' : ''}`} style={{ color: !notification.read ? undefined : theme.text }}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                                    <Clock size={10} /> {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-xs leading-relaxed pr-8" style={{ color: theme.textSecondary }}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Notifications;
