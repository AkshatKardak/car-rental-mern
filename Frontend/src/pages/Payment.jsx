import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { CreditCard } from "lucide-react";

const Payment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Payment</h1>
            <p className="text-slate-300 text-sm">Complete your booking</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-slate-300">Payment gateway integration in progress</p>
        </div>
      </main>
    </div>
  );
};

export default Payment;
