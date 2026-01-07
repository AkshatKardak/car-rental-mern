import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { CalendarDays, Clock } from "lucide-react";

const MyBookings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black">My Bookings</h1>
            <p className="text-slate-300 text-sm">Manage your reservations</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Clock className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg">No bookings yet</p>
              <p className="text-slate-500 text-sm mt-2">Book your first car to see it here</p>
              <a
                href="/browse-cars"
                className="inline-block mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:brightness-110 transition"
              >
                Browse Cars
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
