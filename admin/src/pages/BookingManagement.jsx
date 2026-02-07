import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw, Calendar, User, Car, IndianRupee, Clock, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { paymentEventService } from '../services/paymentService'
import axios from 'axios'

const BookingManagement = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [filter, setFilter] = useState('all') // all, active, pending, completed, cancelled

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5005/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setBookings(response.data.data)
        console.log('✅ Bookings refreshed:', response.data.data.length)
      }
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      alert('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBookings()
  }, [])

  // Subscribe to payment events for auto-refresh
  useEffect(() => {
    console.log('🔔 Bookings subscribing to payment events...')
    
    const unsubscribe = paymentEventService.subscribe((event) => {
      console.log('🔔 Bookings received event:', event.type)
      
      if (event.type === 'PAYMENT_RECEIVED' || event.type === 'BOOKING_UPDATE' || event.type === 'SETTLEMENT_UPDATE') {
        console.log('✅ Auto-refreshing bookings data...')
        fetchBookings()
      }
    })

    return () => {
      console.log('🔕 Bookings unsubscribing from payment events')
      unsubscribe()
    }
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.put(
        `http://localhost:5005/api/bookings/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (response.data.success) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status } : b))
        
        // Notify other components about the booking update
        paymentEventService.notifyBookingUpdate({ bookingId: id, status })
        
        alert(`✅ Booking ${status} successfully!`)
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
      alert('Failed to update booking. Please try again.')
    }
  }

  // Filter bookings
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter)

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  return (
    <div className="p-8 bg-background-secondary min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-primary uppercase tracking-tight">
              Booking <span className="text-primary italic">Management</span>
            </h1>
            <p className="text-text-secondary text-sm mt-2 font-medium">
              Real-time booking operations • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Total Bookings', value: stats.total, icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500', filter: 'all' },
            { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'bg-yellow-500', filter: 'pending' },
            { label: 'Confirmed', value: stats.confirmed, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-500', filter: 'confirmed' },
            { label: 'Completed', value: stats.completed, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-indigo-500', filter: 'completed' },
            { label: 'Cancelled', value: stats.cancelled, icon: <XCircle className="w-5 h-5" />, color: 'bg-red-500', filter: 'cancelled' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setFilter(stat.filter)}
              className={`bg-white p-6 rounded-3xl border shadow-lg cursor-pointer transition-all hover:scale-105 ${
                filter === stat.filter ? 'border-primary ring-4 ring-primary/20' : 'border-border-light'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-text-primary">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Filter Indicator */}
        {filter !== 'all' && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-2xl p-4">
            <p className="text-sm font-bold text-primary">
              Showing {filter} bookings ({filteredBookings.length} results)
            </p>
            <button
              onClick={() => setFilter('all')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-border-light shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-border-light bg-background-secondary/20">
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
              {filter === 'all' ? 'All Bookings' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Booking ID</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Customer</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Vehicle</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Dates</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Amount</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Payment</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="w-12 h-12 text-text-secondary opacity-30" />
                        <p className="text-text-secondary font-bold">
                          {loading ? 'Loading bookings...' : 'No bookings found'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-background-secondary/30 transition-colors group"
                    >
                      <td className="p-6">
                        <span className="font-mono text-xs font-bold text-primary">
                          #{booking._id.slice(-8)}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                            {booking.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary text-sm">{booking.user?.name || 'N/A'}</p>
                            <p className="text-xs text-text-secondary font-medium">{booking.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <Car size={20} className="text-primary" />
                          <div>
                            <p className="font-bold text-text-primary text-sm">
                              {booking.car?.brand} {booking.car?.model}
                            </p>
                            <p className="text-xs text-text-secondary font-medium">{booking.car?.name || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="text-xs font-bold text-text-primary">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-text-secondary font-medium">
                            to {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-lg font-black text-primary">₹{booking.totalPrice?.toLocaleString()}</span>
                        {booking.discount > 0 && (
                          <p className="text-xs text-green-600 font-bold">-₹{booking.discount}</p>
                        )}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                          booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                          booking.status === 'completed' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button 
                              onClick={() => updateStatus(booking._id, 'completed')} 
                              className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-200 active:scale-90"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={20} />
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' && (
                            <button 
                              onClick={() => updateStatus(booking._id, 'cancelled')} 
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 active:scale-90"
                              title="Cancel Booking"
                            >
                              <XCircle size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
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

export default BookingManagement
