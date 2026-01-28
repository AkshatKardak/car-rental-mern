import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { statsService } from '../services/statsService'
import { paymentEventService } from '../services/paymentService'
import {
  Bell,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Tag,
  AlertTriangle,
  Coins,
  ChevronDown,
  Menu,
  Settings,
  ArrowUpRight,
  Clock,
  CarFront
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days')
  const [notifications, setNotifications] = useState(3)
  const [stats, setStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const statsResponse = await statsService.getDashboardStats()

      setStats([
        {
          title: 'Total Revenue',
          value: `₹${statsResponse.data.totalRevenue?.toLocaleString() || '0'}`,
          icon: <Coins className="w-5 h-5" />,
          change: statsResponse.data.revenueChange || '+12.4%',
          trend: 'up',
          description: 'vs last month',
          color: 'primary'
        },
        {
          title: 'Active Bookings',
          value: statsResponse.data.activeBookings || '45',
          icon: <Calendar className="w-5 h-5" />,
          change: statsResponse.data.bookingsChange || '+5.2%',
          trend: 'up',
          description: 'Current active',
          color: 'primary'
        },
        {
          title: 'Fleet Utilization',
          value: `${statsResponse.data.fleetUtilization || '78'}%`,
          icon: <CarFront className="w-5 h-5" />,
          change: statsResponse.data.utilizationChange || '-2.1%',
          trend: 'down',
          description: 'Live availability',
          color: 'orange'
        },
        {
          title: 'Pending Claims',
          value: statsResponse.data.pendingRequests || '8',
          icon: <AlertTriangle className="w-5 h-5" />,
          change: 'Priority',
          trend: 'neutral',
          description: 'Damage reports',
          color: 'red'
        },
      ])

      const activityResponse = await statsService.getRecentActivity(5)
      setRecentActivity(activityResponse.data.bookings || [])
      setLastRefresh(new Date())

    } catch (error) {
      console.error('Data fetch failed, loading fallback UI')
      setStats([
        { title: 'Total Revenue', value: '₹1,28,450', icon: <Coins className="w-5 h-5" />, change: '+12.4%', trend: 'up', description: 'vs last month', color: 'primary' },
        { title: 'Active Bookings', value: '45', icon: <Calendar className="w-5 h-5" />, change: '+5.2%', trend: 'up', description: 'Current active', color: 'primary' },
        { title: 'Fleet Utilization', value: '78%', icon: <CarFront className="w-5 h-5" />, change: '-2.1%', trend: 'down', description: 'Live availability', color: 'primary' },
        { title: 'Pending Claims', value: '8', icon: <AlertTriangle className="w-5 h-5" />, change: 'New', trend: 'neutral', description: 'Damage reports', color: 'primary' },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [selectedDateRange])

  // Subscribe to payment events for auto-refresh
  useEffect(() => {
    console.log('🔔 Dashboard subscribing to payment events...')
    
    const unsubscribe = paymentEventService.subscribe((event) => {
      console.log('🔔 Dashboard received event:', event.type)
      
      if (event.type === 'PAYMENT_RECEIVED' || event.type === 'SETTLEMENT_UPDATE' || event.type === 'BOOKING_UPDATE') {
        console.log('✅ Auto-refreshing dashboard data...')
        fetchDashboardData()
        setNotifications(prev => prev + 1)
      }
    })

    return () => {
      console.log('🔕 Dashboard unsubscribing from payment events')
      unsubscribe()
    }
  }, [])

  const quickActions = [
    { icon: <PlusCircle size={20} />, title: 'Add Vehicle', description: 'Register to fleet', path: '/admin/vehicles' },
    { icon: <Tag size={20} />, title: 'Create Promo', description: 'New campaign', path: '/admin/promotions' },
    { icon: <AlertTriangle size={20} />, title: 'Damage Audit', description: 'Review claims', path: '/admin/damage' },
    { icon: <RefreshCw size={20} />, title: 'Settlements', description: 'View payouts', path: '/admin/payments' },
  ]

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-4 min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Admin Engine</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-20 bg-gray-50">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              System <span className="text-blue-600 italic">Overview</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Real-time performance analytics • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-gray-900 hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span>{selectedDateRange}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showDatePicker ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-14 right-0 bg-white shadow-2xl rounded-2xl p-2 w-56 z-50 border border-gray-200 overflow-hidden"
                  >
                    {['Last 7 Days', 'Last 30 Days', 'This Month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => { setSelectedDateRange(range); setShowDatePicker(false) }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        {range}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => { fetchDashboardData(); alert('Data refreshed manually') }}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm active:scale-90"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => { setNotifications(0); alert('Alerts cleared') }}
                className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all relative overflow-hidden active:scale-95"
              >
                <Bell size={20} />
              </button>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-lg min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-gray-50">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Major KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-7 rounded-3xl border border-gray-200 shadow-lg relative group hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-blue-600 group-hover:bg-blue-50 transition-colors">
                  {stat.icon}
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-600' :
                  stat.trend === 'down' ? 'bg-red-50 text-red-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : stat.trend === 'down' ? <TrendingDown size={12} /> : null}
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] text-gray-400 mt-3 font-bold">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Control Center */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider px-1 flex items-center gap-2">
            <Settings size={14} className="text-blue-600" /> Command Center
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white p-6 rounded-3xl flex items-center gap-5 border border-gray-200 shadow-lg hover:translate-y-[-5px] hover:border-blue-300 hover:shadow-xl transition-all text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  {action.icon}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base uppercase tracking-tight">{action.title}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Ledger */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <RefreshCw size={20} className="text-blue-600" /> Recent Operations
            </h3>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="group text-xs font-black text-blue-600 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
            >
              VIEW FULL LEDGER <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] font-black uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                  <th className="px-8 py-5">Vehicle Core</th>
                  <th className="px-8 py-5">Customer Node</th>
                  <th className="px-8 py-5">Date Index</th>
                  <th className="px-8 py-5">Status Token</th>
                  <th className="px-8 py-5 text-right">Value (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <Clock size={40} className="text-gray-400" />
                        <p className="font-black text-sm uppercase tracking-widest text-gray-400">No activities recorded today</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((activity, index) => (
                    <tr key={index} className="group hover:bg-gray-50 transition-colors cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <CarFront className="text-gray-400" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 uppercase tracking-tight text-sm">{activity.car?.name || 'Vehicle ID'}</p>
                            <p className="text-[10px] text-gray-500 font-bold">{activity.car?.model || 'Series 2024'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px]">
                            {activity.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{activity.user?.name || 'Standard Client'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          activity.status === 'Active' || activity.status === 'Confirmed' ? 'bg-green-50 text-green-600 border border-green-200' :
                          activity.status === 'Completed' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          'bg-orange-50 text-orange-600 border border-orange-200'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-gray-900 text-base">
                        ₹{activity.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
