import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import {
  CreditCard,
  Wallet,
  Building2,
  Lock,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Tag,
} from "lucide-react";
import { paymentService } from "../services/paymentService";
import { bookingService } from "../services/bookingService";
import { loadRazorpayScript, initRazorpayPayment } from "../utils/razorpay";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const tabClass = (active) =>
  `flex items-center gap-2 px-5 py-4 rounded-xl transition border font-bold text-sm whitespace-nowrap
   ${
     active
       ? "bg-white/10 border-cyan-400/25 text-white shadow-[0_0_20px_rgba(34,211,238,0.10)]"
       : "bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5"
   }`;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Card fields (UI only)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");

  const handlePay = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create booking first
      const bookingData = {
        car: summary.carId,
        startDate: summary.startDate,
        endDate: summary.endDate,
        totalPrice: summary.total,
        discount: summary.promoDiscount,
        promoCode: summary.promoCode,
      };

      const bookingResponse = await bookingService.createBooking(bookingData);
      const bookingId = bookingResponse.data._id;

      // 3. Create Razorpay order
      const orderData = {
        amount: summary.total,
        currency: 'INR',
        bookingId: bookingId,
      };

      const orderResponse = await paymentService.createOrder(orderData);
      const order = orderResponse.data;

      // 4. Configure Razorpay options
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
          color: '#13c8ec',
        },
      };

      // 5. Open Razorpay checkout
      const paymentResponse = await initRazorpayPayment(razorpayOptions);

      // 6. Verify payment
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
    <div className="min-h-screen bg-gradient-to-br from-[#101f22]/80 to-purple-900/40 text-white">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Select Payment Method
            </h1>
            <p className="text-white/60 mt-2 text-sm">
              Choose how you want to pay for your ride.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-cyan-200">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Methods + Form */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 space-y-6"
          >
            {/* Tabs */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                <button className={tabClass(method === "card")} onClick={() => setMethod("card")}>
                  <CreditCard className="w-4 h-4 text-cyan-300" />
                  Credit/Debit Card
                </button>
                <button className={tabClass(method === "upi")} onClick={() => setMethod("upi")}>
                  <Wallet className="w-4 h-4 text-purple-300" />
                  UPI / Wallets
                </button>
                <button className={tabClass(method === "netbanking")} onClick={() => setMethod("netbanking")}>
                  <Building2 className="w-4 h-4 text-white/70" />
                  Netbanking
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              {method === "card" && (
                <div className="space-y-6">
                  <Field label="Card Number">
                    <div className="relative">
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                      />
                      <CreditCard className="w-5 h-5 text-cyan-300 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Expiry Date">
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                      />
                    </Field>

                    <Field label="CVV">
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        type="password"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                      />
                    </Field>
                  </div>

                  <Field label="Card Holder Name">
                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="Enter name as on card"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                    />
                  </Field>

                  <label className="flex items-center gap-3 select-none cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={() => setSaveCard((v) => !v)}
                      className="h-5 w-5 rounded border border-white/20 bg-white/5 checked:bg-cyan-500 checked:border-cyan-500"
                    />
                    <span className="text-sm text-white/70">
                      Save this card for faster payments securely
                    </span>
                  </label>
                </div>
              )}

              {method === "upi" && (
                <div className="space-y-4">
                  <p className="text-white font-black text-lg">UPI / Wallets</p>
                  <p className="text-white/60 text-sm">
                    Razorpay supports UPI payments. Click Pay button to proceed.
                  </p>
                  <input
                    placeholder="example@upi"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                  />
                </div>
              )}

              {method === "netbanking" && (
                <div className="space-y-4">
                  <p className="text-white font-black text-lg">Netbanking</p>
                  <p className="text-white/60 text-sm">
                    Razorpay supports netbanking. Click Pay button to proceed.
                  </p>
                  <select className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Trust row */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                <Lock className="w-4 h-4 text-cyan-300" />
                256-bit SSL Encrypted
              </div>
              <div className="flex gap-2 opacity-70">
                <BadgeMini>VISA</BadgeMini>
                <BadgeMini>MC</BadgeMini>
                <BadgeMini>AMEX</BadgeMini>
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
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <p className="text-white font-black text-lg">Summary</p>
                <p className="text-white/60 text-sm mt-1">
                  {summary.carName} • {summary.days} days
                </p>
              </div>

              <div className="p-6 space-y-3">
                <Row label="Base Fare" value={`₹${summary.baseFare}`} />
                <Row label="Taxes & Fees" value={`₹${summary.taxesFees}`} />
                <Row label="Security Deposit" value={`₹${summary.deposit}`} hint="(Refundable)" />

                {summary.promoDiscount > 0 && (
                  <Row
                    label={
                      <span className="inline-flex items-center gap-2 text-cyan-200">
                        <Tag className="w-4 h-4" />
                        Promo ({summary.promoCode})
                      </span>
                    }
                    value={`-₹${summary.promoDiscount}`}
                    valueClass="text-cyan-200"
                  />
                )}

                <div className="h-px bg-white/10 my-3" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/60 font-bold uppercase tracking-wider">
                      Total Payable
                    </p>
                    <p className="text-xs text-white/40">Incl. all taxes</p>
                  </div>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    ₹{summary.total}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    scale: loading ? 1 : 1.03,
                    boxShadow: loading ? "none" : "0 0 26px rgba(34,211,238,0.25), 0 0 22px rgba(168,85,247,0.18)",
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handlePay}
                  disabled={loading}
                  className={`mt-6 w-full py-4 rounded-xl font-black text-lg inline-flex items-center justify-center gap-2 transition-all ${
                    loading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-cyan-500 text-slate-950 hover:brightness-110'
                  }`}
                >
                  {loading ? 'Processing...' : `Pay ₹${summary.total}`}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </motion.button>

                <p className="text-center text-xs text-white/40 mt-2">
                  By clicking pay, you agree to our Terms & Conditions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <p className="text-white font-black">Secure payments</p>
                <p className="text-white/60 text-xs">Powered by Razorpay.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <p className="text-white font-black">Need help?</p>
                <p className="text-white/60 text-xs">Support available 24/7.</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, hint, valueClass = "text-white" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-white/70">
        <span>{label}</span> {hint && <span className="text-white/40 text-xs">{hint}</span>}
      </div>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function BadgeMini({ children }) {
  return (
    <div className="h-8 w-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white/80">
      {children}
    </div>
  );
}

export default Payment;
