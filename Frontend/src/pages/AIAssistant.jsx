import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { Sparkles, Send, Trash2, Bot, User, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const AIAssistant = () => {
  const navigate = useNavigate();

  // Demo messages (hook it to real AI later)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Tell me what kind of car you want (budget, seats, transmission, fuel, city).",
      time: "Now",
    },
    {
      role: "assistant",
      text: "Example: “Need an SUV under ₹700/day, automatic, 5 seats.”",
      time: "Now",
    },
  ]);

  const [input, setInput] = useState("");

  // Optional: quick suggestion chips
  const chips = useMemo(
    () => [
      "Suggest a car for my trip",
      "Show cheapest SUVs",
      "Electric cars under ₹600/day",
      "Explain insurance options",
      "Cancellation policy",
    ],
    []
  );

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text, time: "Now" },
      {
        role: "assistant",
        text:
          "Got it. AI integration is pending, but this UI is ready. Next step: connect backend/OpenAI API and return matched cars.",
        time: "Now",
      },
    ]);

    setInput("");
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Hi! Tell me what kind of car you want (budget, seats, transmission, fuel, city).",
        time: "Now",
      },
    ]);
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
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                AI Assistant
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Get personalized car recommendations
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={() => navigate("/browse-cars")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition"
            >
              <Car className="w-4 h-4" />
              Browse
            </button>
          </div>
        </motion.div>

        {/* Main chat card */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Chat top bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80">
              <Bot className="w-5 h-5 text-cyan-300" />
              <p className="font-black text-white">RentRide AI</p>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
              <p className="text-xs text-white/60">Online</p>
            </div>

            <p className="text-xs text-white/50">
              Theme: cyan-purple dashboard
            </p>
          </div>

          {/* Messages */}
          <div className="h-[520px] overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-cyan-300" />
                    </div>
                  )}

                  <div className={`${isUser ? "text-right" : "text-left"} max-w-[80%]`}>
                    <p className="text-[11px] text-white/50 mb-1">{m.time}</p>

                    <div
                      className={
                        isUser
                          ? "px-4 py-3 rounded-2xl rounded-br-none bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                          : "px-4 py-3 rounded-2xl rounded-bl-none bg-white/5 border border-white/10 text-white/90"
                      }
                    >
                      {m.text}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick chips */}
          <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setInput(c)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition text-sm font-semibold"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
              />

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 26px rgba(34,211,238,0.28), 0 0 22px rgba(168,85,247,0.20)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={sendMessage}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black hover:brightness-110 transition inline-flex items-center gap-2"
              >
                Send
                <Send className="w-4 h-4" />
              </motion.button>
            </div>

            <p className="text-[10px] text-white/40 mt-2">
              AI Assistant UI ready. Connect real AI later (OpenAI / backend).
            </p>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default AIAssistant;
