import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Sparkles, MessageCircle } from "lucide-react";

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">AI Assistant</h1>
              <p className="text-slate-300 text-sm">Get personalized car recommendations</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 text-lg">AI Assistant chat coming soon</p>
                <p className="text-slate-500 text-sm mt-2">Integration in progress</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
