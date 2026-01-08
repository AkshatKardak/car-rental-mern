import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '../utility/Animation'
import supercar from '../assets/Supercar-PNG-Photo-Image.png'
import maintenance from '../assets/maintenance.png'
import steering from '../assets/steering.png'
import battery from '../assets/battery.png'
import tyre from '../assets/tyre.png'

const Aboutx = () => {
    const features = [
        {
            icon: tyre,
            title: "Premium Tires",
            desc: "High-performance tires for maximum grip and safety on every ride.",
            color: "from-cyan-500 to-blue-500",
            position: "top-2 left-2 lg:top-8 lg:left-4"
        },
        {
            icon: maintenance,
            title: "Full Service",
            desc: "Regular maintenance and care to keep your rental in perfect condition.",
            color: "from-purple-500 to-pink-500",
            position: "top-2 right-2 lg:top-8 lg:right-4"
        },
        {
            icon: steering,
            title: "Precision Control",
            desc: "Advanced steering systems for smooth and responsive handling.",
            color: "from-yellow-500 to-orange-500",
            position: "bottom-2 left-2 lg:bottom-8 lg:left-4"
        },
        {
            icon: battery,
            title: "Power Ready",
            desc: "Fully charged batteries ensuring reliable performance throughout.",
            color: "from-green-500 to-teal-500",
            position: "bottom-2 right-2 lg:bottom-8 lg:right-4"
        }
    ]

  return (
    <div id="about" className='bg-gradient-to-b from-purple-900/20 via-slate-900 to-slate-900 py-20'>
            {/* Background Effects */}
            <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow'></div>
            <div className='absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow'></div>
            <div className='absolute inset-0 grid-bg opacity-10'></div>

            <div className='max-w-7xl mx-auto px-4 relative z-10'>
                {/* Section Title */}
                <motion.div
                    variants={FadeUp(0.2)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='text-center mb-12'
                >
                    <h2 className='text-4xl lg:text-6xl font-bold gradient-text mb-4'>
                        Premium Care System
                    </h2>
                    <p className='text-gray-400 text-lg'>Every vehicle is battle-ready and fully optimized</p>
                </motion.div>

                <motion.div
                    variants={FadeUp(0.3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='relative h-[650px] lg:h-[700px]'
                >
                    {/* Central Car Image - Higher z-index */}
                    <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'>
                        <motion.img 
                            src={supercar} 
                            alt="Supercar" 
                            className='w-full max-w-3xl lg:max-w-4xl object-contain drop-shadow-2xl'
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Glow effect behind car */}
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-pink-600/20 blur-3xl -z-10'></div>
                    </div>

                    {/* Feature Cards Container - Lower z-index */}
                    <div className='absolute inset-0 z-10'>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`absolute ${feature.position} w-36 lg:w-56 pointer-events-auto`}
                            >
                                <div className='bg-slate-800/95 backdrop-blur-xl border-2 border-slate-700 hover:border-cyan-400 rounded-xl p-3 lg:p-6 shadow-2xl transition-all duration-300 group'>
                                    {/* Icon Container with Image - No background color */}
                                    <div className='w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-2 lg:mb-3 mx-auto group-hover:scale-110 transition-transform'>
                                        <img 
                                            src={feature.icon} 
                                            alt={feature.title}
                                            className='w-full h-full object-contain'
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className='font-bold text-sm lg:text-lg text-center text-cyan-300 group-hover:text-white transition-colors mb-1 lg:mb-2'>
                                        {feature.title}
                                    </h3>

                                    {/* Description - Hidden on mobile */}
                                    <p className='text-xs lg:text-sm text-gray-400 text-center hidden lg:block group-hover:text-gray-300 transition-colors leading-tight'>
                                        {feature.desc}
                                    </p>

                                    {/* Progress bar indicator */}
                                    <div className='w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-2 lg:mt-3 hidden lg:block'>
                                        <motion.div 
                                            className={`h-full bg-gradient-to-r ${feature.color}`}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Aboutx
