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
   ${active
    ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
    : "bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-background-secondary"
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
        carId: summary.carId,
        startDate: summary.startDate,
        endDate: summary.endDate,
        totalPrice: summary.total,
        discount: summary.promoDiscount,
        promotionCode: summary.promoCode,
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
          color: '#10A310',
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
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
              Select Payment Method
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              Choose how you want to pay for your ride.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-border-light text-xs font-bold text-primary shadow-sm">
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
            <div className="rounded-2xl border border-border-light bg-white p-2 overflow-x-auto shadow-sm">
              <div className="flex gap-2 min-w-max">
                <button className={tabClass(method === "card")} onClick={() => setMethod("card")}>
                  <CreditCard className="w-4 h-4" />
                  Credit/Debit Card
                </button>
                <button className={tabClass(method === "upi")} onClick={() => setMethod("upi")}>
                  <Wallet className="w-4 h-4" />
                  UPI / Wallets
                </button>
                <button className={tabClass(method === "netbanking")} onClick={() => setMethod("netbanking")}>
                  <Building2 className="w-4 h-4" />
                  Netbanking
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border-light bg-white p-6 md:p-8 shadow-sm">
              {method === "card" && (
                <div className="space-y-6">
                  <Field label="Card Number">
                    <div className="relative">
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                      <CreditCard className="w-5 h-5 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Expiry Date">
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </Field>

                    <Field label="CVV">
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        type="password"
                        className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </Field>
                  </div>

                  <Field label="Card Holder Name">
                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="Enter name as on card"
                      className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </Field>

                  <label className="flex items-center gap-3 select-none cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={() => setSaveCard((v) => !v)}
                      className="h-5 w-5 rounded border border-border-light bg-background-secondary checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                    />
                    <span className="text-sm text-text-secondary">
                      Save this card for faster payments securely
                    </span>
                  </label>
                </div>
              )}

              {method === "upi" && (
                <div className="space-y-4">
                  <p className="text-text-primary font-bold text-lg">UPI / Wallets</p>
                  <p className="text-text-secondary text-sm">
                    Razorpay supports UPI payments. Click Pay button to proceed.
                  </p>
                  <input
                    placeholder="example@upi"
                    className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              )}

              {method === "netbanking" && (
                <div className="space-y-4">
                  <p className="text-text-primary font-bold text-lg">Netbanking</p>
                  <p className="text-text-secondary text-sm">
                    Razorpay supports netbanking. Click Pay button to proceed.
                  </p>
                  <select className="w-full rounded-xl bg-background-secondary border border-border-light px-4 py-4 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Trust row */}
            <div className="rounded-2xl border border-border-light bg-white p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
                <Lock className="w-4 h-4 text-primary" />
                256-bit SSL Encrypted
              </div>
              <div className="flex gap-2">
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
            <div className="rounded-2xl border border-border-light bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border-light">
                <p className="text-text-primary font-bold text-lg">Summary</p>
                <p className="text-text-secondary text-sm mt-1">
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
                      <span className="inline-flex items-center gap-2 text-primary">
                        <Tag className="w-4 h-4" />
                        Promo ({summary.promoCode})
                      </span>
                    }
                    value={`-₹${summary.promoDiscount}`}
                    valueClass="text-primary"
                  />
                )}

                <div className="h-px bg-border-light my-3" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                      Total Payable
                    </p>
                    <p className="text-xs text-text-secondary/60">Incl. all taxes</p>
                  </div>
                  <p className="text-3xl font-black text-primary">
                    ₹{summary.total}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    scale: loading ? 1 : 1.02,
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handlePay}
                  disabled={loading}
                  className={`mt-6 w-full py-4 rounded-xl font-black text-lg inline-flex items-center justify-center gap-2 transition-all ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover shadow-md'
                    }`}
                >
                  {loading ? 'Processing...' : `Pay ₹${summary.total}`}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </motion.button>

                <p className="text-center text-xs text-text-secondary/60 mt-2">
                  By clicking pay, you agree to our Terms & Conditions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-light bg-white p-4 flex items-center gap-3 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-background-secondary border border-border-light flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-text-primary font-bold">Secure payments</p>
                <p className="text-text-secondary text-xs">Powered by Razorpay.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-light bg-white p-4 flex items-center gap-3 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-background-secondary border border-border-light flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-text-primary font-bold">Need help?</p>
                <p className="text-text-secondary text-xs">Support available 24/7.</p>
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
      <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, hint, valueClass = "text-text-primary" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-text-secondary">
        <span>{label}</span> {hint && <span className="text-text-secondary/60 text-xs">{hint}</span>}
      </div>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function BadgeMini({ children }) {
  return (
    <div className="h-8 w-14 rounded-lg bg-background-secondary border border-border-light flex items-center justify-center font-bold text-xs text-text-secondary">
      {children}
    </div>
  );
}

export default Payment;
