import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { CalendarDays, Clock, MapPin, Car, CreditCard, AlertTriangle } from "lucide-react";
import { bookingService } from '../services/bookingService';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();

      const mappedBookings = (response.data || []).map(b => ({
        id: b._id,
        carId: b.car?._id || b.car,
        carName: b.car ? `${b.car.brand} ${b.car.model}` : 'Unknown Car',
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
        pickup: b.car?.location || 'Store Location',
        dropoff: 'Store Location',
        start: new Date(b.startDate).toLocaleDateString() + ' ' + new Date(b.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: new Date(b.endDate).toLocaleDateString() + ' ' + new Date(b.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: b.totalPrice
      }));

      setBookings(mappedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      alert('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return 'px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200';
      case 'Pending': return 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200';
      case 'Cancelled': return 'px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200';
      case 'Completed': return 'px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200';
      default: return 'px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200';
    }
  };

  return (
    <div 
      className="min-h-screen pt-20 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'
              }}
            >
              <CalendarDays className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 
                className="text-3xl md:text-4xl font-black tracking-tight"
                style={{ color: theme.text }}
              >
                My Bookings
              </h1>
              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                Manage your reservations
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/browsecars")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-black hover:bg-green-600 transition border-2 border-transparent"
          >
            <Car className="w-4 h-4" />
            Browse Cars
          </button>
        </motion.div>

        {/* Content */}
        {bookings.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border p-8 shadow-sm"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="w-16 h-16 opacity-30 mb-4" style={{ color: theme.textSecondary }} />
              <p className="font-black text-xl" style={{ color: theme.text }}>
                No bookings yet
              </p>
              <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
                Book your first car and it will appear here.
              </p>

              <button
                onClick={() => navigate("/browsecars")}
                className="mt-6 px-6 py-3 rounded-xl bg-green-500 text-white font-black hover:bg-green-600 transition"
              >
                Browse Cars
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((b, idx) => (
              <motion.div
                key={b.id || idx}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  boxShadow: isDarkMode 
                    ? "0 10px 30px -10px rgba(16, 185, 129, 0.3)" 
                    : "0 10px 30px -10px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-2xl border p-6 shadow-sm hover:border-green-500/30 transition-colors"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Booking ID
                    </p>
                    <p className="font-black text-lg" style={{ color: theme.text }}>
                      {b.id}
                    </p>
                    <p className="text-green-500 text-sm mt-1 font-semibold">
                      {b.carName}
                    </p>
                  </div>
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className="rounded-xl border p-4"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      <MapPin className="w-4 h-4 text-green-500" />
                      Pickup
                    </div>
                    <p className="mt-1 font-bold text-sm" style={{ color: theme.text }}>
                      {b.pickup}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      {b.start}
                    </p>
                  </div>

                  <div 
                    className="rounded-xl border p-4"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      <MapPin className="w-4 h-4 text-green-500" />
                      Drop-off
                    </div>
                    <p className="mt-1 font-bold text-sm" style={{ color: theme.text }}>
                      {b.dropoff}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      {b.end}
                    </p>
                  </div>
                </div>

                <div 
                  className="mt-5 flex items-center justify-between gap-3 pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      Total:{" "}
                      <span className="font-black" style={{ color: theme.text }}>
                        ₹{b.total}
                      </span>
                    </p>
                  </div>

                 <div className="flex gap-2 flex-wrap">
  <button
    onClick={() => navigate(`/car/${b.carId || "porsche"}`)}
    className="px-4 py-2 rounded-xl border font-bold hover:bg-opacity-50 transition text-sm"
    style={{
      backgroundColor: theme.cardBg,
      borderColor: theme.border,
      color: theme.text
    }}
  >
    View
  </button>
  
  {/* Report Damage Button - Show for Active/Completed bookings */}
  {(b.status === 'Confirmed' || b.status === 'Completed') && (
    <button
      onClick={() => navigate(`/report-damage/${b.id}`)}
      className="px-4 py-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-600 font-bold hover:bg-orange-500/20 transition text-sm flex items-center gap-2"
    >
      <AlertTriangle className="w-4 h-4" />
      Report Damage
    </button>
  )}
  
  {(b.status === 'Pending' || b.status === 'Confirmed') && (
    <button
      onClick={() => handleCancelBooking(b.id)}
      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition text-sm border border-red-200"
    >
      Cancel
    </button>
  )}
  
  {b.status === 'Pending' && (
    <button
      onClick={() => navigate("/payment")}
      className="px-4 py-2 rounded-xl bg-green-500 text-white font-black hover:bg-green-600 transition text-sm"
    >
      Pay
    </button>
  )}
</div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default MyBookings;
