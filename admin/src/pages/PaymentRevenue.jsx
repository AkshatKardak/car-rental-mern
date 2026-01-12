import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PaymentRevenue = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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
        <Header />
        <ContentArea searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'payments', label: 'Payments', active: true, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '#' },
    { icon: 'analytics', label: 'Analytics', active: false, path: '#' },
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

const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between px-8 py-4 backdrop-blur-sm z-10 border-b border-white/5">
      {/* Mobile Menu */}
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg font-bold text-white">RentRide</span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-black leading-tight tracking-tight">Payment & Revenue</h1>
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">schedule</span>
          Last updated: Just now
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-sm font-medium transition-all"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Refresh Data</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-primary text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span className="hidden sm:inline">Export Reports</span>
        </motion.button>
      </div>
    </header>
  )
}

const ContentArea = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) => {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$124,500',
      icon: 'monetization_on',
      iconColor: 'text-primary',
      trend: '+12.5%',
      trendIcon: 'trending_up',
      trendColor: 'text-emerald-400',
      description: 'vs last month'
    },
    {
      label: 'Pending Clearance',
      value: '$12,300',
      icon: 'pending',
      iconColor: 'text-amber-400',
      trend: '+2.4%',
      trendIcon: 'remove',
      trendColor: 'text-amber-400',
      description: 'processing volume'
    },
    {
      label: 'Refund Rate',
      value: '1.2%',
      icon: 'assignment_return',
      iconColor: 'text-rose-400',
      trend: '-0.5%',
      trendIcon: 'trending_down',
      trendColor: 'text-emerald-400',
      description: 'improvement'
    },
  ]

  const [transactions] = useState([
    {
      id: '#TRX-89012',
      user: { name: 'Sarah Jenkins', tier: 'Premium Member', avatar: 'https://i.pravatar.cc/150?img=45' },
      vehicle: 'Tesla Model S Plaid',
      duration: '2 Days Rental',
      date: 'Oct 24, 2023',
      amount: '$450.00',
      status: 'Paid',
      statusColor: 'emerald'
    },
    {
      id: '#TRX-89013',
      user: { name: 'Michael Chen', tier: 'New User', avatar: 'https://i.pravatar.cc/150?img=33' },
      vehicle: 'Porsche 911 Carrera',
      duration: 'Weekly Rental',
      date: 'Oct 24, 2023',
      amount: '$2,100.00',
      status: 'Pending',
      statusColor: 'amber'
    },
    {
      id: '#TRX-88905',
      user: { name: 'David Ross', tier: 'Corporate Account', avatar: 'https://i.pravatar.cc/150?img=68' },
      vehicle: 'Lamborghini Urus',
      duration: 'Weekend Special',
      date: 'Oct 23, 2023',
      amount: '$3,200.00',
      status: 'Paid',
      statusColor: 'emerald'
    },
    {
      id: '#TRX-88892',
      user: { name: 'Emma Wilson', tier: 'Regular', avatar: 'https://i.pravatar.cc/150?img=47' },
      vehicle: 'BMW M4 Competition',
      duration: '1 Day Rental',
      date: 'Oct 22, 2023',
      amount: '$350.00',
      status: 'Refunded',
      statusColor: 'rose'
    },
    {
      id: '#TRX-88840',
      user: { name: 'James Carter', tier: 'VIP', avatar: 'https://i.pravatar.cc/150?img=12' },
      vehicle: 'Mercedes G63 AMG',
      duration: '3 Days Rental',
      date: 'Oct 21, 2023',
      amount: '$1,800.00',
      status: 'Paid',
      statusColor: 'emerald'
    },
  ])

  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && transaction.status === 'Pending') ||
      (filterStatus === 'refunds' && transaction.status === 'Refunded')
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-20">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-primary/30"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-symbols-outlined ${stat.iconColor} text-4xl`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-white text-3xl font-bold tracking-tight mb-2">{stat.value}</p>
              <div className={`flex items-center gap-1 ${stat.trendColor} text-sm font-medium`}>
                <span className="material-symbols-outlined text-base">{stat.trendIcon}</span>
                <span>{stat.trend}</span>
                <span className="text-slate-500 ml-1 font-normal">{stat.description}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-white text-lg font-bold">Income Trends</h3>
              <p className="text-slate-400 text-sm">Monthly revenue analytics</p>
            </div>
            <select className="bg-slate-900 border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none">
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible chart-glow" fill="none" preserveAspectRatio="none" viewBox="0 0 478 150">
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="236" x2="236" y1="21" y2="149">
                  <stop stopColor="#13c8ec" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="#13c8ec" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#chartGradient)"></path>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" filter="drop-shadow(0px 0px 8px rgba(19, 200, 236, 0.5))" stroke="#13c8ec" strokeLinecap="round" strokeWidth="3"></path>
            </svg>
          </div>
          <div className="flex justify-between mt-4 px-2">
            <p className="text-slate-500 text-xs font-medium">Week 1</p>
            <p className="text-slate-500 text-xs font-medium">Week 2</p>
            <p className="text-slate-500 text-xs font-medium">Week 3</p>
            <p className="text-slate-500 text-xs font-medium">Week 4</p>
          </div>
        </motion.div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Filter & Search Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center glass-panel p-4 rounded-xl">
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors" 
                placeholder="Search by ID, User, or Vehicle..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                All Transactions
              </button>
              <button 
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'pending' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilterStatus('refunds')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'refunds' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                Refunds
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 uppercase tracking-wider text-slate-500 text-xs font-bold border-b border-white/10">
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Vehicle Details</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-mono text-sm">{transaction.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="bg-center bg-cover rounded-full w-8 h-8 ring-2 ring-white/10 group-hover:ring-primary/50 transition-all"
                              style={{ backgroundImage: `url(${transaction.user.avatar})` }}
                            ></div>
                            <div>
                              <p className="text-white text-sm font-medium">{transaction.user.name}</p>
                              <p className="text-slate-500 text-xs">{transaction.user.tier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-200 text-sm">{transaction.vehicle}</p>
                          <p className="text-slate-500 text-xs">{transaction.duration}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{transaction.date}</td>
                        <td className="px-6 py-4 text-white font-medium text-sm">{transaction.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${transaction.statusColor}-500/10 text-${transaction.statusColor}-400 border border-${transaction.statusColor}-500/20`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">more_vert</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-white/5 bg-slate-900/40 px-4 py-3 sm:px-6">
              <div className="text-xs text-slate-400">
                Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">{filteredTransactions.length}</span> of <span className="text-white font-medium">{transactions.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-bold shadow-[0_0_10px_rgba(19,200,236,0.4)]">1</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">2</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">3</button>
                <span className="text-slate-500">...</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-center pb-4">
          <p className="text-slate-600 text-xs">© 2026 RentRide Inc. Admin Dashboard v2.4. Confidential.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentRevenue
