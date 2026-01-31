import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { bookingService } from '../services/bookingService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  ArrowRight,
  CheckCircle,
  Loader,
  ArrowLeft
} from 'lucide-react';

// Import all car images from assets
import heroCarImg from '../assets/herocar.png';
import porscheImg from '../assets/porsche.png';
import mercedesImg from '../assets/mercedesg63amg.png';
import kiaImg from '../assets/Kia.png';
import skodaImg from '../assets/skoda.png';
import audiImg from '../assets/AudiElectric.png';
import supraImg from '../assets/supra.png';
import lamboImg from '../assets/lambo.png';
import bugattiImg from '../assets/Bugatti.png';
import rollsImg from '../assets/rolls royce.png';
import nanoImg from '../assets/Nano.png';
import HondaImg from '../assets/Honda.png';

const getImageForCar = (car) => {
  if (!car) return heroCarImg;

  if (car.images && car.images.length > 0) {
    const tag = String(car.images[0]).toLowerCase();
    if (tag.includes('nano') || tag.includes('tata')) return nanoImg;
    if (tag.includes('porsche')) return porscheImg;
    if (tag.includes('mercedes')) return mercedesImg;
    if (tag.includes('kia')) return kiaImg;
    if (tag.includes('skoda')) return skodaImg;
    if (tag.includes('audi')) return audiImg;
    if (tag.includes('honda')) return HondaImg;
    if (tag.includes('supra') || tag.includes('toyota')) return supraImg;
    if (tag.includes('lambo')) return lamboImg;
    if (tag.includes('bugatti')) return bugattiImg;
    if (tag.includes('rolls')) return rollsImg;
  }

  const text = `${car.brand || ''} ${car.model || ''}`.toLowerCase();

  if (text.includes('nano') || (text.includes('tata') && text.includes('nano'))) return nanoImg;
  if (text.includes('porsche') || text.includes('911')) return porscheImg;
  if (text.includes('mercedes') || text.includes('g63') || text.includes('g-wagon') || text.includes('amg')) return mercedesImg;
  if (text.includes('kia') || text.includes('carens')) return kiaImg;
  if (text.includes('skoda') || text.includes('kylaq')) return skodaImg;
  if (text.includes('audi') || text.includes('e-tron')) return audiImg;
  if (text.includes('supra') || text.includes('toyota')) return supraImg;
  if (text.includes('honda') || text.includes('zxcvt')) return HondaImg;
  if (text.includes('lambo')) return lamboImg;
  if (text.includes('bugatti')) return bugattiImg;
  if (text.includes('rolls')) return rollsImg;

  return heroCarImg;
};

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const { car, bookingDetails } = location.state || {};

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  if (!car || !bookingDetails) {
    navigate('/browsecars');
    return null;
  }

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      // Calculate proper fees
      const baseFare = bookingDetails.totalPrice;
      const taxesFees = Math.round(baseFare * 0.12); // 12% tax
      const deposit = 500;

      // Navigate to payment page with complete booking details
      navigate('/payment', {
        state: {
          bookingId: null, // Will be created during payment
          carId: car._id,
          carName: `${car.brand} ${car.model}`,
          carImage: car.images?.[0],
          startDate: bookingDetails.startDate,
          endDate: bookingDetails.endDate,
          days: bookingDetails.days,
          pricePerDay: car.pricePerDay,
          baseFare: baseFare,
          taxesFees: taxesFees,
          deposit: deposit,
          pickupLocation: bookingDetails.pickupLocation,
          dropoffLocation: bookingDetails.dropoffLocation,
        }
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // Calculate totals
  const baseFare = bookingDetails.totalPrice;
  const taxesFees = Math.round(baseFare * 0.12);
  const deposit = 500;
  const totalAmount = baseFare + taxesFees + deposit;

  // Get the proper car image
  const carImageSrc = getImageForCar(car);

  return (
    <div 
      className="min-h-screen pt-20 pb-12 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 transition font-medium hover:text-green-500"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: theme.text }}>
            Confirm Your Booking
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Review your booking details before proceeding to payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Details */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="rounded-2xl border p-6 shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                <Car className="w-5 h-5 text-green-500" />
                Vehicle Details
              </h2>
              
              <div className="flex gap-4">
                <img 
                  src={carImageSrc}
                  alt={car.name || `${car.brand} ${car.model}`}
                  className="w-32 h-24 object-contain rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg" style={{ color: theme.text }}>
                    {car.name || `${car.brand} ${car.model}`}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    {car.brand} • {car.year}
                  </p>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    {car.fuelType} • {car.transmission} • {car.seats} Seats
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Information */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
              className="rounded-2xl border p-6 shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
                Booking Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Pickup Date
                    </p>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {new Date(bookingDetails.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Return Date
                    </p>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {new Date(bookingDetails.endDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Duration
                    </p>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {bookingDetails.days} {bookingDetails.days === 1 ? 'Day' : 'Days'}
                    </p>
                  </div>
                </div>

                {bookingDetails.pickupLocation && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                        Pickup Location
                      </p>
                      <p className="font-semibold" style={{ color: theme.text }}>
                        {bookingDetails.pickupLocation}
                      </p>
                    </div>
                  </div>
                )}

                {bookingDetails.dropoffLocation && bookingDetails.dropoffLocation !== bookingDetails.pickupLocation && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                        Dropoff Location
                      </p>
                      <p className="font-semibold" style={{ color: theme.text }}>
                        {bookingDetails.dropoffLocation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Price Summary */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.3 }}
              className="rounded-2xl border p-6 sticky top-24 shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
                Price Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>
                    ₹{car.pricePerDay?.toLocaleString()} × {bookingDetails.days} {bookingDetails.days === 1 ? 'day' : 'days'}
                  </span>
                  <span className="font-semibold" style={{ color: theme.text }}>
                    ₹{baseFare.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Taxes & Fees (12%)</span>
                  <span className="font-semibold" style={{ color: theme.text }}>
                    ₹{taxesFees.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>
                    Security Deposit <span className="text-xs opacity-60">(Refundable)</span>
                  </span>
                  <span className="font-semibold" style={{ color: theme.text }}>
                    ₹{deposit}
                  </span>
                </div>

                <div className="h-px" style={{ backgroundColor: theme.border }} />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                      Total Amount
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary, opacity: 0.6 }}>
                      Incl. all taxes
                    </p>
                  </div>
                  <p className="text-2xl font-black text-green-500">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: theme.textSecondary, opacity: 0.7 }}>
                💳 You can apply coupon codes on the payment page
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;