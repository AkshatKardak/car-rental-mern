import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Zap, Shield, Clock } from 'lucide-react'
import { FadeUp, FadeLeft, FadeRight, FloatingAnimation } from '../utility/Animation'
import herocar from '../assets/herocar1.png'

const Hero = () => {
  return (
    <div id="home"className='relative bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow'></div>
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow'></div>
      <div className='absolute inset-0 grid-bg opacity-20'></div>

      <div className='max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10'>
        <div className='flex flex-col lg:flex-row items-center gap-12'>
          {/* Left Side - Text */}
          <div className='lg:w-1/2 space-y-6'>
            <motion.div
              variants={FadeRight(0.2)}
              initial="hidden"
              animate="visible"
              className='inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm font-semibold text-cyan-400'
            >
              Premium Gaming Collection
            </motion.div>

            <motion.h1
              variants={FadeRight(0.3)}
              initial="hidden"
              animate="visible"
              className='text-5xl lg:text-7xl font-bold leading-tight'
            >
              Unlock Your
              <span className='block gradient-text'>Dream Ride</span>
            </motion.h1>

            <motion.p
              variants={FadeRight(0.4)}
              initial="hidden"
              animate="visible"
              className='text-gray-400 text-lg'
            >
              Experience legendary vehicles from our exclusive collection. Level up your journey with supercars, luxury sedans, and exotic rides.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={FadeRight(0.5)}
              initial="hidden"
              animate="visible"
              className='flex flex-wrap gap-4'
            >
              {[
                { icon: <Zap size={20} />, text: 'Instant Booking' },
                { icon: <Shield size={20} />, text: 'Full Insurance' },
                { icon: <Clock size={20} />, text: '24/7 Support' }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-cyan-400'
                >
                  {feature.icon}
                  <span className='text-sm font-semibold'>{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={FadeRight(0.6)}
              initial="hidden"
              animate="visible"
              className='flex flex-wrap gap-4'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white flex items-center gap-2 glow-blue hover:shadow-cyan-500/50 transition-all'
              >
                Start Your Quest <ChevronRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-8 py-4 bg-slate-800/50 border-2 border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-slate-700 transition-all'
              >
                View Collection
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side - Car Image */}
          <motion.div
            variants={FadeLeft(0.3)}
            initial="hidden"
            animate="visible"
            className='lg:w-1/2 relative'
          >
            <motion.img
              src={herocar}
              alt="Hero Car"
              className='w-full drop-shadow-2xl'
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Glow effect behind car */}
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 blur-3xl -z-10'></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero
