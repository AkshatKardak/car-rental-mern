import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { paymentEventService } from '../services/paymentService'
import {
  BarChart3,
  TrendingUp,
  Users,
  CarFront,
  CalendarDays,
  IndianRupee,
  ChevronRight,
  PieChart,
  Star,
  Wallet,
  History,
  Bell,
  Smartphone,
  CreditCard,
  AlertTriangle,
  UserPlus,
  Clock,
  RefreshCw,
  Tag
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

const Analytics = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [loading, setLoading] = useState(false)

  // Real Analytics Data State
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalVehicles: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
    usersGrowth: 0,
    vehiclesGrowth: 0
  })

  const [revenueChartData, setRevenueChartData] = useState([])
  const [couponStats, setCouponStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const headers = getAuthHeader()

      // 1. Fetch Dashboard Totals (Filtered by period)
      const dashboardRes = await axios.get(`${API_URL}/admin/stats/dashboard?period=${timeRange}`, { headers })
      if (dashboardRes.data.success) {
        setDashboardStats(dashboardRes.data.data)
      }

      // 2. Fetch Revenue Chart Data
      const revenueRes = await axios.get(`${API_URL}/admin/stats/revenue-analytics?period=${timeRange}`, { headers })
      if (revenueRes.data.success) {
        // Transform data for chart
        // Map backend _id to label (Day/Month name)
        const transformedData = revenueRes.data.data.map(item => {
          // If referencing day of week/month, we might want to format it
          return {
            label: item._id, // Ideally format this based on period
            revenue: item.revenue,
            bookings: item.bookings || item.count
          }
        })
        setRevenueChartData(transformedData)
      }

      // 3. Fetch Coupon Stats
      const couponRes = await axios.get(`${API_URL}/admin/stats/coupon-analytics?period=${timeRange}`, { headers })
      if (couponRes.data.success) {
        setCouponStats(couponRes.data.data || [])
      }

      // 4. Fetch Recent Activity
      const activityRes = await axios.get(`${API_URL}/admin/stats/recent-activity?limit=5`, { headers })
      if (activityRes.data.success) {
        // Merge bookings and users into a single activity stream styled for UI
        const bookings = activityRes.data.data.bookings.map(b => ({
          type: 'booking',
          user: b.user?.name || 'Unknown',
          action: `Booked ${b.car?.brand || ''} ${b.car?.model || ''}`,
          amount: b.totalPrice,
          time: new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          origTime: new Date(b.createdAt)
        }))

        const users = activityRes.data.data.users.map(u => ({
          type: 'user',
          user: u.name,
          action: 'New user registration',
          amount: 0,
          time: new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          origTime: new Date(u.createdAt)
        }))

        const combined = [...bookings, ...users].sort((a, b) => b.origTime - a.origTime).slice(0, 6)
        setRecentActivity(combined)
      }

      console.log('✅ Analytics refreshed')
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  // Subscribe to payment events
  useEffect(() => {
    console.log('🔔 Analytics subscribing to payment events...')

    const unsubscribe = paymentEventService.subscribe((event) => {
      console.log('🔔 Analytics received event:', event.type)

      if (event.type === 'PAYMENT_RECEIVED' || event.type === 'SETTLEMENT_UPDATE' || event.type === 'BOOKING_UPDATE') {
        console.log('✅ Auto-refreshing analytics data...')
        fetchAnalyticsData()
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
      <div className="max-w-[1800px] mx-auto space-y-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              Strategic <span className="text-blue-600 italic">Insights</span>
            </h2>
            <p className="text-gray-500 text-lg mt-1 font-medium">
              Multidimensional analysis of fleet performance • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1.5 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </motion.header>

        {/* Global Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Revenue', value: `₹${dashboardStats.totalRevenue.toLocaleString()}`, growth: dashboardStats.revenueGrowth, icon: <IndianRupee size={20} />, color: 'blue' },
            { label: 'Bookings', value: dashboardStats.totalBookings, growth: dashboardStats.bookingsGrowth, icon: <CalendarDays size={20} />, color: 'blue' },
            { label: 'Users', value: dashboardStats.totalUsers, growth: dashboardStats.usersGrowth, icon: <Users size={20} />, color: 'indigo' },
            { label: 'Fleet Size', value: dashboardStats.totalVehicles, growth: dashboardStats.vehiclesGrowth, icon: <CarFront size={20} />, color: 'orange' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-gray-200 shadow-lg group hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gray-50 text-blue-600 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {stat.icon}
                </div>
                {stat.growth !== 0 && (
                  <div className={`px-2 py-1 ${stat.growth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} rounded-lg text-[10px] font-black flex items-center gap-1`}>
                    <TrendingUp size={12} className={stat.growth < 0 ? 'rotate-180' : ''} /> {Math.abs(stat.growth)}%
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-widest">selected {timeRange}</p>
            </motion.div>
          ))}
        </div>

        {/* Intelligence Charts Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[40px] p-10 border border-gray-200 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Revenue <span className="text-blue-600 italic">Breakdown</span>
                  </h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Performance over time</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {revenueChartData.length === 0 ? (
                <p className="text-center text-gray-400 font-bold">No data for this period</p>
              ) : (
                revenueChartData.map((item, index) => {
                  const maxRevenue = Math.max(...revenueChartData.map(m => m.revenue)) || 1
                  const percentage = (item.revenue / maxRevenue) * 100
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          {/* Simple mapping for label, could be improved with date formatting */}
                          {timeRange === 'week' ? `Day ${item.label}` : timeRange === 'year' ? `Month ${item.label}` : `Day ${item.label}`}
                        </span>
                        <span className="text-base font-black text-gray-900">
                          ₹{item.revenue.toLocaleString()}
                          <span className="text-[9px] text-gray-400 font-bold ml-2">({item.bookings} bookings)</span>
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + (index * 0.1), duration: 1 }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-[40px] p-10 border border-gray-200 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Tag size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Coupon <span className="text-green-600 italic">Impact</span>
                  </h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top discounts used</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {couponStats.length === 0 ? (
                <p className="text-center text-gray-400 font-bold">No coupons used in this period</p>
              ) : (
                couponStats.slice(0, 5).map((coupon, index) => {
                  // Calculate percentage relative to highest discount
                  const maxDisc = Math.max(...couponStats.map(c => c.totalDiscount)) || 1
                  const percentage = (coupon.totalDiscount / maxDisc) * 100

                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-green-600">0{index + 1}</span> {coupon._id}
                        </span>
                        <span className="text-base font-black text-gray-900">
                          {coupon.usageCount} <span className="text-[9px] text-gray-400 font-bold ml-1">uses</span>
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400 font-bold">Total Discount: ₹{coupon.totalDiscount.toLocaleString()}</span>
                        <span className="text-gray-400 font-bold">Revenue: ₹{coupon.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-border-light">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 1 + (index * 0.1), duration: 1 }}
                          className="h-full bg-green-500"
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-[48px] p-10 border border-gray-200 shadow-2xl mb-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><History size={24} /></div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  Recent <span className="text-blue-600 italic">Activity</span>
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Latest operations</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivity.map((a, i) => (
              <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-200 flex gap-5 group hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm uppercase group-hover:scale-110 transition-transform">
                  {a.type === 'booking' ? <CalendarDays size={20} /> : a.type === 'payment' ? <IndianRupee size={20} /> : a.type === 'user' ? <UserPlus size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{a.user}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 truncate">{a.action}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-[10px] font-black text-blue-600">{a.amount > 0 ? `₹${a.amount.toLocaleString()}` : 'NEW'}</span>
                    <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {a.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-center text-gray-400 col-span-3">No recent activity.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
