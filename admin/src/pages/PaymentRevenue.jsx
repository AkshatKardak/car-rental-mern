import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import {
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  Loader
} from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const PaymentRevenue = () => {
  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header />
        <ContentArea />
      </main>
    </div>
  )
}

const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs font-black tracking-widest uppercase text-text-secondary/60">
          <span className="hover:text-primary cursor-pointer transition-colors">Workspace</span>
          <ChevronRight size={12} />
          <span className="text-text-primary">Payment & Revenue</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-4" />
          <input
            className="h-11 w-72 rounded-2xl border border-border-light bg-background-secondary/50 px-10 text-sm font-bold text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            placeholder="Search transactions..."
            type="text"
          />
        </div>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light bg-white text-text-secondary hover:bg-background-secondary hover:text-primary transition-all shadow-sm">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
        </button>
      </div>
    </header>
  )
}

const ContentArea = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    confirmedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0
  })

  // Fetch payments from backend
  useEffect(() => {
    fetchPayments()
  }, [filterStatus, page])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      
      const params = {
        page,
        limit: 10
      }
      
      if (filterStatus !== 'all') {
        params.status = filterStatus
      }

      const response = await axios.get(`${API_URL}/admin/payments`, {
        headers: getAuthHeader(),
        params
      })

      if (response.data.success) {
        setPayments(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
        setTotalCount(response.data.total || 0)
        
        // Set revenue stats
        setStats({
          totalRevenue: response.data.totalRevenue || 0,
          confirmedPayments: response.data.data?.filter(p => p.status === 'confirmed').length || 0,
          pendingPayments: response.data.data?.filter(p => p.status === 'pending').length || 0,
          failedPayments: response.data.data?.filter(p => p.status === 'cancelled').length || 0
        })
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      alert('Failed to fetch payments. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { 
      label: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      trend: '+12.4%', 
      trendUp: true,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600 border-green-100'
    },
    { 
      label: 'Confirmed', 
      value: stats.confirmedPayments.toString(), 
      icon: CheckCircle,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    { 
      label: 'Pending', 
      value: stats.pendingPayments.toString(), 
      icon: Clock,
      color: 'bg-orange-50 text-orange-600 border-orange-100'
    },
    { 
      label: 'Failed', 
      value: stats.failedPayments.toString(), 
      icon: XCircle,
      color: 'bg-red-50 text-red-600 border-red-100'
    },
  ]

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-50 text-green-600 border-green-200'
      case 'pending':
        return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle size={14} className="text-green-600" />
      case 'pending':
        return <Clock size={14} className="text-orange-600" />
      case 'cancelled':
        return <XCircle size={14} className="text-red-600" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">
              Payment <span className="text-primary italic">& Revenue</span>
            </h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">
              Track all transactions and revenue streams.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover uppercase tracking-widest"
          >
            <Download size={20} />
            <span>Export Report</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    {stat.label}
                  </p>
                  <div className={`w-10 h-10 rounded-xl ${stat.color} border flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-text-primary tracking-tight">
                    {stat.value}
                  </span>
                  {stat.trend && (
                    <span className="text-green-600 text-[10px] font-black bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                      {stat.trend} <TrendingUp size={10} />
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[32px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden flex flex-col"
        >
          {/* Filters */}
          <div className="flex flex-col gap-6 p-8 border-b border-border-light lg:flex-row lg:items-center lg:justify-between bg-background-secondary/20">
            <div className="flex gap-2">
              {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setFilterStatus(f)
                    setPage(1)
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                    filterStatus === f 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-white border-border-light text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-border-light text-xs font-black text-text-secondary hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
              <Filter size={16} /> Date Range
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                  <th className="px-8 py-5">Booking ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Discount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-8 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Loader className="animate-spin h-8 w-8 text-primary" />
                        <span className="text-text-secondary font-bold">Loading payments...</span>
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-8 py-12 text-center text-text-secondary font-bold">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-background-secondary/40 transition-colors cursor-default"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CreditCard size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-text-primary text-sm">
                              #{payment._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-[10px] text-text-secondary font-bold opacity-60">
                              ID
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-text-primary text-sm">
                            {payment.user?.name || 'N/A'}
                          </p>
                          <p className="text-[10px] text-text-secondary font-bold opacity-60">
                            {payment.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-text-primary text-sm">
                            {payment.car?.brand} {payment.car?.model}
                          </p>
                          <p className="text-[10px] text-text-secondary font-bold opacity-60">
                            {payment.car?.name || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-xs font-bold text-text-primary">
                            {formatDate(payment.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xl font-black text-text-primary">
                          ₹{payment.totalPrice?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-green-600">
                          {payment.discount > 0 ? `-₹${payment.discount}` : '₹0'}
                        </p>
                        {payment.promotionCode && (
                          <p className="text-[10px] text-text-secondary font-bold opacity-60">
                            {payment.promotionCode}
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${getStatusBadge(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-border-light">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-t border-border-light bg-background-secondary/10">
            <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.1em] opacity-60 mb-4 sm:mb-0">
              Showing {payments.length} of {totalCount} transactions
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(Math.min(3, totalPages))].map((_, i) => {
                const pageNum = page > 2 ? page - 1 + i : i + 1
                if (pageNum > totalPages) return null
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                      page === pageNum
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'border border-border-light text-text-secondary hover:bg-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentRevenue
