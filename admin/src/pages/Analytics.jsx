import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const Analytics = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')

  // Dummy Analytics Data
  const analytics = {
    totalRevenue: 2847500,
    totalBookings: 342,
    totalUsers: 156,
    totalVehicles: 45,
    revenueGrowth: 23.5,
    bookingsGrowth: 18.2,
    usersGrowth: 12.8,
    vehiclesGrowth: 8.5,
    monthlyRevenue: [
      { month: 'Aug', revenue: 385000, bookings: 42 },
      { month: 'Sep', revenue: 420000, bookings: 48 },
      { month: 'Oct', revenue: 398000, bookings: 45 },
      { month: 'Nov', revenue: 512000, bookings: 58 },
      { month: 'Dec', revenue: 647000, bookings: 72 },
      { month: 'Jan', revenue: 485500, bookings: 77 }
    ],
    popularVehicles: [
      { name: 'Tesla Model 3', bookings: 45, revenue: 450000 },
      { name: 'BMW X5', bookings: 38, revenue: 380000 },
      { name: 'Mercedes E-Class', bookings: 35, revenue: 525000 },
      { name: 'Audi Q7', bookings: 32, revenue: 512000 },
      { name: 'Range Rover Sport', bookings: 28, revenue: 448000 }
    ],
    recentActivity: [
      { type: 'booking', user: 'Rajesh Kumar', action: 'Booked Tesla Model 3', amount: 45000, time: '2 hours ago' },
      { type: 'payment', user: 'Priya Sharma', action: 'Payment received', amount: 32000, time: '3 hours ago' },
      { type: 'user', user: 'Amit Patel', action: 'New user registration', amount: 0, time: '5 hours ago' },
      { type: 'booking', user: 'Sneha Reddy', action: 'Booked Audi Q7', amount: 72000, time: '8 hours ago' },
      { type: 'damage', user: 'Vikram Singh', action: 'Reported minor damage', amount: 5000, time: '10 hours ago' },
      { type: 'payment', user: 'Anjali Mehta', action: 'Payment received', amount: 98000, time: '12 hours ago' }
    ],
    statusDistribution: [
      { status: 'Confirmed', count: 128, percentage: 37 },
      { status: 'Completed', count: 156, percentage: 46 },
      { status: 'Pending', count: 42, percentage: 12 },
      { status: 'Cancelled', count: 16, percentage: 5 }
    ],
    topCustomers: [
      { name: 'Rajesh Kumar', bookings: 12, spent: 180000 },
      { name: 'Priya Sharma', bookings: 10, spent: 165000 },
      { name: 'Amit Patel', bookings: 9, spent: 142000 },
      { name: 'Sneha Reddy', bookings: 8, spent: 128000 },
      { name: 'Vikram Singh', bookings: 7, spent: 112000 }
    ],
    paymentMethods: [
      { method: 'UPI', count: 145, percentage: 42 },
      { method: 'Credit Card', count: 120, percentage: 35 },
      { method: 'Debit Card', count: 52, percentage: 15 },
      { method: 'Net Banking', count: 25, percentage: 8 }
    ]
  }

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
        <ContentArea analytics={analytics} timeRange={timeRange} setTimeRange={setTimeRange} />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', active: false, path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', active: true, path: '/admin/analytics' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 glass-panel border-r border-white/5 z-20 h-full">
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="RentRide Logo" className="h-12 w-auto object-contain" />
      </div>

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
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">System</p>
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

const ContentArea = ({ analytics, timeRange, setTimeRange }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">ANALYTICS DASHBOARD</h2>
            <p className="text-slate-400 mt-1">Track business performance and insights</p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/10">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-primary text-black shadow-[0_0_10px_rgba(19,200,236,0.3)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.header>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: `₹${analytics.totalRevenue.toLocaleString()}`, growth: analytics.revenueGrowth, icon: 'payments', color: 'primary' },
            { label: 'Total Bookings', value: analytics.totalBookings, growth: analytics.bookingsGrowth, icon: 'calendar_month', color: 'blue-400' },
            { label: 'Total Users', value: analytics.totalUsers, growth: analytics.usersGrowth, icon: 'group', color: 'green-400' },
            { label: 'Total Vehicles', value: analytics.totalVehicles, growth: analytics.vehiclesGrowth, icon: 'directions_car', color: 'orange-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}/20 rounded-lg`}>
                  <span className={`material-symbols-outlined text-${stat.color} text-2xl`}>{stat.icon}</span>
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  {stat.growth}%
                </span>
              </div>
              <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{stat.label}</h3>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-2">vs last {timeRange}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">bar_chart</span>
                <h3 className="text-xl font-bold text-white">Monthly Revenue</h3>
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Last 6 Months</span>
            </div>
            <div className="space-y-4">
              {analytics.monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue))
                const widthPercent = (item.revenue / maxRevenue) * 100
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-400 font-medium">{item.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-xs">{item.bookings} bookings</span>
                        <span className="text-white font-semibold">₹{item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-primary to-accent-purple h-4 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Popular Vehicles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">emoji_events</span>
                <h3 className="text-xl font-bold text-white">Top Vehicles</h3>
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">By Bookings</span>
            </div>
            <div className="space-y-4">
              {analytics.popularVehicles.map((item, index) => {
                const maxBookings = analytics.popularVehicles[0]?.bookings || 1
                const widthPercent = (item.bookings / maxBookings) * 100
                const colors = [
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-cyan-500',
                  'from-green-500 to-emerald-500',
                  'from-orange-500 to-red-500',
                  'from-yellow-500 to-amber-500'
                ]
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">#{index + 1}</span>
                        <span className="text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-xs">₹{item.revenue.toLocaleString()}</span>
                        <span className="text-white font-semibold">{item.bookings}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className={`bg-gradient-to-r ${colors[index]} h-4 rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">pie_chart</span>
              <h3 className="text-xl font-bold text-white">Booking Status</h3>
            </div>
            <div className="space-y-4">
              {analytics.statusDistribution.map((item, index) => {
                const colors = {
                  'Confirmed': 'bg-green-500',
                  'Completed': 'bg-blue-500',
                  'Pending': 'bg-yellow-500',
                  'Cancelled': 'bg-red-500'
                }
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${colors[item.status]}`}></div>
                      <span className="text-slate-300 text-sm">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{item.count}</span>
                      <span className="text-slate-500 text-xs w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">stars</span>
              <h3 className="text-xl font-bold text-white">Top Customers</h3>
            </div>
            <div className="space-y-3">
              {analytics.topCustomers.map((customer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-primary flex items-center justify-center text-white text-xs font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{customer.name}</p>
                      <p className="text-slate-500 text-xs">{customer.bookings} bookings</p>
                    </div>
                  </div>
                  <span className="text-primary font-semibold text-sm">₹{customer.spent.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
              <h3 className="text-xl font-bold text-white">Payment Methods</h3>
            </div>
            <div className="space-y-4">
              {analytics.paymentMethods.map((method, index) => {
                const icons = {
                  'UPI': 'smartphone',
                  'Credit Card': 'credit_card',
                  'Debit Card': 'credit_card',
                  'Net Banking': 'account_balance'
                }
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">{icons[method.method]}</span>
                        <span className="text-slate-300 text-sm">{method.method}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold text-sm">{method.count}</span>
                        <span className="text-slate-500 text-xs w-12 text-right">{method.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${method.percentage}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-primary to-accent-purple h-2 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-panel rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl">history</span>
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.recentActivity.map((activity, index) => {
              const typeConfig = {
                booking: { icon: 'calendar_month', color: 'blue-400' },
                payment: { icon: 'payments', color: 'green-400' },
                user: { icon: 'person_add', color: 'purple-400' },
                damage: { icon: 'car_crash', color: 'red-400' }
              }
              const config = typeConfig[activity.type]
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                >
                  <div className={`p-2 bg-${config.color}/20 rounded-lg flex-shrink-0`}>
                    <span className={`material-symbols-outlined text-${config.color} text-xl`}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{activity.user}</p>
                    <p className="text-slate-400 text-xs truncate">{activity.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      {activity.amount > 0 && (
                        <span className="text-primary font-semibold text-sm">₹{activity.amount.toLocaleString()}</span>
                      )}
                      <span className="text-slate-500 text-xs ml-auto">{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
