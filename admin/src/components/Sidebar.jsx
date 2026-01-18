import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', path: '/admin/analytics' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 glass-panel border-r border-white/5 z-20 h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img
          src={logo}
          alt="RentRide Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={index}
              whileHover={{ x: 3 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group text-left ${
                isActive
                  ? 'bg-primary/10 border border-primary/20 text-white shadow-neon'
                  : 'hover:bg-white/5 hover:text-white text-slate-400'
              }`}
            >
              <span 
                className={`material-symbols-outlined ${
                  isActive ? 'text-primary' : 'group-hover:text-primary'
                } transition-colors`}
                style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </motion.button>
          )
        })}

        <div className="pt-4 mt-2 border-t border-white/5">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            System
          </p>
          <motion.button
            whileHover={{ x: 3 }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white text-slate-400 transition-all duration-300 group text-left"
          >
            <span 
              className="material-symbols-outlined group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
            >
              settings
            </span>
            <span className="font-medium">Settings</span>
          </motion.button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-purple to-primary flex items-center justify-center text-white font-bold text-sm">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Morgan</p>
            <p className="text-xs text-slate-400 truncate">Super Admin</p>
          </div>
          <span 
            className="material-symbols-outlined text-slate-400 text-lg"
            style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
          >
            expand_more
          </span>
        </motion.div>
      </div>
    </aside>
  )
}

export default Sidebar
