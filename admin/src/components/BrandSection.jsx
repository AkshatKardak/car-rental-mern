import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { Activity, ShieldCheck } from 'lucide-react'

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
      {/* Logo */}
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
          className="h-100 w-auto object-contain"
        />
      </motion.div>

      {/* Description */}
      <motion.p
        variants={item}
        className="text-text-secondary text-lg leading-relaxed"
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
          icon={<Activity size={20} />}
          label="System Status"
          value="Operational"
          colorClass="text-primary"
          delay={0}
        />
        <StatusCard
          icon={<ShieldCheck size={20} />}
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
      className="bg-background-primary p-4 rounded-xl border border-border-light shadow-sm flex items-center gap-3 w-fit cursor-default"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay
        }}
        className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${colorClass}`}
      >
        {icon}
      </motion.div>
      <div>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-text-primary">{value}</p>
      </div>
    </motion.div>
  )
}

export default BrandSection;
