import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/logo.png";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme(); // Add theme hook
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Dummy Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      icon: <CheckCircle size={18} />,
      title: 'Booking Confirmed',
      message: 'Your Tesla Model S booking is confirmed',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      icon: <Info size={18} />,
      title: 'Payment Reminder',
      message: 'Your payment of ₹18,500 is due tomorrow',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      icon: <AlertCircle size={18} />,
      title: 'Vehicle Return Due',
      message: 'Please return your vehicle by 6:00 PM today',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarText = useMemo(() => {
    const name = user?.name || "User";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signin");
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const tabs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Browse Cars", path: "/browsecars" },
    { label: "My Bookings", path: "/mybookings" },
    { label: "Payment", path: "/payment" },
    { label: "Offers", path: "/offers" },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDarkMode ? '#334155' : '#e5e7eb'
      }}
      className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 hover:opacity-90 transition"
          type="button"
        >
          <img src={Logo} alt="RentRide" className="h-50 w-auto object-contain" />
        </button>

        {/* Center: tabs (desktop) */}
        <nav 
          className="hidden md:flex items-center gap-2 border rounded-full px-2 py-1 transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#f8f9fa',
            borderColor: isDarkMode ? '#334155' : '#e5e7eb'
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              type="button"
              className="relative px-4 py-2 rounded-full text-sm font-semibold transition"
              style={{
                color: isActive(t.path) 
                  ? '#10b981' 
                  : isDarkMode ? '#cbd5e1' : '#6B7280'
              }}
            >
              {isActive(t.path) && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e5e7eb'
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: icons + profile */}
        <div className="flex items-center gap-1.5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-opacity-50 transition-all shadow-sm relative group"
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderColor: isDarkMode ? '#334155' : '#e5e7eb'
            }}
            type="button"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative hidden sm:block" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
                setShowUserMenu(false);
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-opacity-50 transition-all shadow-sm relative"
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#e5e7eb'
              }}
              type="button"
            >
              <Bell className="w-5 h-5" style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }} />
              {unreadCount > 0 && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2"
                  style={{ borderColor: isDarkMode ? '#0f172a' : '#ffffff' }}
                ></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border overflow-hidden"
                  style={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e5e7eb'
                  }}
                >
                  <div 
                    className="p-4 border-b flex justify-between items-center"
                    style={{ borderColor: isDarkMode ? '#334155' : '#e5e7eb' }}
                  >
                    <h3 className="font-bold" style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}>
                      Notifications
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-green-500 font-semibold hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm" style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className="w-full p-4 border-b hover:bg-opacity-50 transition text-left"
                          style={{
                            backgroundColor: !notif.read 
                              ? (isDarkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.05)') 
                              : 'transparent',
                            borderColor: isDarkMode ? '#334155' : '#e5e7eb'
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 ${notif.type === 'success' ? 'text-green-500' : notif.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                              {notif.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm" style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}>
                                {notif.title}
                              </p>
                              <p className="text-xs mt-1" style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }}>
                                {notif.message}
                              </p>
                              <p className="text-xs mt-1" style={{ color: isDarkMode ? '#94a3b8' : '#9CA3AF' }}>
                                {notif.time}
                              </p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <div className="relative hidden sm:block" ref={settingsRef}>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-opacity-50 transition-all shadow-sm"
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#e5e7eb'
              }}
              type="button"
            >
              <Settings className="w-5 h-5" style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }} />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden"
                  style={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e5e7eb'
                  }}
                >
                  <div className="p-2">
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-opacity-50 rounded-xl transition"
                      style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}
                    >
                      Account Settings
                    </button>
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-opacity-50 rounded-xl transition"
                      style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}
                    >
                      Preferences
                    </button>
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-opacity-50 rounded-xl transition"
                      style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}
                    >
                      Help & Support
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowSettings(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border hover:bg-opacity-50 transition-all shadow-sm"
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#e5e7eb'
              }}
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                {avatarText}
              </div>
              <ChevronDown size={16} style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden"
                  style={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e5e7eb'
                  }}
                >
                  <div 
                    className="p-4 border-b"
                    style={{ borderColor: isDarkMode ? '#334155' : '#e5e7eb' }}
                  >
                    <p className="font-semibold" style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}>
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: isDarkMode ? '#cbd5e1' : '#6B7280' }}>
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-opacity-50 rounded-xl transition flex items-center gap-2"
                      style={{ color: isDarkMode ? '#f1f5f9' : '#1F2937' }}
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full border flex items-center justify-center hover:bg-opacity-50 transition-all"
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderColor: isDarkMode ? '#334155' : '#e5e7eb',
              color: isDarkMode ? '#cbd5e1' : '#1F2937'
            }}
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden"
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderColor: isDarkMode ? '#334155' : '#e5e7eb'
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {tabs.map((t) => (
                <button
                  key={t.path}
                  onClick={() => {
                    navigate(t.path);
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm rounded-xl transition"
                  style={{
                    backgroundColor: isActive(t.path)
                      ? (isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)')
                      : 'transparent',
                    color: isActive(t.path)
                      ? '#10b981'
                      : isDarkMode ? '#f1f5f9' : '#1F2937',
                    fontWeight: isActive(t.path) ? '600' : '400'
                  }}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default DashboardNavbar;
