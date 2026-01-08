import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate,Link} from "react-router-dom";
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
    navigate("/signin"); // better than landing
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
      className="sticky top-0 z-50 bg-slate-900/75 backdrop-blur-xl border-b border-white/10"
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
        <nav className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-1">
          {tabs.map((t) => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              type="button"
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition ${
                isActive(t.path) ? "text-white" : "text-purple-400 hover:text-purple-300"
              }`}
            >
              {isActive(t.path) && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/25 to-purple-500/25 border border-white/10"
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
            className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="w-5 h-5 text-slate-200" />
          </button>

          {/* Only keep Settings if you really have /settings route, else remove */}
          <button
            className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
            type="button"
          >
            <Settings className="w-5 h-5 text-slate-200" />
          </button>

          {/* Only keep Profile if you really have /profile route, else remove */}
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-[2px]"
            aria-label="Profile"
            type="button"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
              {avatarText}
            </div>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            aria-label="Open menu"
            type="button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-slate-200" />
            ) : (
              <Menu className="w-5 h-5 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.path}
                onClick={() => {
                  navigate(t.path);
                  setMobileOpen(false);
                }}
                type="button"
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
                  isActive(t.path)
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.label === "Dashboard" ? (
                  <Car className="w-5 h-5 text-cyan-300" />
                ) : (
                  <span className="w-5" />
                )}
                <span className="font-semibold">{t.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              type="button"
              className="w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 font-semibold"
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
