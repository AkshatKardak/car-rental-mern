import React from 'react'
import { motion } from 'framer-motion'

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Main gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#111122] to-[#1e1b4b]" />
      
      {/* Animated Abstract Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple/20 blur-[120px]"
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]"
      />
      
      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Abstract Image Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 opacity-20 mix-blend-overlay z-0"
      >
        <img
          alt="Abstract blurred futuristic car headlights"
          className="w-full h-full object-cover grayscale brightness-50"
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
        />
      </motion.div>
    </div>
  )
}

export default BackgroundEffects
