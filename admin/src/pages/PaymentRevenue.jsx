import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PaymentRevenue = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/bookings'),
        fetch('http://localhost:5000/api/users')
      ])

      const bookingsData = await bookingsRes.json()
      const usersData = await usersRes.json()

      setBookings(bookingsData)
      setUsers(usersData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // Create payment records from bookings
  const payments = bookings.map(booking => ({
    _id: booking._id,
    bookingId: booking._id,
    user: booking.user,
    car: booking.car,
    amount: booking.totalPrice,
    status: booking.status === 'completed' ? 'paid' : booking.status === 'confirmed' ? 'pending' : booking.status === 'cancelled' ? 'refunded' : 'pending',
    paymentMethod: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'][Math.floor(Math.random() * 4)],
    transactionId: `TXN${booking._id?.slice(-8)}${Math.floor(Math.random() * 1000)}`,
    date: booking.createdAt,
    bookingDate: booking.startDate
  }))

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date)
      const now = new Date()
      const daysDiff = Math.floor((now - paymentDate) / (1000 * 60 * 60 * 24))
      
      if (dateFilter === 'today') matchesDate = daysDiff === 0
      else if (dateFilter === 'week') matchesDate = daysDiff <= 7
      else if (dateFilter === 'month') matchesDate = daysDiff <= 30
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const stats = {
    totalRevenue: payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0),
    pendingAmount: payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0),
    refundedAmount: payments.reduce((sum, p) => sum + (p.status === 'refunded' ? p.amount : 0), 0),
    totalTransactions: payments.length,
    paidCount: payments.filter(p => p.status === 'paid').length,
    pendingCount: payments.filter(p => p.status === 'pending').length
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'refunded': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="relative flex h-screen w-full bg-dashboard-gradient overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]"></div>
      </div>

      <Sidebar navigate={navigate} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <ContentArea 
          payments={payments}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          filteredPayments={filteredPayments}
          stats={stats}
          getStatusColor={getStatusColor}
        />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: true, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', active: false, path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', active: false, path: '/admin/analytics' },
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

const ContentArea = ({ 
  payments, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  dateFilter, setDateFilter, filteredPayments, stats, getStatusColor
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-black text-white tracking-tight">PAYMENT & REVENUE</h2>
          <p className="text-slate-400 mt-1">Track all transactions and revenue streams</p>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: 'account_balance', color: 'primary', bg: 'primary/20' },
            { label: 'Pending Amount', value: `₹${stats.pendingAmount.toLocaleString()}`, icon: 'schedule', color: 'yellow-400', bg: 'yellow-500/20' },
            { label: 'Refunded', value: `₹${stats.refundedAmount.toLocaleString()}`, icon: 'currency_exchange', color: 'blue-400', bg: 'blue-500/20' },
            { label: 'Transactions', value: stats.totalTransactions, icon: 'receipt_long', color: 'purple-400', bg: 'purple-500/20' },
            { label: 'Paid', value: stats.paidCount, icon: 'check_circle', color: 'green-400', bg: 'green-500/20' },
            { label: 'Pending', value: stats.pendingCount, icon: 'pending', color: 'orange-400', bg: 'orange-500/20' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${stat.bg}`}>
                  <span className={`material-symbols-outlined text-${stat.color} text-xl`}>{stat.icon}</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer, vehicle, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-xl overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading payments...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-500 text-xs font-bold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPayments.map((payment, index) => (
                    <motion.tr 
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-primary font-mono text-xs font-semibold">{payment.transactionId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-primary flex items-center justify-center text-white text-xs font-bold">
                            {payment.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{payment.user?.name || 'N/A'}</p>
                            <p className="text-slate-500 text-xs">{payment.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                          <span className="text-white font-medium">{payment.car?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {payment.paymentMethod === 'UPI' && <span className="material-symbols-outlined text-purple-400 text-sm">smartphone</span>}
                          {(payment.paymentMethod === 'Credit Card' || payment.paymentMethod === 'Debit Card') && <span className="material-symbols-outlined text-blue-400 text-sm">credit_card</span>}
                          {payment.paymentMethod === 'Net Banking' && <span className="material-symbols-outlined text-green-400 text-sm">account_balance</span>}
                          <span className="text-slate-300 text-sm">{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-bold text-base">₹{payment.amount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-xs">
                          <div>{new Date(payment.date).toLocaleDateString('en-IN')}</div>
                          <div className="text-slate-500">{new Date(payment.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded bg-primary/20 hover:bg-primary text-primary hover:text-black transition-all"
                            title="View Receipt"
                          >
                            <span className="material-symbols-outlined text-[18px]">receipt</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black transition-all"
                            title="Download Invoice"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Payment Methods Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
              <h3 className="text-xl font-bold text-white">Payment Methods Distribution</h3>
            </div>
            <div className="space-y-4">
              {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method, index) => {
                const methodPayments = payments.filter(p => p.paymentMethod === method)
                const count = methodPayments.length
                const amount = methodPayments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)
                const percentage = payments.length > 0 ? Math.round((count / payments.length) * 100) : 0
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-medium">{method}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xs">{count} transactions</span>
                        <span className="text-white font-semibold">₹{amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-primary to-accent-purple h-3 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
              <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 6).map((payment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      payment.status === 'paid' ? 'bg-green-500/20' :
                      payment.status === 'pending' ? 'bg-yellow-500/20' :
                      payment.status === 'refunded' ? 'bg-blue-500/20' : 'bg-red-500/20'
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${
                        payment.status === 'paid' ? 'text-green-400' :
                        payment.status === 'pending' ? 'text-yellow-400' :
                        payment.status === 'refunded' ? 'text-blue-400' : 'text-red-400'
                      }`}>
                        {payment.status === 'paid' ? 'check_circle' :
                         payment.status === 'pending' ? 'schedule' :
                         payment.status === 'refunded' ? 'currency_exchange' : 'cancel'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{payment.user?.name || 'N/A'}</p>
                      <p className="text-slate-500 text-xs">{payment.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-semibold">₹{payment.amount?.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">{new Date(payment.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PaymentRevenue
