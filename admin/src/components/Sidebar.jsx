import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarDays, 
  AlertTriangle, 
  BarChart3, 
  ChevronRight,
  Users,
  CreditCard,
  Tag,
  Settings,
  LogOut
} from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      navigate('/admin/login')
    }
  }

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicle Management', path: '/admin/vehicles' },
    { icon: <CalendarDays size={20} />, label: 'Booking Management', path: '/admin/bookings' },
    { icon: <CreditCard size={20} />, label: 'Payment & Revenue', path: '/admin/payments' },
    { icon: <Tag size={20} />, label: 'Offers & Coupons', path: '/admin/promotions' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <AlertTriangle size={20} />, label: 'Damage Reports', path: '/admin/damage' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 z-30 h-full shadow-lg">
      {/* Logo Section */}
      <div className="p-8 pb-6 flex items-center justify-center border-b border-gray-200">
        <img src={logo} alt="RentRide Logo" className="h-10 w-auto object-contain brightness-110" />
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="w-2 h-2 rounded-full bg-blue-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}

        {/* Settings & Logout */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/settings')}
            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all"
          >
            <Settings size={20} />
            <span className="text-sm font-semibold tracking-tight">Settings</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all mt-1"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold tracking-tight">Logout</span>
          </motion.button>
        </div>
      </nav>

      {/* Admin Profile Section */}
      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <motion.div 
          whileHover={{ x: 3 }} 
          className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">Admin</p>
            <p className="text-[10px] text-gray-500 font-bold truncate uppercase">Super Admin</p>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </motion.div>
      </div>
    </aside>
  )
}

export default Sidebar
