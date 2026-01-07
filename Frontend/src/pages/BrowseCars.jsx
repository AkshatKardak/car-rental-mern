import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

import SupraImg from "../assets/supra.png";
import PorscheImg from "../assets/porsche.png";
import MercedesImg from "../assets/mercedes g63 amg.png";
import Skoda from "../assets/Skoda.png"
import Audi from "../assets/AudiElectric.png"
import Kia from "../assets/Kia.png"
// Animations
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const hoverGlow = {
  whileHover: {
    y: -6,
    scale: 1.02,
    boxShadow:
      "0 22px 55px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.18), 0 0 40px rgba(168,85,247,0.22)",
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
  whileTap: { scale: 0.98 },
};

const BrowseCars = () => {
  const navigate = useNavigate();

  // Demo data (replace with API later)
  const cars = [
    {
      id: "porsche",
      name: "Porsche 911 Carrera",
      meta: "2023 • Automatic • Petrol",
      pricePerDay: 1499,
      tag: "PREMIUM",
      type: "Sports",
      transmission: "Auto",
      seats: 2,
      rating: 5.0,
      image: PorscheImg,
    },
    {
      id: "mercedes-g63",
      name: "Mercedes G63 AMG",
      meta: "2023 • Luxury SUV",
      pricePerDay: 1999,
      tag: "EXCLUSIVE",
      type: "Luxury",
      transmission: "Auto",
      seats: 5,
      rating: 4.8,
      image: MercedesImg,
    },
    {
      id: "supra",
      name: "Toyota Supra (Blue)",
      meta: "2022 • Sports • 2 seats",
      pricePerDay: 899,
      tag: "SPORTS",
      type: "Sports",
      transmission: "Manual",
      seats: 2,
      rating: 4.7,
      image: SupraImg,
    },
   {
        id: "skoda-kylaq",
        name: "Skoda Kylaq",
        meta: "2024 • Manual • Petrol",
        pricePerDay: 249,
        tag: "PREMIUM",
        type: "SUV",
        transmission: "Manual",
        seats: 5,
        rating: 4.6,
        image: Skoda,
    },
    {
  id: "audi-e-tron",
  name: "Audi e-tron Sportback",
  meta: "2024 • Auto • Electric",
  pricePerDay: 579,
  tag: "PREMIUM",
  type: "Electric",
  transmission: "Auto",
  seats: 5,
  rating: 4.8,
  image: Audi,
},
     {
  id: "kia-seltos",
  name: "Kia Seltos",
  meta: "2024 • Auto • Petrol",
  pricePerDay: 679,
  tag: "PREMIUM",
  type: "SUV",
  transmission: "Auto",
  seats: 7,
  rating: 4.7,
  image: Kia,
},
  ];

  // Filters state
  const [priceMin, setPriceMin] = useState(50);
  const [priceMax, setPriceMax] = useState(1500);

  const [types, setTypes] = useState({
    Sports: false,
    Luxury: true,
    SUV: false,
    Electric: false,
  });

  const [transmission, setTransmission] = useState("Auto");
  const [seats, setSeats] = useState("All"); 
  const [ratingUp, setRatingUp] = useState(true);
  const minRating = 4.5;

  const anyTypeSelected = useMemo(() => Object.values(types).some(Boolean), [types]);

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      if (c.pricePerDay < priceMin || c.pricePerDay > priceMax) return false;

      if (anyTypeSelected && !types[c.type]) return false;

      if (transmission !== "All" && c.transmission !== transmission) return false;

      if (seats !== "All") {
        if (seats === "7+") {
          if (c.seats < 7) return false;
        } else {
          if (c.seats !== Number(seats)) return false;
        }
      }

      if (ratingUp && c.rating < minRating) return false;

      return true;
    });
  }, [cars, priceMin, priceMax, anyTypeSelected, types, transmission, seats, ratingUp]);

  const resetAll = () => {
    setPriceMin(50);
    setPriceMax(1500);
    setTypes({ Sports: false, Luxury: true, SUV: false, Electric: false });
    setTransmission("Auto");
    setSeats("All");
    setRatingUp(true);
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
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-cyan-400">
            Browse Cars
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            Use filters on the left to find the best car.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="flex gap-6">
          {/* Filters (left) */}
          <motion.aside variants={fadeUp} className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 rounded-2xl rr-glass p-6">
              <div className="flex items-center justify-between pb-4 border-b rr-divider">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300">≡</span>
                  <h3 className="text-lg font-black text-white">Filters</h3>
                </div>
                <button
                  onClick={resetAll}
                  className="text-xs font-semibold text-white/60 hover:text-white transition"
                >
                  Reset All
                </button>
              </div>

              {/* Price / Day */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white/90">Price / Day</p>
                  <span className="text-xs font-bold text-cyan-200 bg-cyan-500/10 border border-cyan-400/20 px-2 py-1 rounded-lg">
                    ₹{priceMin} - ₹{priceMax}+
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                    className="rr-range"
                  />
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                    className="rr-range"
                  />
                </div>
              </div>

              {/* Car Type */}
              <div className="mt-7">
                <p className="text-sm font-semibold text-white/90 mb-3">Car Type</p>

                {Object.keys(types).map((t) => (
                  <label key={t} className="flex items-center gap-3 py-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={types[t]}
                      onChange={() => setTypes((prev) => ({ ...prev, [t]: !prev[t] }))}
                      className="rr-check"
                    />
                    <span className="text-sm text-white/70 hover:text-white transition">
                      {t}
                    </span>
                  </label>
                ))}
              </div>

              {/* Transmission */}
              <div className="mt-7">
                <p className="text-sm font-semibold text-white/90 mb-3">Transmission</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTransmission("Auto")}
                    className={`py-2 rounded-xl border transition font-bold text-sm
                      ${
                        transmission === "Auto"
                          ? "bg-cyan-500/15 border-cyan-400/25 text-cyan-200"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    Auto
                  </button>

                  <button
                    onClick={() => setTransmission("Manual")}
                    className={`py-2 rounded-xl border transition font-bold text-sm
                      ${
                        transmission === "Manual"
                          ? "bg-cyan-500/15 border-cyan-400/25 text-cyan-200"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    Manual
                  </button>
                </div>

                <button
                  onClick={() => setTransmission("All")}
                  className="mt-3 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition font-semibold text-sm"
                >
                  Show All
                </button>
              </div>

              {/* Seats */}
              <div className="mt-7">
                <p className="text-sm font-semibold text-white/90 mb-3">Seats</p>

                <div className="flex gap-2">
                  {["2", "4", "5", "7+"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeats(s)}
                      className={`h-9 w-9 rounded-xl border font-bold text-sm transition
                        ${
                          seats === s
                            ? "bg-cyan-500/15 border-cyan-400/25 text-cyan-200"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSeats("All")}
                  className="mt-3 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition font-semibold text-sm"
                >
                  Any seats
                </button>
              </div>

              {/* Rating */}
              <div className="mt-7">
                <p className="text-sm font-semibold text-white/90 mb-3">Rating</p>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ratingUp}
                    onChange={() => setRatingUp((v) => !v)}
                    className="rr-check"
                  />
                  <span className="text-yellow-400 text-sm font-black">★★★★★</span>
                  <span className="text-xs text-white/60">&amp; Up</span>
                </label>

                <p className="text-xs text-white/50 mt-2">(Applies {minRating}+ rating)</p>
              </div>
            </div>
          </motion.aside>

          {/* Cars grid (right) */}
          <motion.section variants={fadeUp} className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/70 text-sm">
                Showing <span className="text-white font-black">{filteredCars.length}</span> results
              </p>
                  
              <button
                onClick={resetAll}
                className="lg:hidden px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition text-sm font-semibold"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  {...hoverGlow}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-cyan-400/25 transition h-[380px] flex flex-col"
                >
                  {/* image */}
                  <div className="relative h-[210px] overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover opacity-95 transition duration-500 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/15 border border-white/10">
                      {car.tag}
                    </span>
                  </div>

                  {/* body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-xs text-white/70 mt-1">{car.meta}</p>
                      <p className="text-xs text-cyan-200/90 mt-2">
                        {car.type} • {car.transmission} • {car.seats} seats • ⭐ {car.rating.toFixed(1)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <p className="text-cyan-200 font-black text-lg">
                        ₹{car.pricePerDay}
                        <span className="text-white/60 text-xs font-semibold">/day</span>
                      </p>

                      <motion.button
                        whileHover={{
                          scale: 1.06,
                          boxShadow:
                            "0 0 28px rgba(34,211,238,0.28), 0 0 26px rgba(168,85,247,0.20)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        onClick={() => navigate(`/car/${car.id}`)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:brightness-110 transition"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white/70">
                No cars match these filters. Try changing Car Type / Price / Transmission.
              </div>
            )}
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
};

export default BrowseCars;
