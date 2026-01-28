import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  CreditCard,
  Sparkles,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";

import SupraImg from "../assets/supra.png";
import PorscheImg from "../assets/porsche.png";
import MercedesImg from "../assets/mercedesg63amg.png";

/* =========================
   DATA
 ========================= */

const RECOMMENDED_CARS = [
  {
    name: "Porsche 911 Carrera",
    price: "₹24,900",
    tag: "PREMIUM",
    image: PorscheImg,
    specs: "2023 • Automatic • Petrol",
  },
  {
    name: "Toyota Supra",
    price: "₹18,500",
    tag: "SPORTS",
    image: SupraImg,
    specs: "2023 • Automatic • Petrol",
  },
  {
    name: "Mercedes G63 AMG",
    price: "₹32,000",
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
    <div className="min-h-screen bg-background-secondary text-text-primary">
      {/* ❌ REMOVED: <DashboardNavbar /> */}

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* WELCOME SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-text-primary">
              Welcome back, <span className="text-primary italic">Alex</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-md">
              Your premium garage is ready. Where would you like to drive today?
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/browsecars")}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 font-black tracking-widest text-sm"
          >
            <Plus size={20} /> NEW BOOKING
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            title="Current Rental"
            value="Tesla Model S"
            sub="Return in 48 hours"
            icon={<Clock className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title="Total Bookings"
            value="14"
            sub="2 upcoming trips"
            icon={<Calendar className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title="Rewards Credits"
            value="₹4,500"
            sub="₹500 expiring soon"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-text-primary/70">⚡ Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction icon={<Car />} label="Browse Cars" onClick={() => navigate("/browsecars")} />
            <QuickAction icon={<Calendar />} label="My Bookings" onClick={() => navigate("/mybookings")} />
            <QuickAction icon={<Sparkles />} label="AI Assistant" onClick={() => navigate("/aiassistant")} />
            <QuickAction icon={<CreditCard />} label="Payments" onClick={() => navigate("/payment")} />
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* RECOMMENDED SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-text-primary/70">For Your Next Trip</h2>
              <button
                onClick={() => navigate("/browsecars")}
                className="text-primary text-sm font-black flex items-center gap-2 hover:translate-x-1 transition-transform"
              >
                EXPLORE ALL <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RECOMMENDED_CARS.slice(0, 2).map((car) => (
                <CarCard key={car.name} {...car} />
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY SECTION */}
          <div className="bg-white rounded-3xl p-8 border border-border-light shadow-xl shadow-black/5 h-fit">
            <h2 className="text-xl font-black uppercase tracking-widest text-text-primary mb-8 border-b border-border-light pb-4">Timeline</h2>

            <div className="space-y-8">
              <ActivityItem title="Booking Confirmed" sub="Tesla Model S • Today, 9:41 AM" status="success" />
              <ActivityItem title="Payment Received" sub="Invoice #4920 • Yesterday" status="primary" />
              <ActivityItem title="Car Dispatched" sub="Mercedes G63 • Oct 15" status="info" />
              <ActivityItem title="Profile Updated" sub="Mobile Verification • Oct 10" status="idle" />
            </div>

            <button className="w-full mt-10 py-4 text-sm font-black text-text-secondary rounded-2xl bg-background-secondary hover:bg-border-light transition-colors border border-border-light">
              VIEW ALL ACTIVITY
            </button>
          </div>
        </div>
      </main>

      {/* FLOAT ACTION */}
      <button
        type="button"
        onClick={() => navigate("/aiassistant")}
        className="
          fixed bottom-10 right-10 z-50
          w-16 h-16 rounded-3xl
          bg-primary text-white
          flex items-center justify-center
          shadow-2xl shadow-primary/40
          hover:scale-110 hover:-translate-y-2 transition-all duration-300
        "
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
};

/* =========================
   SUB COMPONENTS
 ========================= */

const StatCard = ({ title, value, sub, icon }) => (
  <div className="bg-white rounded-3xl p-8 border border-border-light shadow-xl shadow-black/5 flex items-start justify-between group hover:border-primary/50 transition-colors">
    <div>
      <p className="text-text-secondary text-xs font-black uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-black text-text-primary">{value}</h3>
      <p className="text-xs text-primary font-bold mt-3 bg-primary/5 inline-block px-2 py-1 rounded-lg">{sub}</p>
    </div>
    <div className="bg-background-secondary p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
      {icon}
    </div>
  </div>
);

const QuickAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 border border-border-light shadow-xl shadow-black/5 hover:translate-y-[-8px] hover:border-primary transition-all group"
  >
    <div className="w-16 h-16 rounded-2xl bg-background-secondary flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-sm font-black text-text-primary uppercase tracking-widest">{label}</span>
  </button>
);

const CarCard = ({ name, price, tag, image, specs }) => (
  <div className="group bg-white rounded-3xl overflow-hidden border border-border-light shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 flex flex-col">
    <div className="h-56 bg-background-secondary flex items-center justify-center relative p-6">
      <img
        src={image}
        alt={name}
        className="h-full object-contain group-hover:scale-110 transition-transform duration-700"
      />
      <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-xl font-black text-[10px] tracking-widest shadow-lg shadow-primary/20">
        {tag}
      </span>
    </div>

    <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-black text-text-primary group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-text-secondary text-sm font-medium mt-1">{specs}</p>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border-light">
        <div>
          <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">Daily Fare</p>
          <p className="text-2xl font-black text-primary">
            {price}
          </p>
        </div>
        <button className="bg-text-primary text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-primary transition-all shadow-lg active:scale-95">
          BOOK NOW
        </button>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, sub, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'primary': return 'bg-primary';
      case 'info': return 'bg-blue-500';
      default: return 'bg-border-light';
    }
  };

  return (
    <div className="flex items-start gap-4 relative">
      <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 z-10 ${getStatusColor()} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
      <div className="space-y-1">
        <p className="text-sm font-black text-text-primary leading-none uppercase tracking-wide">{title}</p>
        <p className="text-xs text-text-secondary font-medium tracking-tight opacity-75">{sub}</p>
      </div>
    </div>
  );
};

export default AppDashboard;
