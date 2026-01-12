import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedDateRange, setSelectedDateRange] = useState('Oct 24 - Nov 24')
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="relative flex h-screen w-full bg-dashboard-gradient overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <DashboardContent 
          navigate={navigate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </main>

      {/* Mobile Menu Button */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-14 h-14 bg-gradient-to-r from-accent-purple to-primary rounded-full shadow-neon flex items-center justify-center text-white"
        >
          <span 
            className="material-symbols-outlined"
            style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
          >
            menu
          </span>
        </motion.button>
      </div>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '#' },
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
        {navItems.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 3 }}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group text-left ${
              item.active
                ? 'bg-primary/10 border border-primary/20 text-white shadow-neon'
                : 'hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <span 
              className={`material-symbols-outlined ${
                item.active ? 'text-primary' : 'group-hover:text-primary'
              } transition-colors`}
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}

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

const DashboardContent = ({ navigate, selectedDateRange, setSelectedDateRange, notifications, setNotifications }) => {
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: '$128,450',
      icon: 'payments',
      change: '+12%',
      trend: 'up',
      description: 'vs last month',
      color: 'primary'
    },
    {
      title: 'Active Bookings',
      value: '45',
      icon: 'key',
      change: '+5%',
      trend: 'up',
      description: 'vs last week',
      color: 'primary'
    },
    {
      title: 'Fleet Utilization',
      value: '78%',
      icon: 'speed',
      change: '-2%',
      trend: 'down',
      description: 'Capacity warning',
      color: 'accent-purple'
    },
    {
      title: 'Pending Requests',
      value: '8',
      icon: 'pending_actions',
      change: 'New',
      trend: 'neutral',
      description: 'Require approval',
      color: 'primary'
    },
  ])

  const [recentActivity, setRecentActivity] = useState([
    {
      car: 'Tesla Model S',
      variant: 'Plaid Edition',
      customer: 'Sarah Jenning',
      date: 'Oct 24, 2023',
      status: 'Active',
      amount: '$450.00',
      statusColor: 'emerald'
    },
    {
      car: 'Porsche 911',
      variant: 'Carrera S',
      customer: 'Mike Ross',
      date: 'Oct 23, 2023',
      status: 'Completed',
      amount: '$1,200.00',
      statusColor: 'blue'
    },
    {
      car: 'BMW M4',
      variant: 'Competition',
      customer: 'Jessica Wu',
      date: 'Oct 22, 2023',
      status: 'Pending',
      amount: '$650.00',
      statusColor: 'amber'
    },
  ])

const quickActions = [
  { icon: 'add_circle', title: 'Add Vehicle', description: 'Register to fleet', color: 'primary', path: '/admin/vehicles' },
  { icon: 'local_offer', title: 'Create Promo', description: 'Marketing campaign', color: 'accent-purple', path: '/admin/promotions' },
  { icon: 'car_crash', title: 'Review Damage', description: 'Process claims', color: 'rose', path: '/admin/damage' },
  { icon: 'currency_exchange', title: 'Refund Request', description: 'View pending', color: 'amber', path: '#' },
]




  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleRefreshData = () => {
    // Simulate data refresh
    const newRevenue = '$' + (Math.floor(Math.random() * 50000) + 100000).toLocaleString()
    const newStats = [...stats]
    newStats[0].value = newRevenue
    setStats(newStats)
    
    // Show notification
    alert('Data refreshed successfully!')
  }

  const handleNotificationClick = () => {
    setNotifications(0)
    alert('You have checked all notifications!')
  }

  const handleQuickAction = (action) => {
    if (action.path !== '#') {
      navigate(action.path)
    } else {
      alert(`${action.title} feature coming soon!`)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">DASHBOARD</h2>
            <p className="text-slate-400 mt-1">Overview of fleet performance and recent activity</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-primary/50 transition-all"
              >
                <span 
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  calendar_today
                </span>
                <span>{selectedDateRange}</span>
                <span 
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  expand_more
                </span>
              </motion.button>
              
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-12 right-0 glass-panel rounded-lg p-2 w-48 z-50 border border-white/10"
                >
                  <button onClick={() => { setSelectedDateRange('Last 7 Days'); setShowDatePicker(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded">Last 7 Days</button>
                  <button onClick={() => { setSelectedDateRange('Last 30 Days'); setShowDatePicker(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded">Last 30 Days</button>
                  <button onClick={() => { setSelectedDateRange('This Month'); setShowDatePicker(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded">This Month</button>
                </motion.div>
              )}
            </div>
            
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNotificationClick}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-slate-900 hover:bg-white hover:shadow-neon transition-all"
              >
                <span 
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  notifications
                </span>
              </motion.button>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span 
                  className={`material-symbols-outlined text-6xl text-${stat.color}`}
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48' }}
                >
                  {stat.icon}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`flex items-center ${
                  stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' :
                  stat.trend === 'down' ? 'text-rose-400 bg-rose-400/10' :
                  'text-emerald-400 bg-emerald-400/10'
                } px-2 py-0.5 rounded text-xs font-bold`}>
                  <span 
                    className="material-symbols-outlined text-sm mr-1"
                    style={{ fontVariationSettings: '"FILL" 0, "wght" 700, "GRAD" 0, "opsz" 20' }}
                  >
                    {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'priority_high'}
                  </span>
                  {stat.change}
                </span>
                <span className="text-slate-500 text-xs">{stat.description}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                <p className="text-slate-400 text-sm">Monthly performance trends</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={handleRefreshData}
                className="text-primary hover:text-white text-sm font-medium transition-colors"
              >
                View Report
              </motion.button>
            </div>

            {/* Chart */}
            <div className="w-full h-[280px] relative mt-8">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-600">
                {['40k', '30k', '20k', '10k', '0'].map((label, i) => (
                  <div key={i} className="flex w-full items-center">
                    <span className="w-8">{label}</span>
                    <div className="flex-1 h-px bg-white/5 ml-2"></div>
                  </div>
                ))}
              </div>

              {/* SVG Chart */}
              <svg className="absolute inset-0 ml-10 h-full w-[calc(100%-2.5rem)] chart-glow" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#13c8ec" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#13c8ec" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,45 C10,40 15,30 25,32 C35,34 40,25 50,20 C60,15 70,25 80,15 C90,5 95,10 100,5 L100,50 L0,50 Z" fill="url(#gradientArea)" />
                <path d="M0,45 C10,40 15,30 25,32 C35,34 40,25 50,20 C60,15 70,25 80,15 C90,5 95,10 100,5" fill="none" stroke="#13c8ec" strokeWidth="0.8" />
                <circle cx="25" cy="32" r="1.5" fill="#0f172a" stroke="#13c8ec" strokeWidth="0.5" />
                <circle cx="50" cy="20" r="1.5" fill="#0f172a" stroke="#13c8ec" strokeWidth="0.5" />
                <circle cx="80" cy="15" r="1.5" fill="#0f172a" stroke="#13c8ec" strokeWidth="0.5" />
              </svg>

              {/* X Axis */}
              <div className="absolute bottom-[-24px] left-10 right-0 flex justify-between text-xs text-slate-500 font-medium px-2">
                {['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25'].map((date, i) => (
                  <span key={i}>{date}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Fleet Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-2xl p-6 flex flex-col"
          >
            <h3 className="text-lg font-bold text-white mb-6">Fleet Status</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Donut Chart */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                  <path className="text-primary chart-glow" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeWidth="3.8" />
                  <path className="text-accent-purple" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="3.8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">85</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total Cars</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(19,200,236,0.6)]"></div>
                  <span className="text-sm text-slate-300">Rented</span>
                </div>
                <span className="text-sm font-bold text-white">51 (60%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <span className="text-sm text-slate-300">Available</span>
                </div>
                <span className="text-sm font-bold text-white">13 (15%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-purple"></div>
                  <span className="text-sm text-slate-300">Maintenance</span>
                </div>
                <span className="text-sm font-bold text-white">21 (25%)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 px-1">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action)}
                className="group glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-all duration-300 text-left border border-white/5 hover:border-primary/40 relative overflow-hidden"
                type="button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-12 h-12 rounded-lg bg-${action.color}/20 flex items-center justify-center text-${action.color} group-hover:bg-${action.color} group-hover:text-white transition-all relative z-10`}>
                  <span 
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                  >
                    {action.icon}
                  </span>
                </div>
                <div className="relative z-10">
                  <p className="font-bold text-white">{action.title}</p>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <button className="text-xs font-semibold text-primary uppercase tracking-wider hover:text-white transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="pb-4 font-medium pl-2">Vehicle</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentActivity.map((activity, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="border-b border-white/5 last:border-0 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-800 border border-white/10"></div>
                        <div>
                          <p className="font-bold text-white">{activity.car}</p>
                          <p className="text-xs text-slate-500">{activity.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                        <span>{activity.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{activity.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${activity.statusColor}-400/10 text-${activity.statusColor}-400 border border-${activity.statusColor}-400/20`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-white pr-2">{activity.amount}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
