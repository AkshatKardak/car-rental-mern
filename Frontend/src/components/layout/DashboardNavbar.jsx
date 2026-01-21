import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Settings, Menu, X, Car } from "lucide-react";
import Logo from "../../assets/logo.png";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const avatarText = useMemo(() => {
    const name = user?.name || "User";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // ✅ MUST MATCH App.jsx routes
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
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light shadow-sm"
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
        <nav className="hidden md:flex items-center gap-2 bg-background-secondary border border-border-light rounded-full px-2 py-1">
          {tabs.map((t) => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              type="button"
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition ${isActive(t.path) ? "text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
            >
              {isActive(t.path) && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white border border-border-light shadow-sm"
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: icons + profile */}
        <div className="flex items-center gap-1.5">
          <button
            className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-border-light items-center justify-center hover:bg-background-secondary transition shadow-sm"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Only keep Settings if you really have /settings route, else remove */}
          <button
            className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-border-light items-center justify-center hover:bg-background-secondary transition shadow-sm"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
            type="button"
          >
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>

          {/* User Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-primary p-[1.5px] shadow-sm hover:scale-105 transition-transform"
            aria-label="Profile"
            type="button"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-primary">
              {avatarText}
            </div>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
            aria-label="Open menu"
            type="button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-text-secondary" />
            ) : (
              <Menu className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-light bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.path}
                onClick={() => {
                  navigate(t.path);
                  setMobileOpen(false);
                }}
                type="button"
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border transition ${isActive(t.path)
                    ? "bg-primary/5 border-primary/20 text-primary"
                    : "bg-white border-border-light text-text-secondary hover:text-text-primary hover:bg-background-secondary"
                  }`}
              >
                {t.label === "Dashboard" ? (
                  <Car className="w-5 h-5 text-primary" />
                ) : (
                  <span className="w-5" />
                )}
                <span className="font-semibold">{t.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              type="button"
              className="w-full px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 font-semibold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default DashboardNavbar;
