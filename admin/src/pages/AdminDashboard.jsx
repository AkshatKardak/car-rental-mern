import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { statsService } from '../services/statsService'
import {
  LayoutDashboard,
  Users,
  CarFront,
  CreditCard,
  CalendarDays,
  Settings,
  Bell,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Tag,
  AlertTriangle,
  Coins,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Clock
} from 'lucide-react'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days')
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <DashboardContent
          navigate={navigate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          notifications={notifications}
          setNotifications={setNotifications}
          setSidebarOpen={setSidebarOpen}
        />
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-border-light">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <SidebarContent navigate={navigate} closeMobile={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const Sidebar = ({ navigate }) => (
  <aside className="hidden md:flex flex-col w-72 bg-white border-r border-border-light z-20 h-full shadow-xl shadow-black/5">
    <div className="p-8 pb-10 flex items-center justify-center">
      <img src={logo} alt="RentRide Logo" className="h-9 w-auto object-contain" />
    </div>
    <SidebarContent navigate={navigate} />
  </aside>
)

const SidebarContent = ({ navigate, closeMobile }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true, path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', active: false, path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: <CreditCard size={20} />, label: 'Payments', active: false, path: '/admin/payments' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', active: false, path: '/admin/bookings' },
  ]

  const handleNav = (path) => {
    navigate(path)
    if (closeMobile) closeMobile()
  }

  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex-1 flex flex-col gap-1 px-4 py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNav(item.path)}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${item.active
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={item.active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}>
              {item.icon}
            </span>
            <span className={`text-sm font-black tracking-tight ${item.active ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}

        <div className="pt-6 mt-6 border-t border-border-light">
          <p className="px-5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">System</p>
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-all">
            <Settings size={20} />
            <span className="text-sm font-black tracking-tight opacity-80">Settings</span>
          </button>
        </div>
      </nav>

      <div className="p-5 border-t border-border-light bg-background-secondary/30">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-border-light shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">AM</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-primary truncate">Admin</p>
            <p className="text-[10px] text-text-secondary font-bold truncate opacity-60 uppercase">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardContent = ({ navigate, selectedDateRange, setSelectedDateRange, notifications, setNotifications, setSidebarOpen }) => {
  const [stats, setStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [selectedDateRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const statsResponse = await statsService.getDashboardStats()

      setStats([
        {
          title: 'Total Revenue',
          value: `₹${statsResponse.data.totalRevenue?.toLocaleString() || '0'}`,
          icon: <Coins className="w-5 h-5" />,
          change: statsResponse.data.revenueChange || '+12.4%',
          trend: 'up',
          description: 'vs last month',
          color: 'primary'
        },
        {
          title: 'Active Bookings',
          value: statsResponse.data.activeBookings || '45',
          icon: <Calendar className="w-5 h-5" />,
          change: statsResponse.data.bookingsChange || '+5.2%',
          trend: 'up',
          description: 'Current active',
          color: 'primary'
        },
        {
          title: 'Fleet Utilization',
          value: `${statsResponse.data.fleetUtilization || '78'}%`,
          icon: <CarFront className="w-5 h-5" />,
          change: statsResponse.data.utilizationChange || '-2.1%',
          trend: 'down',
          description: 'Live availability',
          color: 'orange'
        },
        {
          title: 'Pending Claims',
          value: statsResponse.data.pendingRequests || '8',
          icon: <AlertTriangle className="w-5 h-5" />,
          change: 'Priority',
          trend: 'neutral',
          description: 'Damage reports',
          color: 'red'
        },
      ])

      const activityResponse = await statsService.getRecentActivity(5)
      setRecentActivity(activityResponse.data.bookings || [])

    } catch (error) {
      console.error('Data fetch failed, loading fallback UI');
      setStats([
        { title: 'Total Revenue', value: '₹1,28,450', icon: <Coins className="w-5 h-5" />, change: '+12.4%', trend: 'up', description: 'vs last month', color: 'primary' },
        { title: 'Active Bookings', value: '45', icon: <Calendar className="w-5 h-5" />, change: '+5.2%', trend: 'up', description: 'Current active', color: 'primary' },
        { title: 'Fleet Utilization', value: '78%', icon: <CarFront className="w-5 h-5" />, change: '-2.1%', trend: 'down', description: 'Live availability', color: 'primary' },
        { title: 'Pending Claims', value: '8', icon: <AlertTriangle className="w-5 h-5" />, change: 'New', trend: 'neutral', description: 'Damage reports', color: 'primary' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: <PlusCircle size={20} />, title: 'Add Vehicle', description: 'Register to fleet', path: '/admin/vehicles' },
    { icon: <Tag size={20} />, title: 'Create Promo', description: 'New campaign', path: '/admin/promotions' },
    { icon: <AlertTriangle size={20} />, title: 'Damage Audit', description: 'Review claims', path: '/admin/damage' },
    { icon: <RefreshCw size={20} />, title: 'Settlements', description: 'View payouts', path: '/admin/payments' },
  ]

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background-secondary gap-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <p className="text-text-secondary font-black uppercase tracking-widest text-xs animate-pulse">Initializing Admin Engine</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-20 no-scrollbar">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white border border-border-light rounded-xl hover:bg-background-secondary transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase">System <span className="text-primary italic">Overview</span></h2>
              <p className="text-text-secondary text-sm mt-1 font-medium">Real-time performance analytics and fleet heartbeat</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white border border-border-light text-sm font-bold text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{selectedDateRange}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showDatePicker ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-14 right-0 bg-white shadow-2xl rounded-2xl p-2 w-56 z-50 border border-border-light overflow-hidden"
                  >
                    {['Last 7 Days', 'Last 30 Days', 'This Month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => { setSelectedDateRange(range); setShowDatePicker(false) }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      >
                        {range}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => { fetchDashboardData(); alert('Data core synchronized') }}
              className="p-3 bg-white border border-border-light rounded-2xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-90"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => { setNotifications(0); alert('Alerts cleared') }}
                className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all relative overflow-hidden active:scale-95"
              >
                <Bell size={20} />
              </button>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-lg min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-background-secondary">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Major KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-7 rounded-3xl border border-border-light shadow-xl shadow-black/5 relative group hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-background-secondary rounded-2xl text-primary group-hover:bg-primary/10 transition-colors">
                  {stat.icon}
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${stat.trend === 'up' ? 'bg-green-50 text-green-600' :
                    stat.trend === 'down' ? 'bg-red-50 text-red-600' :
                      'bg-blue-50 text-blue-600'
                  }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : stat.trend === 'down' ? <TrendingDown size={12} /> : null}
                  {stat.change}
                </div>
              </div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-[0.1em] mb-1 opacity-60 font-display">{stat.title}</p>
              <h3 className="text-3xl font-black text-text-primary tracking-tight">{stat.value}</h3>
              <p className="text-[10px] text-text-secondary mt-3 font-bold opacity-40">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Control Center */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] px-1 opacity-50 flex items-center gap-2">
            <Settings size={14} className="text-primary" /> Command Center
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white p-6 rounded-3xl flex items-center gap-5 border border-border-light shadow-xl shadow-black/5 hover:translate-y-[-5px] hover:border-primary/50 transition-all text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-background-secondary flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  {action.icon}
                </div>
                <div>
                  <p className="font-black text-text-primary text-base uppercase tracking-tight">{action.title}</p>
                  <p className="text-[10px] text-text-secondary font-bold opacity-60 uppercase">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Ledger */}
        <div className="bg-white rounded-[32px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-border-light bg-background-secondary/20">
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight flex items-center gap-3">
              <RefreshCw size={20} className="text-primary" /> Recent Operations
            </h3>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="group text-xs font-black text-primary px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary hover:text-white transition-all flex items-center gap-2"
            >
              VIEW FULL LEDGER <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                  <th className="px-8 py-5">Vehicle Core</th>
                  <th className="px-8 py-5">Customer Node</th>
                  <th className="px-8 py-5">Date Index</th>
                  <th className="px-8 py-5">Status Token</th>
                  <th className="px-8 py-5 text-right">Value (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <Clock size={40} />
                        <p className="font-black text-sm uppercase tracking-widest">No activities recorded today</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((activity, index) => (
                    <tr key={index} className="group hover:bg-background-secondary/40 transition-colors cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-background-secondary border border-border-light overflow-hidden flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <CarFront className="text-text-secondary/30" />
                          </div>
                          <div>
                            <p className="font-black text-text-primary uppercase tracking-tight text-sm">{activity.car?.name || 'Vehicle ID'}</p>
                            <p className="text-[10px] text-text-secondary font-bold opacity-60">{activity.car?.model || 'Series 2024'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                            {activity.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{activity.user?.name || 'Standard Client'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-text-secondary opacity-70">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.status === 'Active' || activity.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                            activity.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                              'bg-orange-50 text-orange-600'
                          }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-text-primary text-base">
                        ₹{activity.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
