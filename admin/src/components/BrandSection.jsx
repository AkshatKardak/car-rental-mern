import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const container = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

const BrandSection = () => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="hidden lg:flex flex-col gap-6 max-w-lg"
    >
      {/* Logo - Using Your Custom Logo from Assets */}
      <motion.div variants={item} className="flex items-center gap-3">
        <motion.img
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          src={logo}
          alt="RentRide Logo"
          className="h-16 w-auto object-contain"
        />
      </motion.div>

      {/* Description */}
      <motion.p 
        variants={item}
        className="text-slate-400 text-lg leading-relaxed"
      >
        Manage your premium fleet with precision. Access real-time analytics, 
        vehicle status, and user management from the centralized command center.
      </motion.p>

      {/* Status Cards */}
      <motion.div 
        variants={item}
        className="mt-8 flex gap-4"
      >
        <StatusCard
          icon="speed"
          label="System Status"
          value="Operational"
          colorClass="text-accent-purple"
          delay={0}
        />
        <StatusCard
          icon="security"
          label="Security Level"
          value="Encrypted"
          colorClass="text-primary"
          delay={0.2}
        />
      </motion.div>
    </motion.div>
  )
}

const StatusCard = ({ icon, label, value, colorClass, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.8, duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="glass-panel p-4 rounded-lg flex items-center gap-3 w-fit cursor-default"
    >
      <motion.span 
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          delay: delay
        }}
        className={`material-symbols-outlined ${colorClass}`}
        style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' }}
      >
        {icon}
      </motion.span>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export default BrandSection
