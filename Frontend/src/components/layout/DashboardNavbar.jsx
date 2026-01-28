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
      className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark shadow-sm dark:shadow-dark transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 hover:opacity-90 transition"
          type="button"
        >
          <img src={Logo} alt="RentRide" className="h-9 w-auto object-contain" />
        </button>

        {/* Center: tabs (desktop) */}
        <nav className="hidden md:flex items-center gap-2 bg-background-secondary dark:bg-background-dark-secondary border border-border-light dark:border-border-dark rounded-full px-2 py-1 transition-colors">
          {tabs.map((t) => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              type="button"
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition ${
                isActive(t.path) 
                  ? "text-primary dark:text-primary-dark" 
                  : "text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary"
              }`}
            >
              {isActive(t.path) && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white dark:bg-background-dark-tertiary border border-border-light dark:border-border-dark shadow-sm"
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
            className="w-10 h-10 rounded-full bg-white dark:bg-background-dark-secondary border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition-all shadow-sm relative group"
            type="button"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400 animate-spin-slow" />
            ) : (
              <Moon size={20} className="text-text-secondary dark:text-text-dark-secondary" />
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
              className="w-10 h-10 rounded-full bg-white dark:bg-background-dark-secondary border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition-all shadow-sm relative"
              type="button"
            >
              <Bell className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-background-dark-secondary rounded-2xl shadow-xl dark:shadow-dark border border-border-light dark:border-border-dark overflow-hidden"
                >
                  <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h3 className="font-bold text-text-primary dark:text-text-dark-primary">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-primary dark:text-primary-dark font-semibold hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-text-secondary dark:text-text-dark-secondary text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`w-full p-4 border-b border-border-light dark:border-border-dark hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition text-left ${
                            !notif.read ? 'bg-primary/5 dark:bg-primary-dark/5' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 ${notif.type === 'success' ? 'text-green-500' : notif.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                              {notif.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-text-primary dark:text-text-dark-primary">{notif.title}</p>
                              <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">{notif.message}</p>
                              <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full mt-2"></div>}
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
              className="w-10 h-10 rounded-full bg-white dark:bg-background-dark-secondary border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition-all shadow-sm"
              type="button"
            >
              <Settings className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-background-dark-secondary rounded-2xl shadow-xl dark:shadow-dark border border-border-light dark:border-border-dark overflow-hidden"
                >
                  <div className="p-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-secondary dark:hover:bg-background-dark-tertiary rounded-xl transition">
                      Account Settings
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-secondary dark:hover:bg-background-dark-tertiary rounded-xl transition">
                      Preferences
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-secondary dark:hover:bg-background-dark-tertiary rounded-xl transition">
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
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white dark:bg-background-dark-secondary border border-border-light dark:border-border-dark hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition-all shadow-sm"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center text-xs font-bold">
                {avatarText}
              </div>
              <ChevronDown size={16} className="text-text-secondary dark:text-text-dark-secondary" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-background-dark-secondary rounded-2xl shadow-xl dark:shadow-dark border border-border-light dark:border-border-dark overflow-hidden"
                >
                  <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <p className="font-semibold text-text-primary dark:text-text-dark-primary">{user?.name || "User"}</p>
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">{user?.email || "user@example.com"}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-text-primary dark:text-text-dark-primary hover:bg-background-secondary dark:hover:bg-background-dark-tertiary rounded-xl transition flex items-center gap-2">
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition flex items-center gap-2"
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
            className="md:hidden w-10 h-10 rounded-full bg-white dark:bg-background-dark-secondary border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-background-secondary dark:hover:bg-background-dark-tertiary transition-all"
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
            className="md:hidden border-t border-border-light dark:border-border-dark bg-white dark:bg-background-dark-secondary overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {tabs.map((t) => (
                <button
                  key={t.path}
                  onClick={() => {
                    navigate(t.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm rounded-xl transition ${
                    isActive(t.path)
                      ? "bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark font-semibold"
                      : "text-text-primary dark:text-text-dark-primary hover:bg-background-secondary dark:hover:bg-background-dark-tertiary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
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
