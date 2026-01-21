import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  IndianRupee,
  CreditCard,
  Clock,
  CheckCircle,
  History,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Receipt,
  Smartphone,
  Building,
  Menu,
  X,
  LayoutDashboard,
  Users,
  CarFront,
  CalendarDays,
  Settings,
  Bell,
  Wallet,
  MoreVertical,
  ChevronRight
} from 'lucide-react'

const PaymentRevenue = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    const matchesSearch = payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-600 border-green-100'
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100'
      case 'refunded': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'failed': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  const stats = {
    totalRevenue: payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0),
    pendingAmount: payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0),
    refundedAmount: payments.reduce((sum, p) => sum + (p.status === 'refunded' ? p.amount : 0), 0),
    totalTransactions: payments.length,
    paidCount: payments.filter(p => p.status === 'paid').length,
    pendingCount: payments.filter(p => p.status === 'pending').length
  }

  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea
          payments={payments} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFilter={dateFilter} setDateFilter={setDateFilter}
          filteredPayments={filteredPayments} stats={stats} getStatusStyle={getStatusStyle}
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
    { icon: <CreditCard size={20} />, label: 'Payments', active: true, path: '/admin/payments' },
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
        <span className="hover:text-primary cursor-pointer transition-colors">Financials</span>
        <ChevronRight size={12} />
        <span className="text-text-primary">Revenue Streams</span>
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
  payments, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  dateFilter, setDateFilter, filteredPayments, stats, getStatusStyle
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Title Bar */}
        <motion.header initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Cash <span className="text-primary italic">Intelligence</span></h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">Full visibility into transactional health and settlement cycles.</p>
          </div>
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-white border border-border-light px-8 py-4 text-sm font-black text-text-primary shadow-xl shadow-black/5 transition-all hover:bg-background-secondary uppercase tracking-widest">
            <Download size={20} className="text-primary" />
            <span>Export Report</span>
          </button>
        </motion.header>

        {/* Analytics Mini-Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: 'Booked Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <Wallet size={20} />, color: 'primary' },
            { label: 'Awaiting Clear', value: `₹${stats.pendingAmount.toLocaleString()}`, icon: <Clock size={20} />, color: 'orange-500' },
            { label: 'Refund Flows', value: `₹${stats.refundedAmount.toLocaleString()}`, icon: <History size={20} />, color: 'blue-500' },
            { label: 'Trans Index', value: stats.totalTransactions, icon: <Receipt size={20} />, color: 'indigo-500' },
            { label: 'Paids', value: stats.paidCount, icon: <CheckCircle size={20} />, color: 'green-600' },
            { label: 'Escrows', value: stats.pendingCount, icon: <Clock size={20} />, color: 'orange-500' }
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-6 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-background-secondary text-primary group-hover:bg-primary/10 transition-colors">{stat.icon}</div>
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
            <input type="text" placeholder="Search by identity or hash..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-background-secondary/50 border border-border-light text-sm font-bold text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
          </div>
          <div className="flex gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
              <option value="all">Status: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
              <option value="all">Period: All</option>
              <option value="today">Today</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </motion.div>

        {/* Transactions Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-[40px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                  <th className="px-8 py-5">Hash ID</th>
                  <th className="px-8 py-5">Originator</th>
                  <th className="px-8 py-5">Asset</th>
                  <th className="px-8 py-5">Method</th>
                  <th className="px-8 py-5">Value</th>
                  <th className="px-8 py-5">State</th>
                  <th className="px-8 py-5 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment._id} className="group hover:bg-background-secondary/40 transition-colors cursor-default">
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black font-mono bg-background-secondary px-2 py-1 rounded text-primary border border-primary/20">{payment.transactionId}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">{payment.user?.name?.charAt(0) || 'U'}</div>
                        <div>
                          <p className="text-sm font-black text-text-primary uppercase tracking-tight">{payment.user?.name || 'N/A'}</p>
                          <p className="text-[9px] text-text-secondary font-bold opacity-50">{payment.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <CarFront size={14} className="text-primary opacity-40" />
                        <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors uppercase tracking-tight">{payment.car?.name || 'VEHICLE'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-text-secondary uppercase">
                        {payment.paymentMethod === 'UPI' && <Smartphone size={14} className="text-indigo-400" />}
                        {(payment.paymentMethod === 'Credit Card' || payment.paymentMethod === 'Debit Card') && <CreditCard size={14} className="text-blue-400" />}
                        {payment.paymentMethod === 'Net Banking' && <Building size={14} className="text-green-400" />}
                        <span className="text-[10px] font-black tracking-widest">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base font-black text-primary">₹{payment.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(payment.status)}`}>{payment.status}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-border-light"><Receipt size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* Visualized Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        <div className="bg-white rounded-[40px] p-10 border border-border-light shadow-2xl shadow-black/5">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><IndianRupee size={24} /></div>
            <div><h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Method <span className="text-primary italic">Spread</span></h3><p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">Channel distribution by volume</p></div>
          </div>
          <div className="space-y-8">
            {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method, index) => {
              const methodPayments = payments.filter(p => p.paymentMethod === method)
              const amount = methodPayments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)
              const percentage = payments.length > 0 ? Math.round((methodPayments.length / payments.length) * 100) : 0
              return (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-text-primary uppercase tracking-widest">{method}</span>
                    <span className="text-lg font-black text-text-primary">₹{amount.toLocaleString()} <span className="text-[10px] opacity-30 font-bold">({percentage}%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden border border-border-light">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: 1, duration: 1 }} className="h-full bg-primary" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 border border-border-light shadow-2xl shadow-black/5">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><History size={24} /></div>
            <div><h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Recent <span className="text-primary italic">Clearings</span></h3><p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">Last 5 settlement cycles</p></div>
          </div>
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-5 rounded-3xl bg-background-secondary border border-border-light group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment.status === 'paid' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}><ArrowUpRight size={20} className={payment.status === 'paid' ? '' : 'rotate-45'} /></div>
                  <div><p className="text-sm font-black text-text-primary uppercase tracking-tight">{payment.user?.name || 'N/A'}</p><p className="text-[9px] font-bold text-text-secondary opacity-50 uppercase">{payment.paymentMethod}</p></div>
                </div>
                <div className="text-right"><p className="text-base font-black text-text-primary">₹{payment.amount?.toLocaleString()}</p><p className="text-[9px] font-bold text-primary uppercase">{payment.status}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div >
  )
}

export default PaymentRevenue
