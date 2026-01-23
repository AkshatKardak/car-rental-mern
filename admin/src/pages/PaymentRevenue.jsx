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
  ArrowUpRight,
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
  ChevronRight
} from 'lucide-react'

/* ===================== MAIN ===================== */

const PaymentRevenue = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
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
      const res = await fetch('http://127.0.0.1:5005/api/bookings')
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const payments = bookings.map(b => ({
    _id: b._id,
    user: b.user,
    car: b.car,
    amount: b.totalPrice,
    status:
      b.status === 'completed'
        ? 'paid'
        : b.status === 'confirmed'
        ? 'pending'
        : b.status === 'cancelled'
        ? 'refunded'
        : 'pending',
    paymentMethod: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'][Math.floor(Math.random() * 4)],
    transactionId: `TXN${b._id?.slice(-6)}`,
    date: b.createdAt
  }))

  const filteredPayments = payments.filter(p => {
    const matchSearch =
      p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = statusFilter === 'all' || p.status === statusFilter

    let matchDate = true
    if (dateFilter !== 'all') {
      const diff = (new Date() - new Date(p.date)) / (1000 * 60 * 60 * 24)
      if (dateFilter === 'today') matchDate = diff < 1
      if (dateFilter === 'week') matchDate = diff <= 7
      if (dateFilter === 'month') matchDate = diff <= 30
    }

    return matchSearch && matchStatus && matchDate
  })

  const stats = {
    totalRevenue: payments.reduce((s, p) => (p.status === 'paid' ? s + p.amount : s), 0),
    pending: payments.reduce((s, p) => (p.status === 'pending' ? s + p.amount : s), 0),
    refunded: payments.reduce((s, p) => (p.status === 'refunded' ? s + p.amount : s), 0)
  }

  return (
    <div className="flex h-screen bg-background-secondary text-text-primary overflow-hidden">
      <Sidebar navigate={navigate} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <ContentArea
          payments={filteredPayments}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          stats={stats}
        />
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
            >
              <div className="p-6 flex justify-between border-b">
                <img src={logo} className="h-8" />
                <X onClick={() => setSidebarOpen(false)} />
              </div>
              <SidebarContent navigate={navigate} closeMobile={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===================== SIDEBAR ===================== */

const Sidebar = ({ navigate }) => (
  <aside className="hidden lg:flex w-72 bg-white border-r">
    <div className="p-8">
      <img src={logo} className="h-9 mx-auto" />
    </div>
    <SidebarContent navigate={navigate} />
  </aside>
)

const SidebarContent = ({ navigate, closeMobile }) => {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
    { label: 'Users', icon: <Users size={18} />, path: '/admin/users' },
    { label: 'Vehicles', icon: <CarFront size={18} />, path: '/admin/vehicles' },
    { label: 'Payments', icon: <CreditCard size={18} />, path: '/admin/payments', active: true },
    { label: 'Bookings', icon: <CalendarDays size={18} />, path: '/admin/bookings' }
  ]

  return (
    <nav className="flex-1 px-4 space-y-1">
      {items.map((i, idx) => (
        <button
          key={idx}
          onClick={() => {
            navigate(i.path)
            closeMobile?.()
          }}
          className={`flex w-full items-center gap-4 px-5 py-3 rounded-xl ${
            i.active ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary'
          }`}
        >
          {i.icon}
          <span className="text-sm font-semibold">{i.label}</span>
        </button>
      ))}
      <button className="flex w-full items-center gap-4 px-5 py-3 rounded-xl hover:bg-background-secondary mt-6">
        <Settings size={18} />
        <span className="text-sm">Settings</span>
      </button>
    </nav>
  )
}

/* ===================== HEADER ===================== */

const Header = ({ setSidebarOpen }) => (
  <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Menu className="lg:hidden" onClick={() => setSidebarOpen(true)} />
      <span className="text-xs uppercase tracking-widest text-text-secondary">
        Financials <ChevronRight size={12} className="inline" /> Revenue
      </span>
    </div>
    <Bell />
  </header>
)

/* ===================== CONTENT ===================== */

const ContentArea = ({
  payments,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  stats
}) => (
  <div className="flex-1 overflow-y-auto p-10">
    <div className="max-w-[1600px] mx-auto space-y-10">
      <h2 className="text-3xl font-black">
        Cash <span className="text-primary">Intelligence</span>
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Revenue" value={`₹${stats.totalRevenue}`} icon={<Wallet />} />
        <StatCard label="Pending" value={`₹${stats.pending}`} icon={<Clock />} />
        <StatCard label="Refunded" value={`₹${stats.refunded}`} icon={<History />} />
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search payments..."
          className="h-12 px-4 rounded-xl border w-full"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-12 px-4 rounded-xl border">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="p-4">Transaction</th>
              <th className="p-4">User</th>
              <th className="p-4">Car</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-4 text-xs font-mono">{p.transactionId}</td>
                <td className="p-4">{p.user?.name}</td>
                <td className="p-4">{p.car?.name}</td>
                <td className="p-4 font-semibold">₹{p.amount}</td>
                <td className="p-4 uppercase text-xs">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border rounded-2xl p-6 flex items-center gap-4">
    <div className="p-3 bg-primary/10 text-primary rounded-xl">{icon}</div>
    <div>
      <p className="text-xs uppercase text-text-secondary">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  </div>
)

export default PaymentRevenue
