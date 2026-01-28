import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw, Calendar, User, Car, IndianRupee, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { paymentEventService } from '../services/paymentService'

const DUMMY_BOOKINGS = [
  { _id: 'BK101', user: { name: 'Rahul Sharma', email: 'rahul@example.com' }, car: { name: 'Mercedes-Benz G63', model: 'Luxury SUV' }, date: '2024-03-01', total: 100000, status: 'active', createdAt: new Date() },
  { _id: 'BK102', user: { name: 'Amit Verma', email: 'amit@example.com' }, car: { name: 'Skoda Kylaq', model: 'Compact SUV' }, date: '2024-03-10', total: 5000, status: 'pending', createdAt: new Date() },
  { _id: 'BK103', user: { name: 'Sneha Gupta', email: 'sneha@example.com' }, car: { name: 'Audi e-tron', model: 'Electric SUV' }, date: '2024-02-20', total: 24000, status: 'completed', createdAt: new Date() },
]

const BookingManagement = () => {
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Replace with your actual API call
      // const response = await bookingService.getAllBookings()
      // setBookings(response.data.bookings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('✅ Bookings refreshed')
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
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
        
        // Show toast notification
        alert(`📋 ${event.type === 'PAYMENT_RECEIVED' ? 'New Payment Received' : 'Booking Updated'}!\nBookings refreshed automatically.`)
      }
    })

    return () => {
      console.log('🔕 Bookings unsubscribing from payment events')
      unsubscribe()
    }
  }, [])

  const updateStatus = (id, status) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b))
    
    // Notify other components about the booking update
    paymentEventService.notifyBookingUpdate({ bookingId: id, status })
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500' },
            { label: 'Active', value: bookings.filter(b => b.status === 'active').length, icon: <Clock className="w-5 h-5" />, color: 'bg-green-500' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: <Clock className="w-5 h-5" />, color: 'bg-orange-500' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-indigo-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-border-light shadow-lg"
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

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-border-light shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-border-light bg-background-secondary/20">
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">All Bookings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Booking ID</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Customer</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Vehicle</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Date</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Amount</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="p-6 text-xs font-black uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-background-secondary/30 transition-colors group"
                  >
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-primary">{booking._id}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                          {booking.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{booking.user.name}</p>
                          <p className="text-xs text-text-secondary font-medium">{booking.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Car size={20} className="text-primary" />
                        <div>
                          <p className="font-bold text-text-primary text-sm">{booking.car.name}</p>
                          <p className="text-xs text-text-secondary font-medium">{booking.car.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold text-text-secondary">{booking.date}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-lg font-black text-primary">₹{booking.total.toLocaleString()}</span>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                        booking.status === 'active' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => updateStatus(booking._id, 'completed')} 
                          className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-200 active:scale-90"
                          title="Mark as Completed"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => updateStatus(booking._id, 'cancelled')} 
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 active:scale-90"
                          title="Cancel Booking"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingManagement
