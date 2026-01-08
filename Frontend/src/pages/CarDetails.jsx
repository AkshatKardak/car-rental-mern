import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { ArrowLeft, Star, Users, Fuel, Gauge, Settings, Shield } from "lucide-react";

import SupraImg from "../assets/supra.png";
import PorscheImg from "../assets/porsche.png";
import MercedesImg from "../assets/mercedes g63 amg.png";
import Skoda from "../assets/Skoda.png";
import Audi from "../assets/AudiElectric.png";
import Kia from "../assets/Kia.png";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const hoverGlow = {
  whileHover: {
    y: -4,
    scale: 1.01,
    boxShadow:
      "0 22px 55px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.18), 0 0 40px rgba(168,85,247,0.22)",
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
  whileTap: { scale: 0.99 },
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // MUST match ids from BrowseCars.jsx
  const carMap = useMemo(
    () => ({
      porsche: {
        id: "porsche",
        tag: "PREMIUM",
        name: "Porsche 911 Carrera",
        metaTop: "2023 Model • AWD • Automatic",
        year: 2023,
        type: "Sports",
        transmission: "Auto",
        fuel: "Petrol",
        seats: 2,
        rating: 5.0,
        pricePerDay: 1499,
        image: PorscheImg,
        desc:
          "Premium sports coupe with high comfort and performance—perfect for city + highway drives.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-cyan-300" />, label: "0-100", value: "3.4s" },
          { icon: <Settings className="w-5 h-5 text-cyan-300" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-cyan-300" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-cyan-300" />, label: "Seats", value: "2" },
        ],
        features: ["Sport mode", "Premium interior", "Advanced safety", "Smooth handling"],
      },

      "mercedes-g63": {
        id: "mercedes-g63",
        tag: "EXCLUSIVE",
        name: "Mercedes G63 AMG",
        metaTop: "2023 Model • Luxury SUV • Automatic",
        year: 2023,
        type: "Luxury",
        transmission: "Auto",
        fuel: "Petrol (V8)",
        seats: 5,
        rating: 4.8,
        pricePerDay: 1999,
        image: MercedesImg,
        desc:
          "Iconic luxury SUV with strong road presence, premium comfort, and powerful performance.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-purple-300" />, label: "0-100", value: "4.5s" },
          { icon: <Settings className="w-5 h-5 text-purple-300" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-purple-300" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-purple-300" />, label: "Seats", value: "5" },
        ],
        features: ["Luxury cabin", "Powerful engine", "Premium audio", "Comfort suspension"],
      },

      supra: {
        id: "supra",
        tag: "SPORTS",
        name: "Toyota Supra (Blue)",
        metaTop: "2022 Model • RWD • Manual",
        year: 2022,
        type: "Sports",
        transmission: "Manual",
        fuel: "Petrol",
        seats: 2,
        rating: 4.7,
        pricePerDay: 899,
        image: SupraImg,
        desc:
          "A sporty performance coupe built for fun—sharp handling and an exciting drive experience.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-cyan-300" />, label: "0-100", value: "4.1s" },
          { icon: <Settings className="w-5 h-5 text-cyan-300" />, label: "Transmission", value: "Manual" },
          { icon: <Fuel className="w-5 h-5 text-cyan-300" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-cyan-300" />, label: "Seats", value: "2" },
        ],
        features: ["Driver cockpit", "Sport handling", "Performance brakes", "Weekend ready"],
      },

      "skoda-kylaq": {
        id: "skoda-kylaq",
        tag: "PREMIUM",
        name: "Skoda Kylaq",
        metaTop: "2024 Model • Manual • Petrol",
        year: 2024,
        type: "SUV",
        transmission: "Manual",
        fuel: "Petrol",
        seats: 5,
        rating: 4.6,
        pricePerDay: 249,
        image: Skoda,
        desc: "Comfortable compact SUV for city rides and weekend trips.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-cyan-300" />, label: "Mileage", value: "Good" },
          { icon: <Settings className="w-5 h-5 text-cyan-300" />, label: "Transmission", value: "Manual" },
          { icon: <Fuel className="w-5 h-5 text-cyan-300" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-cyan-300" />, label: "Seats", value: "5" },
        ],
        features: ["Spacious cabin", "Smooth ride", "City friendly", "Safety features"],
      },

      "audi-e-tron": {
        id: "audi-e-tron",
        tag: "PREMIUM",
        name: "Audi e-tron Sportback",
        metaTop: "2024 Model • AWD • Automatic",
        year: 2024,
        type: "Electric",
        transmission: "Auto",
        fuel: "Electric",
        seats: 5,
        rating: 4.8,
        pricePerDay: 579,
        image: Audi,
        desc: "Premium electric SUV with silent performance and modern tech.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-cyan-300" />, label: "Charge", value: "Fast" },
          { icon: <Settings className="w-5 h-5 text-cyan-300" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-cyan-300" />, label: "Fuel", value: "Electric" },
          { icon: <Users className="w-5 h-5 text-cyan-300" />, label: "Seats", value: "5" },
        ],
        features: ["Fast charging", "ADAS safety", "Premium interior", "Smooth acceleration"],
      },

      "kia-seltos": {
        id: "kia-seltos",
        tag: "PREMIUM",
        name: "Kia Seltos",
        metaTop: "2024 Model • SUV • Automatic",
        year: 2024,
        type: "SUV",
        transmission: "Auto",
        fuel: "Petrol",
        seats: 7,
        rating: 4.7,
        pricePerDay: 679,
        image: Kia,
        desc: "Stylish SUV with great comfort and features for daily use.",
        specs: [
          { icon: <Gauge className="w-5 h-5 text-purple-300" />, label: "Comfort", value: "High" },
          { icon: <Settings className="w-5 h-5 text-purple-300" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-purple-300" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-purple-300" />, label: "Seats", value: "7" },
        ],
        features: ["Touch infotainment", "Comfort seats", "Family ready", "Reliable city drive"],
      },
    }),
    []
  );

  const car = carMap[id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101f22]/80 to-purple-900/40 text-white">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/browse-cars")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-right">
            <p className="text-white/60 text-sm">Car Details</p>
            <p className="text-white font-black">{id}</p>
          </div>
        </motion.div>

        {!car ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <p className="text-white font-black text-2xl">Car not found</p>
            <p className="text-white/60 mt-2">
              No details available for this id: <span className="text-cyan-200 font-bold">{id}</span>
            </p>
            <button
              onClick={() => navigate("/browse-cars")}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Image + Overview */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative h-[320px] overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-4 right-4 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-black/55 text-white border border-white/10 backdrop-blur">
                  {car.tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                      {car.name}
                    </h1>
                    <p className="text-white/70 mt-2">{car.metaTop}</p>

                    <div className="flex items-center gap-2 mt-3 text-white/70 text-sm">
                      <Star className="w-4 h-4 text-amber-300" />
                      <span className="font-bold text-white">{car.rating.toFixed(1)}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-cyan-200/90 font-semibold">
                        {car.type} • {car.transmission} • {car.seats} seats
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white/60 text-sm">Price</p>
                    <p className="text-cyan-200 font-black text-3xl">
                      ₹{car.pricePerDay}
                      <span className="text-white/60 text-sm font-semibold">/day</span>
                    </p>
                  </div>
                </div>

                <p className="text-white/70 mt-5 leading-relaxed">{car.desc}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/payment")}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black hover:brightness-110 transition"
                  >
                    Proceed to Payment
                  </button>

                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
                  >
                    My Bookings
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right: Booking card */}
            <motion.aside
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="lg:col-span-4 space-y-6"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <p className="text-white font-black text-lg">Quick Specs</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {car.specs.map((s) => (
                    <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                        {s.icon}
                        {s.label}
                      </div>
                      <p className="text-white mt-2 font-black">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-300 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-sm">Free cancellation</p>
                    <p className="text-white/60 text-xs mt-1">
                      Cancel up to 48 hours before pickup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <p className="text-white font-black text-lg">Features</p>
                <ul className="mt-4 space-y-2 text-white/75 text-sm">
                  {car.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-300" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  {...hoverGlow}
                  onClick={() => navigate("/payment")}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarDetails;
