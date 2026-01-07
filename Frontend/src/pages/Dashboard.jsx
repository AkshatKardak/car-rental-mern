import SupraImg from "../assets/supra.png";
import Porsche from "../assets/porsche.png";
import Mercedes from "../assets/mercedes g63 amg.png";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CalendarDays,
  Sparkles,
  CreditCard,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";


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

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const firstName = useMemo(() => {
    const name = user?.name || "User";
    return name.split(" ")[0];
  }, [user]);

  const quickActions = [
    {
      title: "Browse Cars",
      icon: Search,
      onClick: () => navigate("/browse-cars"),
      accent: "from-cyan-400/25 to-cyan-400/0",
      iconBg: "bg-cyan-500/15 border-cyan-400/20",
      iconColor: "text-cyan-300",
    },
    {
      title: "My Bookings",
      icon: CalendarDays,
      onClick: () => navigate("/my-bookings"),
      accent: "from-sky-400/25 to-sky-400/0",
      iconBg: "bg-sky-500/15 border-sky-400/20",
      iconColor: "text-sky-300",
    },
    {
      title: "AI Assistant",
      icon: Sparkles,
      onClick: () => navigate("/ai-assistant"),
      accent: "from-purple-400/25 to-purple-400/0",
      iconBg: "bg-purple-500/15 border-purple-400/20",
      iconColor: "text-purple-300",
    },
    {
      title: "Payments",
      icon: CreditCard,
      onClick: () => navigate("/payment"),
      accent: "from-emerald-400/25 to-emerald-400/0",
      iconBg: "bg-emerald-500/15 border-emerald-400/20",
      iconColor: "text-emerald-300",
    },
  ];

  const recommended = [
    {
      id: "porsche",
      name: "Porsche 911 Carrera",
      meta: "2023 • Automatic • Petrol",
      price: "₹249/day",
      tag: "PREMIUM",
      image: Porsche,
      big: true,
    },
    {
      id: "mercedes-g63",
      name: "Mercedes G63 AMG",
      meta: "Luxury SUV • 5 seats",
      price: "₹999/day",
      tag: "EXCLUSIVE",
      image: Mercedes,
      big: false,
    },
    {
      id: "supra",
      name: "Toyota Supra (Blue)",
      meta: "2022 • Sports • 2 seats",
      price: "₹199/day",
      tag: "SPORTS",
      image: SupraImg,
      big: false,
    },
  ];

  const activity = [
    { title: "Booking Confirmed", desc: "Toyota Supra • Today, 9:41 PM", dot: "bg-emerald-400" },
    { title: "Payment Successful", desc: "Invoice # 4920 • Yesterday", dot: "bg-cyan-400" },
    { title: "Trip Completed", desc: "BMW M4 • Oct 12", dot: "bg-purple-400" },
    { title: "New Login", desc: "Web interface • Oct 10", dot: "bg-slate-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101f22]/80 to-purple-900/40 text-white">
      <DashboardNavbar />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <p className="text-white text-sm">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-cyan-400">
              {firstName}'s Dashboard
            </h1>
          </div>

          <motion.button
            {...hoverGlow}
            onClick={() => navigate("/browse-cars")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/25 transition font-semibold text-cyan-400"
          >
            View all cars <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <motion.section variants={fadeUp} className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <span className="text-lg">⚡</span>
            <h2 className="font-bold">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <motion.button
                  key={a.title}
                  {...hoverGlow}
                  onClick={a.onClick}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white/10 hover:border-cyan-400 transition p-5 text-left h-[140px] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 w-fit border ${a.iconBg}`}>
                      <Icon className={`w-6 h-6 ${a.iconColor}`} />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition text-purple-700 text-sm">
                      →
                    </span>
                  </div>

                  <div>
  <p className="mt-3 font-semibold text-indigo-700">{a.title}</p>
</div>

                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Recommended + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommended */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white/90">Recommended for You</h2>
              <button
                onClick={() => navigate("/browse-cars")}
                className="text-sm text-cyan-300 hover:text-white transition font-semibold"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Big card */}
              <motion.div
                {...hoverGlow}
                className="group md:col-span-2 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl relative h-[280px] hover:border-cyan-400"
              >
                <div className="absolute inset-0">
                  <img
                    src={recommended[0].image}
                    alt={recommended[0].name}
                    className="w-full h-full object-cover opacity-90 transition duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="relative p-6 h-full flex flex-col justify-end">
                  <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-lg bg-white/15 border border-white/10">
                    {recommended[0].tag}
                  </span>

                  <p className="text-xl font-black text-white">{recommended[0].name}</p>
                  <p className="text-sm text-white/75 mt-1">{recommended[0].meta}</p>

                  <div className="flex items-center justify-between mt-5">
                    <p className="text-cyan-200 font-black">
                      {recommended[0].price}{" "}
                    </p>
                    <motion.button
                      whileHover={{
                        scale: 1.06,
                        boxShadow: "0 0 28px rgba(34,211,238,0.28), 0 0 26px rgba(168,85,247,0.20)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      onClick={() => navigate(`/car/${recommended[0].id}`)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:brightness-110 transition"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Small cards */}
              {recommended.slice(1).map((c) => (
                <motion.div
                  key={c.id}
                  {...hoverGlow}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl h-[280px] flex flex-col hover:border-purple-400"
                >
                  <div className="relative h-[150px] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover opacity-90 transition duration-500 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/15 border border-white/10">
                      {c.tag}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-black text-white">{c.name}</p>
                      <p className="text-xs text-white/75 mt-1">{c.meta}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-cyan-200 font-black">
                        {c.price}{" "}
                      </p>
                      <motion.button
                        whileHover={{
                          scale: 1.06,
                          boxShadow: "0 0 22px rgba(34,211,238,0.22), 0 0 20px rgba(168,85,247,0.18)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        onClick={() => navigate(`/car/${c.id}`)}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-cyan-400 text-cyan-300 font-bold hover:bg-white/10 transition-colors-15 text-xs"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-fit hover:border-cyan-400/20 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white/90">Recent Activity</h2>
              <Clock className="w-5 h-5 text-white/60" />
            </div>

            <div className="space-y-4">
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.06 * i }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-1 w-3 h-3 rounded-full ${a.dot}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{a.title}</p>
                    <p className="text-xs text-white/65">{a.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              {...hoverGlow}
              onClick={() => navigate("/my-bookings")}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/25 transition font-bold text-sm text-white"
            >
              VIEW FULL HISTORY
            </motion.button>
          </motion.div>
        </section>
      </motion.main>

      {/* Floating AI button */}
      <motion.button
        whileHover={{
          scale: 1.08,
          y: -2,
          boxShadow: "0 0 35px rgba(34,211,238,0.28), 0 0 35px rgba(168,85,247,0.22)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        onClick={() => navigate("/ai-assistant")}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-2xl shadow-cyan-500/20 border border-white/15 flex items-center justify-center"
        aria-label="AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default Dashboard;
