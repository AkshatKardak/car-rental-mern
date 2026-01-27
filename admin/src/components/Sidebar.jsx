import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { LayoutDashboard, CarFront, CalendarDays, AlertTriangle, BarChart3, ChevronRight } from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <CarFront size={20} />, label: 'Vehicles', path: '/admin/vehicles' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', path: '/admin/bookings' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <AlertTriangle size={20} />, label: 'Damage Reports', path: '/admin/damage' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-border-light z-30 h-full shadow-lg shadow-black/5">
      <div className="p-8 pb-10 flex items-center justify-center">
        <img src={logo} alt="RentRide Logo" className="h-10 w-auto object-contain brightness-110" />
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4 py-2 overflow-y-auto no-scrollbar">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary'} transition-colors`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-black tracking-tight ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
              </div>
              {isActive && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </motion.button>
          )
        })}
      </nav>

      <div className="p-5 border-t border-border-light bg-background-secondary/50">
        <motion.div whileHover={{ x: 3 }} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-border-light shadow-sm hover:border-primary/50 transition-all cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-primary truncate uppercase tracking-tight">Admin</p>
            <p className="text-[10px] text-text-secondary font-bold truncate opacity-60 uppercase">Console</p>
          </div>
          <ChevronRight size={18} className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </motion.div>
      </div>
    </aside>
  )
}

export default Sidebar
