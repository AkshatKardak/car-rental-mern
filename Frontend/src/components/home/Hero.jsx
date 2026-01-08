import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Zap, Shield, Clock } from 'lucide-react'
import { FadeRight, FadeLeft } from '../../utility/Animation'
import herocar from '../../assets/herocar1.png'

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792015-1a778e427386?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center opacity-35 mix-blend-overlay" />
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#131b2e] to-[#1e1035]" />
        {/* Decorative glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] bg-[#13c8ec]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] bg-purple-900/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side */}
          <div className="lg:w-1/2 space-y-6">
            {/* Glass badge */}
            <motion.div
              variants={FadeRight(0.2)}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/5 border border-white/10 backdrop-blur-md
                         text-sm font-semibold text-[#13c8ec]"
            >
              Premium Fleet • Neon Luxury
            </motion.div>

            <motion.h1
              variants={FadeRight(0.3)}
              initial="hidden"
              animate="visible"
              className="text-5xl lg:text-7xl font-bold leading-tight text-white"
            >
              Rent Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#11d7ff]">
                Dream Ride
              </span>
            </motion.h1>

            <motion.p
              variants={FadeRight(0.4)}
              initial="hidden"
              animate="visible"
              className="text-slate-300/90 text-lg leading-relaxed"
            >
              Experience premium cars with a futuristic booking flow, AI guidance, and smooth payments.
              Pick a luxury car, confirm dates, and checkout in seconds.
            </motion.p>

            <motion.div
              variants={FadeRight(0.5)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: <Zap size={18} />, text: 'Instant booking' },
                { icon: <Shield size={18} />, text: 'Secure payments' },
                { icon: <Clock size={18} />, text: '24/7 support' }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                             bg-[#0c1619]/60 border border-white/10 backdrop-blur-md
                             text-[#13c8ec] shadow-[0_0_0_rgba(0,0,0,0)]
                             hover:shadow-[0_0_15px_rgba(19,200,236,0.15)] transition"
                >
                  <span className="text-slate-300">{feature.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={FadeRight(0.6)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl font-bold text-slate-900 flex items-center gap-2
                           bg-gradient-to-br from-[#7c3aed] to-[#13c8ec] bg-[length:200%_200%]
                           hover:bg-right-top transition-[background-position,box-shadow] duration-500
                           hover:shadow-[0_0_20px_rgba(19,200,236,0.4)]"
              >
                Start booking <ChevronRight />
              </motion.button>

              <motion.a
                href="#inventory"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl font-bold text-white
                           border border-white/15 bg-white/5 backdrop-blur-md
                           hover:bg-white/10 transition"
              >
                View collection
              </motion.a>
            </motion.div>
          </div>

          {/* Right Side */}
          <motion.div
            variants={FadeLeft(0.3)}
            initial="hidden"
            animate="visible"
            className="lg:w-1/2 relative"
          >
            <motion.img
              src={herocar}
              alt="Hero Car"
              className="w-full drop-shadow-2xl"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* glow behind car */}
            <div className="absolute inset-0 -z-10 blur-3xl bg-gradient-to-r from-[#7c3aed]/30 to-[#13c8ec]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
