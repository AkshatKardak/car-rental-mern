import React, { useMemo, useState } from "react";
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
  ScanLine,
} from "lucide-react";
import { paymentService } from "../services/paymentService";
import { bookingService } from "../services/bookingService";
import { loadRazorpayScript, initRazorpayPayment } from "../utils/razorpay";
import axios from 'axios';
import QRScanner from "../components/QRScanner";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const incoming = location.state || {};

  const summary = useMemo(() => {
    const carName = incoming.carName || "Selected Car";
    const carId = incoming.carId;
    const days = incoming.days || 2;

    const baseFare = incoming.baseFare ?? (incoming.pricePerDay ? incoming.pricePerDay * days : 1200);
    const taxesFees = incoming.taxesFees ?? 150;
    const deposit = incoming.deposit ?? 300;
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
  }, [incoming]);

  const [method, setMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");

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

  const tabClass = (active) =>
    `flex items-center gap-2 px-5 py-4 rounded-xl transition border font-bold text-sm whitespace-nowrap
     ${active
      ? "bg-green-500/10 border-green-500/30 text-green-500 shadow-sm"
      : `border-transparent hover:${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`
    }`;


const handleApplyCoupon = async () => {
  if (!promoCode.trim()) {
    setCouponError('Please enter a coupon code');
    return;
  }

  try {
    setLoadingCoupon(true);
    setCouponError('');

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/promotions/validate`,
      { code: promoCode },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      }
    );

    if (response.data.success) {
      const discount = response.data.data.discountPercentage;
      const discountAmount = Math.round((summary.baseFare * discount) / 100);

      // Update location state with discount
      navigate('/payment', {
        replace: true,
        state: {
          ...incoming,
          promoCode: promoCode,
          promoDiscount: discountAmount
        }
      });

      setAppliedCoupon(true);
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    setCouponError(
      error.response?.data?.message || 'Invalid or expired coupon code'
    );
  } finally {
    setLoadingCoupon(false);
  }
};

const handleRemoveCoupon = () => {
  navigate('/payment', {
    replace: true,
    state: {
      ...incoming,
      promoCode: '',
      promoDiscount: 0
    }
  });
  setPromoCode('');
  setAppliedCoupon(false);
  setCouponError('');
};


  const handlePay = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const bookingData = {
        carId: summary.carId,
        startDate: summary.startDate,
        endDate: summary.endDate,
        totalPrice: summary.total,
        discount: summary.promoDiscount,
        promotionCode: summary.promoCode,
      };

      const bookingResponse = await bookingService.createBooking(bookingData);
      const bookingId = bookingResponse.data._id;

      const orderData = {
        amount: summary.total,
        currency: 'INR',
        bookingId: bookingId,
      };

      const orderResponse = await paymentService.createOrder(orderData);
      const order = orderResponse.data;

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'RentRide',
        description: `Booking for ${summary.carName}`,
        order_id: order.id,
        prefill: {
          name: holder || 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#10b981',
        },
      };

      const paymentResponse = await initRazorpayPayment(razorpayOptions);

      const verifyData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        bookingId: bookingId,
      };

      await paymentService.verifyPayment(verifyData);

      alert('Payment successful! Your booking is confirmed.');
      navigate('/mybookings');

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300 pt-20"
      style={{ backgroundColor: theme.bg }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Select Payment Method
            </h1>
            <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
              Choose how you want to pay for your ride.
            </p>
          </div>

          <div 
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold text-green-500 shadow-sm"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </motion.div>


{/* Coupon Code Section */}
<motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  className="lg:col-span-8 mb-6"
>
  <div 
    className="rounded-2xl border p-6 shadow-sm"
    style={{
      backgroundColor: theme.cardBg,
      borderColor: theme.border
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-green-500" />
        <h2 className="font-bold text-lg" style={{ color: theme.text }}>
          Have a Coupon Code?
        </h2>
      </div>
    </div>

    {!appliedCoupon ? (
      <>
        <div className="flex gap-3">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value.toUpperCase());
              setCouponError('');
            }}
            placeholder="Enter coupon code"
            className="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors uppercase font-mono"
            style={{
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.text
            }}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!promoCode.trim() || loadingCoupon}
            className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {loadingCoupon ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply'
            )}
          </button>
        </div>

        {couponError && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <span>⚠️</span> {couponError}
          </p>
        )}
      </>
    ) : (
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-bold text-green-600">
              Coupon "{summary.promoCode}" applied successfully!
            </p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              You saved ₹{summary.promoDiscount}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemoveCoupon}
          className="text-sm text-red-500 hover:text-red-600 font-bold underline"
        >
          Remove
        </button>
      </div>
    )}
  </div>
</motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Methods + Form */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 space-y-6"
          >
            {/* Tabs */}
            <div 
              className="rounded-2xl border p-2 overflow-x-auto shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <div className="flex gap-2 min-w-max">
                <button 
                  className={tabClass(method === "card")} 
                  onClick={() => setMethod("card")}
                  style={{ color: method === "card" ? '#10b981' : theme.textSecondary }}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit/Debit Card
                </button>
                <button 
                  className={tabClass(method === "upi")} 
                  onClick={() => setMethod("upi")}
                  style={{ color: method === "upi" ? '#10b981' : theme.textSecondary }}
                >
                  <Wallet className="w-4 h-4" />
                  UPI / Wallets
                </button>
                <button 
                  className={tabClass(method === "netbanking")} 
                  onClick={() => setMethod("netbanking")}
                  style={{ color: method === "netbanking" ? '#10b981' : theme.textSecondary }}
                >
                  <Building2 className="w-4 h-4" />
                  Netbanking
                </button>
                <button 
                  className={tabClass(method === "qrcode")} 
                  onClick={() => setMethod("qrcode")}
                  style={{ color: method === "qrcode" ? '#10b981' : theme.textSecondary }}
                >
                  <ScanLine className="w-4 h-4" />
                  Scan QR
                </button>
              </div>
            </div>

            {/* Form */}
            <div 
              className="rounded-2xl border p-6 md:p-8 shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              {method === "card" && (
                <div className="space-y-6">
                  <Field label="Card Number" theme={theme}>
                    <div className="relative">
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                      <CreditCard className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Expiry Date" theme={theme}>
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                    </Field>

                    <Field label="CVV" theme={theme}>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        type="password"
                        className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border,
                          color: theme.text
                        }}
                      />
                    </Field>
                  </div>

                  <Field label="Card Holder Name" theme={theme}>
                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="Enter name as on card"
                      className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />
                  </Field>

                  <label className="flex items-center gap-3 select-none cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={() => setSaveCard((v) => !v)}
                      className="h-5 w-5 rounded border cursor-pointer accent-green-500"
                      style={{ borderColor: theme.border }}
                    />
                    <span className="text-sm" style={{ color: theme.textSecondary }}>
                      Save this card for faster payments securely
                    </span>
                  </label>
                </div>
              )}

              {method === "upi" && (
                <div className="space-y-4">
                  <p className="font-bold text-lg" style={{ color: theme.text }}>UPI / Wallets</p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    Razorpay supports UPI payments. Click Pay button to proceed.
                  </p>
                  <input
                    placeholder="example@upi"
                    className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                  />
                </div>
              )}

              {method === "netbanking" && (
                <div className="space-y-4">
                  <p className="font-bold text-lg" style={{ color: theme.text }}>Netbanking</p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    Razorpay supports netbanking. Click Pay button to proceed.
                  </p>
                  <select 
                    className="w-full rounded-xl border px-4 py-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 appearance-none transition-colors"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {method === "qrcode" && (
                <QRScanner 
                  theme={theme}
                  amount={summary.total}
                  bookingId={summary.carId}
                />
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
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 space-y-6"
          >
            <div 
              className="rounded-2xl border overflow-hidden shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: theme.border }}>
                <p className="font-bold text-lg" style={{ color: theme.text }}>Summary</p>
                <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                  {summary.carName} • {summary.days} days
                </p>
              </div>

              <div className="p-6 space-y-3">
                <Row label="Base Fare" value={`₹${summary.baseFare}`} theme={theme} />
                <Row label="Taxes & Fees" value={`₹${summary.taxesFees}`} theme={theme} />
                <Row label="Security Deposit" value={`₹${summary.deposit}`} hint="(Refundable)" theme={theme} />

                {summary.promoDiscount > 0 && (
                  <Row
                    label={
                      <span className="inline-flex items-center gap-2 text-green-500">
                        <Tag className="w-4 h-4" />
                        Promo ({summary.promoCode})
                      </span>
                    }
                    value={`-₹${summary.promoDiscount}`}
                    valueClass="text-green-500"
                    theme={theme}
                  />
                )}

                <div className="h-px my-3" style={{ backgroundColor: theme.border }} />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                      Total Payable
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary, opacity: 0.6 }}>Incl. all taxes</p>
                  </div>
                  <p className="text-3xl font-black text-green-500">
                    ₹{summary.total}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handlePay}
                  disabled={loading}
                  className={`mt-6 w-full py-4 rounded-xl font-black text-lg inline-flex items-center justify-center gap-2 transition-all ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                    }`}
                >
                  {loading ? 'Processing...' : `Pay ₹${summary.total}`}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </motion.button>

                <p className="text-center text-xs mt-2" style={{ color: theme.textSecondary, opacity: 0.6 }}>
                  By clicking pay, you agree to our Terms & Conditions.
                </p>
              </div>
            </div>

            <InfoCard
              icon={ShieldCheck}
              title="Secure payments"
              subtitle="Powered by Razorpay."
              theme={theme}
            />

            <InfoCard
              icon={Headphones}
              title="Need help?"
              subtitle="Support available 24/7."
              theme={theme}
            />
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

function Field({ label, children, theme }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, hint, valueClass, theme }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div style={{ color: theme.textSecondary }}>
        <span>{label}</span> 
        {hint && <span className="text-xs" style={{ opacity: 0.6 }}>{hint}</span>}
      </div>
      <span className={`font-semibold ${valueClass || ''}`} style={{ color: valueClass ? undefined : theme.text }}>
        {value}
      </span>
    </div>
  );
}

function BadgeMini({ children, theme }) {
  return (
    <div 
      className="h-8 w-14 rounded-lg border flex items-center justify-center font-bold text-xs"
      style={{
        backgroundColor: theme.inputBg,
        borderColor: theme.border,
        color: theme.textSecondary
      }}
    >
      {children}
    </div>
  );
}

function InfoCard({ icon: Icon, title, subtitle, theme }) {
  return (
    <div 
      className="rounded-2xl border p-4 flex items-center gap-3 shadow-sm"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border
      }}
    >
      <div 
        className="w-11 h-11 rounded-xl border flex items-center justify-center"
        style={{
          backgroundColor: theme.inputBg,
          borderColor: theme.border
        }}
      >
        <Icon className="w-6 h-6 text-green-500" />
      </div>
      <div>
        <p className="font-bold" style={{ color: theme.text }}>{title}</p>
        <p className="text-xs" style={{ color: theme.textSecondary }}>{subtitle}</p>
      </div>
    </div>
  );
}

export default Payment;
