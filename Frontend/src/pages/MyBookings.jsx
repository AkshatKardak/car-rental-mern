import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { CalendarDays, Clock, MapPin, Car, CreditCard } from "lucide-react";
import { useEffect, useState } from 'react';
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

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();

      // Map backend fields to frontend UI expectations
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
      fetchBookings(); // Refresh list
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
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
                My Bookings
              </h1>
              <p className="text-text-secondary text-sm mt-1">Manage your reservations</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/browsecars")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition border-2 border-transparent"
          >
            <Car className="w-4 h-4" />
            Browse Cars
          </button>
        </motion.div>

        {/* Content */}
        {bookings.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-border-light bg-white p-8 shadow-sm"
          >
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="w-16 h-16 text-text-secondary opacity-30 mb-4" />
              <p className="text-text-primary font-black text-xl">No bookings yet</p>
              <p className="text-text-secondary text-sm mt-2">
                Book your first car and it will appear here.
              </p>

              <button
                onClick={() => navigate("/browsecars")}
                className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition"
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
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-2xl border border-border-light bg-white p-6 shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-secondary font-semibold">Booking ID</p>
                    <p className="text-text-primary font-black text-lg">{b.id}</p>
                    <p className="text-primary text-sm mt-1 font-semibold">
                      {b.carName}
                    </p>
                  </div>
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border-light bg-background-secondary p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-xs font-semibold">
                      <MapPin className="w-4 h-4 text-primary" />
                      Pickup
                    </div>
                    <p className="text-text-primary mt-1 font-bold text-sm">{b.pickup}</p>
                    <p className="text-text-secondary text-xs mt-1">{b.start}</p>
                  </div>

                  <div className="rounded-xl border border-border-light bg-background-secondary p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-xs font-semibold">
                      <MapPin className="w-4 h-4 text-primary" />
                      Drop-off
                    </div>
                    <p className="text-text-primary mt-1 font-bold text-sm">{b.dropoff}</p>
                    <p className="text-text-secondary text-xs mt-1">{b.end}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border-light">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <p className="text-text-secondary text-sm">
                      Total:{" "}
                      <span className="text-text-primary font-black">₹{b.total}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/car/${b.carId || "porsche"}`)}
                      className="px-4 py-2 rounded-xl bg-white border border-border-light text-text-primary font-bold hover:bg-background-secondary transition text-sm"
                    >
                      View
                    </button>
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
                        className="px-4 py-2 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition text-sm"
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
