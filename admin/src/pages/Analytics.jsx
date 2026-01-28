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
  RefreshCw
} from 'lucide-react'

const Analytics = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [loading, setLoading] = useState(false)

  // Dummy Analytics Data
  const [analytics, setAnalytics] = useState({
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
      { status: 'Confirmed', count: 128, percentage: 37, color: 'bg-green-500' },
      { status: 'Completed', count: 156, percentage: 46, color: 'bg-blue-500' },
      { status: 'Pending', count: 42, percentage: 12, color: 'bg-orange-400' },
      { status: 'Cancelled', count: 16, percentage: 5, color: 'bg-red-500' }
    ],
    topCustomers: [
      { name: 'Rajesh Kumar', bookings: 12, spent: 180000 },
      { name: 'Priya Sharma', bookings: 10, spent: 165000 },
      { name: 'Amit Patel', bookings: 9, spent: 142000 },
      { name: 'Sneha Reddy', bookings: 8, spent: 128000 },
      { name: 'Vikram Singh', bookings: 7, spent: 112000 }
    ],
    paymentMethods: [
      { method: 'UPI', count: 145, percentage: 42, icon: <Smartphone size={14} />, color: 'bg-indigo-500' },
      { method: 'Credit Card', count: 120, percentage: 35, icon: <CreditCard size={14} />, color: 'bg-blue-500' },
      { method: 'Debit Card', count: 52, percentage: 15, icon: <CreditCard size={14} />, color: 'bg-blue-400' },
      { method: 'Net Banking', count: 25, percentage: 8, icon: <Wallet size={14} />, color: 'bg-green-500' }
    ]
  })

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
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
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    timeRange === range 
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
            { label: 'Gross Revenue', value: `₹${analytics.totalRevenue.toLocaleString()}`, growth: analytics.revenueGrowth, icon: <IndianRupee size={20} />, color: 'blue' },
            { label: 'Active Contracts', value: analytics.totalBookings, growth: analytics.bookingsGrowth, icon: <CalendarDays size={20} />, color: 'blue' },
            { label: 'Total Users', value: analytics.totalUsers, growth: analytics.usersGrowth, icon: <Users size={20} />, color: 'indigo' },
            { label: 'Fleet Size', value: analytics.totalVehicles, growth: analytics.vehiclesGrowth, icon: <CarFront size={20} />, color: 'orange' }
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
                <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.growth}%
                </div>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-widest">vs last {timeRange}</p>
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
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">6-Month Performance</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {analytics.monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue))
                const percentage = (item.revenue / maxRevenue) * 100
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.month}</span>
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
              })}
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
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CarFront size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Vehicle <span className="text-blue-600 italic">Rankings</span>
                  </h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top 5 by bookings</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {analytics.popularVehicles.map((item, index) => {
                const maxBooks = 50
                const percentage = (item.bookings / maxBooks) * 100
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-blue-600">0{index + 1}</span> {item.name}
                      </span>
                      <span className="text-base font-black text-gray-900">
                        {item.bookings} <span className="text-[9px] text-gray-400 font-bold ml-2">bookings</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${percentage}%` }} 
                        transition={{ delay: 1 + (index * 0.1), duration: 1 }} 
                        className="h-full bg-indigo-500" 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Distributions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white rounded-[40px] p-8 border border-gray-200 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-gray-50 text-blue-600 rounded-xl"><PieChart size={20} /></div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Booking Status</p>
            </div>
            <div className="space-y-5">
              {analytics.statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 group hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.status}</span>
                  </div>
                  <span className="text-xs font-black text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-gray-200 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-gray-50 text-blue-600 rounded-xl"><Star size={20} /></div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Top Customers</p>
            </div>
            <div className="space-y-4">
              {analytics.topCustomers.map((c, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{c.name}</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase">{c.bookings} bookings</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-600">₹{c.spent.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-gray-200 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-gray-50 text-blue-600 rounded-xl"><Wallet size={20} /></div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Payment Methods</p>
            </div>
            <div className="space-y-6 pt-2">
              {analytics.paymentMethods.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2">{m.icon} {m.method}</span>
                    <span>{m.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${m.percentage}%` }} 
                      transition={{ delay: 1.2 + i * 0.1 }} 
                      className={`h-full ${m.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            {analytics.recentActivity.map((a, i) => (
              <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-200 flex gap-5 group hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm uppercase group-hover:scale-110 transition-transform">
                  {a.type === 'booking' ? <CalendarDays size={20} /> : a.type === 'payment' ? <IndianRupee size={20} /> : a.type === 'user' ? <UserPlus size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{a.user}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 truncate">{a.action}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-[10px] font-black text-blue-600">{a.amount > 0 ? `₹${a.amount.toLocaleString()}` : 'VERIFIED'}</span>
                    <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
