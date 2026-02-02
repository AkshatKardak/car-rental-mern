import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  CreditCard,
  Wallet,
  Building2,
  Lock,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Tag,
  Loader,
  CheckCircle,
  AlertCircle,
  Car
} from "lucide-react";
import { paymentService } from "../services/paymentService";
import { bookingService } from "../services/bookingService";
import { loadRazorpayScript, initRazorpayPayment } from "../utils/razorpay";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const incoming = location.state || {};

  // Check if payment data exists
  const hasPaymentData = incoming.carId && incoming.carName && incoming.startDate && incoming.endDate;

  const summary = useMemo(() => {
    if (!hasPaymentData) {
      return null;
    }

    const carName = incoming.carName || "Selected Car";
    const carId = incoming.carId;
    const days = incoming.days || 2;

    const baseFare = incoming.baseFare ?? (incoming.pricePerDay ? incoming.pricePerDay * days : 0);
    const taxesFees = incoming.taxesFees ?? 0;
    const deposit = incoming.deposit ?? 0;
    const promoCode = incoming.promoCode ?? "";
    const promoDiscount = incoming.promoDiscount ?? 0;

    const total = Math.max(0, baseFare + taxesFees + deposit - promoDiscount);

    return {
      carName,
      carId,
      days,
      baseFare,
      taxesFees,
      deposit,
      promoCode,
      promoDiscount,
      total,
      startDate: incoming.startDate,
      endDate: incoming.endDate,
    };
  }, [incoming, hasPaymentData]);

  const [method, setMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [upiId, setUpiId] = useState('');

  const [promoCode, setPromoCode] = useState(incoming.promoCode || '');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(incoming.promoCode ? true : false);

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  // UPI ID validation function
  const validateUpiId = (upi) => {
    if (!upi) return false;
    // UPI format: username@provider
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
    return upiRegex.test(upi);
  };

  // Show empty state if no payment data
  if (!hasPaymentData) {
    return (
      <div 
        className="min-h-screen transition-colors duration-300 pt-20"
        style={{ backgroundColor: theme.bg }}
      >
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border p-12 text-center shadow-xl"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <div 
              className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
            
            <h1 className="text-3xl font-black mb-3" style={{ color: theme.text }}>
              No Payment Details Found
            </h1>
            
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: theme.textSecondary }}>
              You need to select a car and complete the booking form before proceeding to payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/browsecars')}
                className="px-8 py-4 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Browse Cars
              </button>
              
              <button
                onClick={() => navigate('/mybookings')}
                className="px-8 py-4 rounded-2xl border font-black hover:bg-opacity-50 transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border,
                  color: theme.text
                }}
              >
                My Bookings
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setLoadingCoupon(true);
    setCouponError('');

    try {
      // Simulate coupon validation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo: accept any code
      setAppliedCoupon(true);
      alert(`Coupon "${promoCode}" applied successfully!`);
    } catch (error) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(false);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create booking first
      const bookingData = {
        carId: summary.carId,
        startDate: summary.startDate,
        endDate: summary.endDate,
        totalPrice: summary.total,
        discount: summary.promoDiscount,
        promotionCode: summary.promoCode
      };

      const bookingResponse = await bookingService.createBooking(bookingData);
      
      if (!bookingResponse.success) {
        throw new Error('Failed to create booking');
      }

      const bookingId = bookingResponse.data._id;

      // Create Razorpay order
      const orderResponse = await paymentService.createOrder({ bookingId });
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const order = orderResponse.order;

      // Initialize Razorpay payment
      const paymentResult = await initRazorpayPayment(
        order,
        {
          name: summary.carName,
          description: `${summary.days} days rental`,
        },
        async (response) => {
          // Payment successful callback
          try {
            const verifyResponse = await paymentService.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              navigate('/payment-success', {
                state: {
                  bookingId: bookingId,
                  amount: summary.total,
                  paymentId: response.razorpay_payment_id,
                  carName: summary.carName
                }
              });
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        (error) => {
          // Payment failed callback
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
        }
      );

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (active) => `
    flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-black text-xs sm:text-sm 
    transition-all flex items-center justify-center gap-2 shadow-sm
    ${active ? 'shadow-md' : 'hover:shadow-md'}
  `;

  return (
    <div 
      className="min-h-screen transition-colors duration-300 pt-20"
      style={{ backgroundColor: theme.bg }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.h1
          className="text-3xl sm:text-4xl font-black mb-2"
          style={{ color: theme.text }}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          Select Payment Method
        </motion.h1>

        <motion.p
          className="mb-8 text-sm sm:text-base"
          style={{ color: theme.textSecondary }}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          Choose how you want to pay for your ride.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Payment form */}
          <motion.section
            className="lg:col-span-2 space-y-6"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            {/* Coupon */}
            <div 
              className="rounded-3xl border p-4 sm:p-6 shadow-lg"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-green-500" />
                <p className="font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                  Have a Coupon Code?
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={appliedCoupon}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors uppercase"
                  style={{
                    backgroundColor: appliedCoupon ? theme.border : theme.inputBg,
                    borderColor: couponError ? '#ef4444' : theme.border,
                    color: theme.text
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loadingCoupon || appliedCoupon || !promoCode.trim()}
                  className="px-6 py-3 rounded-xl bg-green-500 text-white font-black text-sm hover:bg-green-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingCoupon ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Applying...</span>
                    </>
                  ) : appliedCoupon ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Applied</span>
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 mt-2">{couponError}</p>
              )}
            </div>

            {/* Payment Methods */}
            <div 
              className="rounded-3xl border p-4 sm:p-6 space-y-6 shadow-lg"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              {/* Tabs */}
              <div 
                className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl"
                style={{
                  backgroundColor: theme.inputBg,
                  borderWidth: 1,
                  borderColor: theme.border
                }}
              >
                <button 
                  className={tabClass(method === "card")} 
                  onClick={() => setMethod("card")}
                  style={{
                    backgroundColor: method === "card" ? '#10b981' : 'transparent',
                    color: method === "card" ? '#ffffff' : theme.textSecondary
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Credit/Debit Card</span>
                  <span className="sm:hidden">Card</span>
                </button>

                <button 
                  className={tabClass(method === "upi")} 
                  onClick={() => setMethod("upi")}
                  style={{
                    backgroundColor: method === "upi" ? '#10b981' : 'transparent',
                    color: method === "upi" ? '#ffffff' : theme.textSecondary
                  }}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">UPI / Wallets</span>
                  <span className="sm:hidden">UPI</span>
                </button>

                <button 
                  className={tabClass(method === "netbanking")} 
                  onClick={() => setMethod("netbanking")}
                  style={{
                    backgroundColor: method === "netbanking" ? '#10b981' : 'transparent',
                    color: method === "netbanking" ? '#ffffff' : theme.textSecondary
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Net Banking</span>
                  <span className="sm:hidden">Bank</span>
                </button>
              </div>

              {/* Card Form */}
              {method === "card" && (
                <div className="space-y-4">
                  <p className="font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                    Credit or Debit Card
                  </p>

                  <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                    Razorpay securely processes all card payments. Click the Pay button below to proceed.
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="w-full rounded-xl border px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={5}
                        className="rounded-xl border px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                        className="rounded-xl border px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-5 h-5 accent-green-500 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                        Securely save card for future bookings
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* UPI */}
              {method === "upi" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <p className="font-bold text-lg mb-2" style={{ color: theme.text }}>
                      UPI / Wallets
                    </p>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      Enter your UPI ID to make instant payment. All major UPI apps supported.
                    </p>
                  </div>

                  {/* UPI ID Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                      UPI ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                        placeholder="yourname@paytm / yourname@okaxis"
                        className="w-full rounded-xl border px-4 py-4 pr-12 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors lowercase"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                      <Wallet 
                        className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2" 
                        style={{ color: theme.textSecondary }} 
                      />
                    </div>
                    
                    {/* UPI ID Validation Hint */}
                    {upiId && !validateUpiId(upiId) && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Please enter a valid UPI ID (e.g., username@paytm)
                      </p>
                    )}
                    
                    {upiId && validateUpiId(upiId) && (
                      <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Valid UPI ID
                      </p>
                    )}
                  </div>

                  {/* Popular UPI Apps */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
                      Supported UPI Apps
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {['GooglePay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <div
                          key={app}
                          className="p-3 rounded-xl border text-center transition-all hover:border-green-500 hover:shadow-md cursor-pointer"
                          style={{
                            backgroundColor: theme.inputBg,
                            borderColor: theme.border
                          }}
                        >
                          <p className="text-xs font-bold" style={{ color: theme.text }}>
                            {app}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Information Box */}
                  <div 
                    className="p-4 rounded-xl border-l-4 border-l-green-500"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#D1FAE5',
                      borderRight: `1px solid ${theme.border}`,
                      borderTop: `1px solid ${theme.border}`,
                      borderBottom: `1px solid ${theme.border}`
                    }}
                  >
                    <p className="text-sm font-bold mb-1" style={{ color: theme.text }}>
                      💡 Quick Tip
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      After clicking Pay, you'll be redirected to Razorpay where you can complete the payment using your UPI app.
                    </p>
                  </div>
                </div>
              )}

              {/* Netbanking */}
              {method === "netbanking" && (
                <div className="space-y-4">
                  <p className="font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                    Net Banking
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                    Razorpay supports all major banks. Click the Pay button to proceed and select your bank.
                  </p>
                  <select 
                    className="w-full rounded-xl border px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 appearance-none transition-colors"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                  >
                    <option>Select Your Bank</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Bank of Baroda</option>
                    <option>Other Banks</option>
                  </select>
                </div>
              )}
            </div>

            {/* Trust row */}
            <div 
              className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: theme.textSecondary }}>
                <Lock className="w-4 h-4 text-green-500" />
                256-bit SSL Encrypted
              </div>
              <div className="flex gap-2">
                <BadgeMini theme={theme}>VISA</BadgeMini>
                <BadgeMini theme={theme}>MC</BadgeMini>
                <BadgeMini theme={theme}>AMEX</BadgeMini>
                <BadgeMini theme={theme}>UPI</BadgeMini>
              </div>
            </div>
          </motion.section>

          {/* Right: Summary */}
          <motion.aside
            className="space-y-6"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div 
              className="rounded-3xl border p-6 shadow-lg sticky top-24"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-black mb-4" style={{ color: theme.text }}>
                Summary
              </h2>

              <div className="space-y-3 mb-6">
                <SummaryRow 
                  label={`${summary.carName} • ${summary.days} days`} 
                  value="" 
                  theme={theme} 
                  bold 
                />
                <div className="h-px" style={{ backgroundColor: theme.border }} />
                <SummaryRow label="Base Fare" value={`₹${summary.baseFare}`} theme={theme} />
                <SummaryRow label="Taxes & Fees" value={`₹${summary.taxesFees}`} theme={theme} />
                <SummaryRow 
                  label="Security Deposit" 
                  value={`₹${summary.deposit}`} 
                  subtext="(Refundable)" 
                  theme={theme} 
                />
                {summary.promoDiscount > 0 && (
                  <SummaryRow 
                    label={`Discount (${summary.promoCode})`} 
                    value={`-₹${summary.promoDiscount}`} 
                    theme={theme}
                    valueClass="text-green-500"
                  />
                )}
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: theme.border }} />

              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                    Total Payable
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Incl. all taxes
                  </p>
                </div>
                <p className="text-3xl font-black text-green-500">
                  ₹{summary.total.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl bg-green-500 text-white font-black text-base hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{summary.total.toLocaleString()}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-center mt-4" style={{ color: theme.textSecondary }}>
                By clicking pay, you agree to our{' '}
                <a href="#" className="text-green-500 hover:underline">Terms & Conditions</a>
              </p>
            </div>

            {/* Trust badges */}
            <div 
              className="rounded-2xl border p-4 space-y-3"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: theme.text }}>Secure payments</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Powered by Razorpay
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: theme.text }}>Need help?</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Support available 24/7
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

// Helper components
const SummaryRow = ({ label, value, subtext, theme, bold, valueClass }) => (
  <div className="flex items-center justify-between text-sm">
    <div>
      <span style={{ color: bold ? theme.text : theme.textSecondary }} className={bold ? "font-bold" : ""}>
        {label}
      </span>
      {subtext && (
        <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
          {subtext}
        </span>
      )}
    </div>
    {value && (
      <span 
        className={valueClass || (bold ? "font-bold" : "")}
        style={!valueClass ? { color: bold ? theme.text : theme.textSecondary } : {}}
      >
        {value}
      </span>
    )}
  </div>
);

const BadgeMini = ({ children, theme }) => (
  <div 
    className="px-2 py-1 rounded text-xs font-bold border"
    style={{
      backgroundColor: theme.inputBg,
      borderColor: theme.border,
      color: theme.textSecondary
    }}
  >
    {children}
  </div>
);

export default Payment;
