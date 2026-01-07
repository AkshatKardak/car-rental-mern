import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Car, Search, Filter } from "lucide-react";

const BrowseCars = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Browse Cars</h1>
              <p className="text-slate-300 text-sm">Explore our premium fleet</p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Car className="w-16 h-16 text-cyan-300 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg">Car inventory coming soon</p>
              <p className="text-slate-500 text-sm mt-2">Backend integration in progress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseCars;
