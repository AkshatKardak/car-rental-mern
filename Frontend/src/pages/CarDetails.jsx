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
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "0-100", value: "3.4s" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "2" },
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "0-100", value: "4.5s" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "5" },
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "0-100", value: "4.1s" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Manual" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "2" },
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "Mileage", value: "Good" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Manual" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "5" },
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "Charge", value: "Fast" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Electric" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "5" },
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
          { icon: <Gauge className="w-5 h-5 text-primary" />, label: "Comfort", value: "High" },
          { icon: <Settings className="w-5 h-5 text-primary" />, label: "Transmission", value: "Auto" },
          { icon: <Fuel className="w-5 h-5 text-primary" />, label: "Fuel", value: "Petrol" },
          { icon: <Users className="w-5 h-5 text-primary" />, label: "Seats", value: "7" },
        ],
        features: ["Touch infotainment", "Comfort seats", "Family ready", "Reliable city drive"],
      },
    }),
    []
  );

  const car = carMap[id];

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/browse-cars")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border-light text-text-primary font-bold hover:bg-background-secondary transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-right">
            <p className="text-text-secondary text-sm">Car Details</p>
            <p className="text-primary font-black">{id}</p>
          </div>
        </div>

        {!car ? (
          <div className="rounded-2xl border border-border-light bg-white p-8 shadow-sm">
            <p className="text-text-primary font-black text-2xl">Car not found</p>
            <p className="text-text-secondary mt-2">
              No details available for this id: <span className="text-primary font-bold">{id}</span>
            </p>
            <button
              onClick={() => navigate("/browse-cars")}
              className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition"
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
              className="lg:col-span-8 rounded-2xl overflow-hidden border border-border-light bg-white shadow-sm"
            >
              <div className="relative h-[320px] overflow-hidden bg-background-secondary">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-white/90 text-text-primary border border-border-light shadow-sm backdrop-blur">
                  {car.tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
                      {car.name}
                    </h1>
                    <p className="text-text-secondary mt-2">{car.metaTop}</p>

                    <div className="flex items-center gap-2 mt-3 text-text-secondary text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-text-primary">{car.rating.toFixed(1)}</span>
                      <span className="text-text-secondary/40">•</span>
                      <span className="text-text-secondary font-semibold">
                        {car.type} • {car.transmission} • {car.seats} seats
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-text-secondary text-sm">Price</p>
                    <p className="text-primary font-black text-3xl">
                      ₹{car.pricePerDay}
                      <span className="text-text-secondary text-sm font-semibold">/day</span>
                    </p>
                  </div>
                </div>

                <p className="text-text-secondary mt-5 leading-relaxed">{car.desc}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/payment")}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition"
                  >
                    Proceed to Payment
                  </button>

                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="px-6 py-3 rounded-xl bg-white border border-border-light text-text-primary font-bold hover:bg-background-secondary transition"
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
              <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm">
                <p className="text-text-primary font-black text-lg">Quick Specs</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {car.specs.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border-light bg-background-secondary p-4">
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-semibold">
                        {s.icon}
                        {s.label}
                      </div>
                      <p className="text-text-primary mt-2 font-black">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-border-light bg-background-secondary p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-text-primary font-bold text-sm">Free cancellation</p>
                    <p className="text-text-secondary text-xs mt-1">
                      Cancel up to 48 hours before pickup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm">
                <p className="text-text-primary font-black text-lg">Features</p>
                <ul className="mt-4 space-y-2 text-text-secondary text-sm">
                  {car.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  {...hoverGlow}
                  onClick={() => navigate("/payment")}
                  className="mt-6 w-full py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-hover transition shadow-sm"
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
