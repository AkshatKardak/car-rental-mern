import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  Search,
  Filter,
  Eye,
  Check,
  X,
  ChevronRight,
  LayoutDashboard,
  Users,
  CarFront,
  CreditCard,
  Settings,
  Menu,
  Bell,
  ArrowUpRight,
  User,
  Calendar
} from 'lucide-react'

const BookingManagement = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    const matchesSearch = booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-600 border-green-100'
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100'
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
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
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea
          bookings={bookings} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredBookings={filteredBookings}
          stats={stats} getStatusStyle={getStatusStyle} updateBookingStatus={updateBookingStatus}
          setSelectedBooking={setSelectedBooking} setShowModal={setShowModal}
          selectedBooking={selectedBooking} showModal={showModal}
        />
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl">
              <div className="p-6 flex items-center justify-between border-b border-border-light">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-xl transition-colors"><X size={20} /></button>
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
  <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border-light z-20 h-full shadow-xl shadow-black/5">
    <div className="p-8 pb-10 flex items-center justify-center">
      <img src={logo} alt="RentRide Logo" className="h-9 w-auto object-contain" />
    </div>
    <SidebarContent navigate={navigate} />
  </aside>
)

const SidebarContent = ({ navigate, closeMobile }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', active: false, path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: <CreditCard size={20} />, label: 'Payments', active: false, path: '/admin/payments' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', active: true, path: '/admin/bookings' },
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
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={item.active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}>{item.icon}</span>
            <span className={`text-sm font-black tracking-tight ${item.active ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
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

const Header = ({ setSidebarOpen }) => (
  <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-background-secondary rounded-xl hover:bg-border-light transition-colors"><Menu size={20} /></button>
      <div className="hidden md:flex items-center gap-3 text-xs font-black tracking-widest uppercase text-text-secondary/60">
        <span className="hover:text-primary cursor-pointer transition-colors">Workspace</span>
        <ChevronRight size={12} />
        <span className="text-text-primary">Reservation Ledger</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light bg-white text-text-secondary hover:bg-background-secondary hover:text-primary transition-all shadow-sm">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
      </button>
    </div>
  </header>
)

const ContentArea = ({
  bookings, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  filteredBookings, stats, getStatusStyle, updateBookingStatus,
  setSelectedBooking, setShowModal, selectedBooking, showModal
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Title Bar */}
        <motion.header initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Reservation <span className="text-primary italic">Live Feed</span></h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">Global oversight of all active and historical rental contracts.</p>
          </div>
        </motion.header>

        {/* Analytics Mini-Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: 'Total Books', value: stats.total, icon: <CalendarDays size={20} />, color: 'primary' },
            { label: 'Confirmed', value: stats.confirmed, icon: <CheckCircle size={20} />, color: 'green-600' },
            { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: 'orange-500' },
            { label: 'Completed', value: stats.completed, icon: <CheckCircle size={20} />, color: 'blue-500' },
            { label: 'Cancelled', value: stats.cancelled, icon: <XCircle size={20} />, color: 'red-500' },
            { label: 'Net Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={20} />, color: 'primary' }
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-6 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-background-secondary text-primary group-hover:bg-primary/10 transition-colors uppercase">{stat.icon}</div>
              </div>
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{stat.label}</p>
              <span className="text-xl font-black text-text-primary tracking-tight">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Controls Hook */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[32px] p-8 border border-border-light shadow-2xl shadow-black/5 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
            <input type="text" placeholder="Search by name, car, or booking index..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-background-secondary/50 border border-border-light text-sm font-bold text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
          </div>
          <div className="flex gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Ledger Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-[40px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden">
          {loading ? (
            <div className="text-center py-20"><p className="font-black text-sm uppercase tracking-widest opacity-30">Syncing Reservation Ledger...</p></div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20"><p className="font-black text-sm uppercase tracking-widest opacity-30">No matching contracts found</p></div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                    <th className="px-8 py-5">Contract ID</th>
                    <th className="px-8 py-5">Client Info</th>
                    <th className="px-8 py-5">Vehicle Core</th>
                    <th className="px-8 py-5">Cycle Dates</th>
                    <th className="px-8 py-5">Value</th>
                    <th className="px-8 py-5">State</th>
                    <th className="px-8 py-5 text-center">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking._id} className="group hover:bg-background-secondary/40 transition-colors cursor-default">
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black font-mono bg-background-secondary px-2 py-1 rounded text-text-secondary border border-border-light">#{booking._id?.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><User size={20} /></div>
                          <span className="text-sm font-black text-text-primary uppercase tracking-tight">{booking.user?.name || 'Standard Client'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <CarFront size={16} className="text-primary opacity-40" />
                          <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors uppercase tracking-widest">{booking.car?.name || 'VEHICLE ID'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-black text-text-primary flex items-center gap-1"><ArrowUpRight size={10} className="text-green-500" /> {new Date(booking.startDate).toLocaleDateString()}</span>
                          <span className="text-[10px] font-black text-text-secondary opacity-50 flex items-center gap-1"><ArrowUpRight size={10} className="rotate-90 text-red-500" /> {new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-base font-black text-primary">₹{booking.totalPrice?.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>{booking.status}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedBooking(booking); setShowModal(true) }} className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-border-light"><Eye size={18} /></button>
                          {booking.status === 'pending' && <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all border border-green-100"><Check size={18} /></button>}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"><X size={18} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {showModal && selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[48px] border border-border-light max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-10 border-b border-border-light flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">Contract <span className="text-primary italic">Detailed View</span></h3>
                  <p className="text-text-secondary text-sm font-bold opacity-60 uppercase mt-1 tracking-widest">Full technical audit of reservation #{selectedBooking._id?.slice(-8).toUpperCase()}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-background-secondary hover:bg-primary/10 text-text-secondary hover:text-primary transition-all flex items-center justify-center"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="p-6 rounded-[32px] bg-background-secondary border border-border-light group">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-4">Client Verification</p>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-border-light flex items-center justify-center text-primary"><User size={28} /></div>
                        <div>
                          <p className="text-lg font-black text-text-primary uppercase tracking-tight">{selectedBooking.user?.name}</p>
                          <p className="text-[10px] font-bold text-text-secondary opacity-60">{selectedBooking.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-[32px] bg-background-secondary border border-border-light">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-4">Assigned Assets</p>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-border-light flex items-center justify-center text-primary"><CarFront size={28} /></div>
                        <div>
                          <p className="text-lg font-black text-text-primary uppercase tracking-tight">{selectedBooking.car?.name}</p>
                          <p className="text-[10px] font-bold text-text-secondary opacity-60 uppercase tracking-widest">{selectedBooking.car?.brand} Inventory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/20">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Financial Settlement</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-primary tracking-tight">₹{selectedBooking.totalPrice?.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-primary opacity-50 uppercase tracking-widest">Gross Total</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-background-secondary border border-border-light">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">Check-In</p>
                        <p className="text-xs font-black text-text-primary flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-background-secondary border border-border-light">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">Check-Out</p>
                        <p className="text-xs font-black text-text-primary flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingManagement
