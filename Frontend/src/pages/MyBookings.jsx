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
    setBookings(response.data);
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101f22]/80 to-purple-900/40 text-white">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                My Bookings
              </h1>
              <p className="text-white/70 text-sm mt-1">Manage your reservations</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/browse-cars")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition"
          >
            <Car className="w-4 h-4" />
            Browse Cars
          </button>
        </motion.div>

        {/* Content */}
        {bookings.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
          >
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="w-16 h-16 text-cyan-300 opacity-60 mb-4" />
              <p className="text-white font-black text-xl">No bookings yet</p>
              <p className="text-white/60 text-sm mt-2">
                Book your first car and it will appear here.
              </p>

              <button
                onClick={() => navigate("/browse-cars")}
                className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition"
              >
                Browse Cars
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  boxShadow:
                    "0 22px 55px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.18), 0 0 40px rgba(168,85,247,0.22)",
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/60 font-semibold">Booking ID</p>
                    <p className="text-white font-black text-lg">{b.id}</p>
                    <p className="text-cyan-200/90 text-sm mt-1 font-semibold">
                      {b.carName}
                    </p>
                  </div>
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                      <MapPin className="w-4 h-4 text-cyan-300" />
                      Pickup
                    </div>
                    <p className="text-white mt-1 font-bold text-sm">{b.pickup}</p>
                    <p className="text-white/60 text-xs mt-1">{b.start}</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                      <MapPin className="w-4 h-4 text-purple-300" />
                      Drop-off
                    </div>
                    <p className="text-white mt-1 font-bold text-sm">{b.dropoff}</p>
                    <p className="text-white/60 text-xs mt-1">{b.end}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-300" />
                    <p className="text-white/70 text-sm">
                      Total:{" "}
                      <span className="text-white font-black">₹{b.total}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/car/${b.carId || "porsche"}`)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate("/payment")}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:brightness-110 transition text-sm"
                    >
                      Pay
                    </button>
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
