import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const BookingManagement = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings')
      const data = await response.json()
      setBookings(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
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
        <ContentArea 
          bookings={bookings}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredBookings={filteredBookings}
          stats={stats}
          getStatusColor={getStatusColor}
          updateBookingStatus={updateBookingStatus}
          setSelectedBooking={setSelectedBooking}
          setShowModal={setShowModal}
          selectedBooking={selectedBooking}
          showModal={showModal}
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
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: true, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', active: false, path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', active: false, path: '/admin/analytics' },
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

const ContentArea = ({ 
  bookings, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  filteredBookings,
  stats,
  getStatusColor,
  updateBookingStatus,
  setSelectedBooking,
  setShowModal,
  selectedBooking,
  showModal
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">BOOKING MANAGEMENT</h2>
            <p className="text-slate-400 mt-1">Manage all car rental bookings and reservations</p>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total</span>
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl mt-2">calendar_month</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Confirmed</span>
              <span className="text-2xl font-bold text-green-400">{stats.confirmed}</span>
            </div>
            <span className="material-symbols-outlined text-green-400 text-3xl mt-2">check_circle</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</span>
              <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
            </div>
            <span className="material-symbols-outlined text-yellow-400 text-3xl mt-2">pending</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Completed</span>
              <span className="text-2xl font-bold text-blue-400">{stats.completed}</span>
            </div>
            <span className="material-symbols-outlined text-blue-400 text-3xl mt-2">task_alt</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Cancelled</span>
              <span className="text-2xl font-bold text-red-400">{stats.cancelled}</span>
            </div>
            <span className="material-symbols-outlined text-red-400 text-3xl mt-2">cancel</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Revenue</span>
              <span className="text-2xl font-bold text-primary">₹{stats.revenue.toLocaleString()}</span>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl mt-2">payments</span>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel flex flex-col rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer, car, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">filter_list</span>
            </div>
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-xl overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-500 text-xs font-bold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((booking, index) => (
                    <motion.tr 
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-mono text-xs">#{booking._id?.slice(-8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                          </div>
                          <span className="text-white font-medium">{booking.user?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                          <span className="text-white font-medium">{booking.car?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-xs">
                          <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                          <div className="text-slate-500">to {new Date(booking.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-bold">₹{booking.totalPrice?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowModal(true)
                            }}
                            className="p-1.5 rounded bg-primary/20 hover:bg-primary text-primary hover:text-black transition-all"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </motion.button>
                          {booking.status === 'pending' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="p-1.5 rounded bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black transition-all"
                              title="Confirm"
                            >
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </motion.button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="p-1.5 rounded bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black transition-all"
                              title="Cancel"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Booking ID</p>
                  <p className="text-white font-mono font-bold">#{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Customer</p>
                  <p className="text-white font-semibold">{selectedBooking.user?.name}</p>
                  <p className="text-slate-400 text-xs">{selectedBooking.user?.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Vehicle</p>
                  <p className="text-white font-semibold">{selectedBooking.car?.name}</p>
                  <p className="text-slate-400 text-xs">{selectedBooking.car?.brand}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Start Date</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">End Date</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Price</p>
                  <p className="text-primary font-bold text-2xl">₹{selectedBooking.totalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Booking Date</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default BookingManagement
