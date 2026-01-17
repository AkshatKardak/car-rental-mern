import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  CreditCard,
  Sparkles,
  Bell,
  Settings,
  Plus,
} from "lucide-react";

import Logo from "../assets/logo.png";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import SupraImg from "../assets/supra.png";
import PorscheImg from "../assets/porsche.png";
import MercedesImg from "../assets/mercedes g63 amg.png";

/* =========================
   DATA
========================= */

const RECOMMENDED_CARS = [
  {
    name: "Porsche 911 Carrera",
    price: "$249",
    tag: "PREMIUM",
    image: PorscheImg,
    specs: "2023 • Automatic • Petrol",
  },
  {
    name: "Toyota Supra",
    price: "$185",
    tag: "SPORTS",
    image: SupraImg,
    specs: "2023 • Automatic • Petrol",
  },
  {
    name: "Mercedes G63 AMG",
    price: "$320",
    tag: "LUXURY",
    image: MercedesImg,
    specs: "2024 • Automatic • SUV",
  },
];

/* =========================
   MAIN COMPONENT
========================= */

const AppDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgStart via-bgMid to-bgEnd text-white">

      {/* NAVBAR — CLEAN, NO LINE */}
      <DashboardNavbar />

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* WELCOME */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="text-accentCyan">Alex</span>.
            </h1>
            <p className="text-gray-400 mt-1">
              Ready for your next drive? Your premium garage awaits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/browsecars")}
            className="hidden md:flex items-center gap-2 bg-accentPurple/40 px-4 py-2 rounded-lg hover:bg-accentPurple/50 transition"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Active Booking" value="Tesla Model S" sub="Ends in 2 days" />
          <StatCard title="Upcoming Trips" value="2" sub="Next: Miami, Oct 24" />
          <StatCard title="Ride Credit" value="$150.00" sub="+$50 bonus applied" />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2 className="text-lg font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon={<Car />} label="Browse Cars" onClick={() => navigate("/browsecars")} />
            <QuickAction icon={<Calendar />} label="My Bookings" onClick={() => navigate("/mybookings")} />
            <QuickAction icon={<Sparkles />} label="AI Assistant" onClick={() => navigate("/aiassistant")} />
            <QuickAction icon={<CreditCard />} label="Payments" onClick={() => navigate("/payment")} />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* RECOMMENDED */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Recommended for You</h2>
              <span
                onClick={() => navigate("/browsecars")}
                className="text-accentCyan text-sm cursor-pointer"
              >
                View All →
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {RECOMMENDED_CARS.slice(0, 2).map((car) => (
                <CarCard key={car.name} {...car} />
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY — RESTORED */}
          <div className="bg-glass backdrop-blur-xl rounded-xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
            <h2 className="font-semibold mb-6">Recent Activity</h2>

            <ActivityItem title="Booking Confirmed" sub="Tesla Model S • Today, 9:41 AM" dot="bg-green-400" />
            <ActivityItem title="Payment Successful" sub="Invoice #4920 • Yesterday" dot="bg-accentCyan" />
            <ActivityItem title="Trip Completed" sub="BMW M4 • Oct 12" dot="bg-gray-400" />
            <ActivityItem title="New Login" sub="Web Interface • Oct 10" dot="bg-gray-400" />

            <button className="w-full mt-6 py-2 text-sm text-accentCyan rounded-lg hover:bg-accentCyan/10 transition">
              View Full History
            </button>
          </div>
        </div>
      </main>

      {/* FLOATING AI BUTTON — RESTORED */}
      <button
        type="button"
        onClick={() => navigate("/aiassistant")}
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-tr from-accentPurple to-accentCyan
          flex items-center justify-center
          shadow-[0_0_30px_rgba(168,85,247,0.6)]
          hover:scale-110 transition-transform
        "
      >
        <Sparkles />
      </button>
    </div>
  );
};

/* =========================
   SUB COMPONENTS
========================= */

const NavItem = ({ label, active, onClick }) => (
  <span
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full cursor-pointer transition ${active
      ? "bg-accentPurple/40 text-white"
      : "bg-accentPurple/20 text-gray-300 hover:bg-accentPurple/35 hover:text-white"
      }`}
  >
    {label}
  </span>
);

const StatCard = ({ title, value, sub }) => (
  <div className="bg-glass backdrop-blur-xl rounded-xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
    <p className="text-gray-400 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
    <p className="text-xs text-accentCyan mt-2">{sub}</p>
  </div>
);

const QuickAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-glass backdrop-blur-xl rounded-xl p-6 flex flex-col items-center gap-3 shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:scale-105 transition"
  >
    <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-accentCyan">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const CarCard = ({ name, price, tag, image, specs }) => (
  <div className="group bg-glass backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_20px_45px_rgba(168,85,247,0.35)] hover:-translate-y-2 hover:scale-[1.03] transition">
    <div className="h-44 bg-black/20 flex items-center justify-center relative">
      <img
        src={image}
        alt={name}
        className="h-full object-contain group-hover:scale-110 transition"
      />
      <span className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-accentCyan text-xs">
        {tag}
      </span>
    </div>

    <div className="p-4">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-gray-400 text-sm">{specs}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-accentCyan font-bold">
          {price}
          <span className="text-xs text-gray-400"> / day</span>
        </span>
        <button className="bg-accentCyan text-black px-4 py-1.5 rounded-md text-sm font-semibold">
          Book Now
        </button>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, sub, dot }) => (
  <div className="flex items-start gap-3 mb-4">
    <span className={`mt-1 w-2.5 h-2.5 rounded-full ${dot}`} />
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  </div>
);

export default AppDashboard;
