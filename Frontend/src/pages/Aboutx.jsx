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
            position: "top-2 left-2 lg:top-8 lg:left-4"
        },
        {
            icon: maintenance,
            title: "Full Service",
            desc: "Regular maintenance and care to keep your rental in perfect condition.",
            position: "top-2 right-2 lg:top-8 lg:right-4"
        },
        {
            icon: steering,
            title: "Precision Control",
            desc: "Advanced steering systems for smooth and responsive handling.",
            position: "bottom-2 left-2 lg:bottom-8 lg:left-4"
        },
        {
            icon: battery,
            title: "Power Ready",
            desc: "Fully charged batteries ensuring reliable performance throughout.",
            position: "bottom-2 right-2 lg:bottom-8 lg:right-4"
        }
    ]

    return (
        <div id="about" className='bg-background-secondary py-24 relative overflow-hidden'>
            {/* Background Decor */}
            <div className='absolute top-20 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none'></div>
            <div className='absolute bottom-20 right-10 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none'></div>

            <div className='max-w-7xl mx-auto px-4 relative z-10'>
                {/* Section Title */}
                <motion.div
                    variants={FadeUp(0.2)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='text-center mb-16'
                >
                    <h2 className='text-4xl lg:text-5xl font-black text-text-primary mb-4'>
                        Premium <span className='text-primary'>Care System</span>
                    </h2>
                    <p className='text-text-secondary text-lg max-w-2xl mx-auto'>Every vehicle in our fleet undergoes rigorous multi-point inspection and optimization before it reaches you.</p>
                </motion.div>

                <motion.div
                    variants={FadeUp(0.3)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='relative h-[600px] lg:h-[700px]'
                >
                    {/* Central Car Image Container */}
                    <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'>
                        <motion.img
                            src={supercar}
                            alt="Supercar"
                            className='w-full max-w-3xl lg:max-w-4xl object-contain drop-shadow-[0_20px_50px_rgba(16,163,16,0.2)]'
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Glow effect under car */}
                        <div className='absolute bottom-1/4 w-3/4 h-32 bg-primary/15 blur-[80px] -z-10 rounded-full'></div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className='absolute inset-0 z-30 lg:z-10'>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -8 }}
                                className={`absolute ${feature.position} w-40 lg:w-64`}
                            >
                                <div className='bg-white border border-border-light hover:border-primary/50 rounded-3xl p-4 lg:p-7 shadow-xl transition-all duration-300 group cursor-default'>
                                    {/* Icon Container */}
                                    <div className='w-14 h-14 lg:w-20 lg:h-20 bg-background-secondary rounded-2xl flex items-center justify-center mb-4 lg:mb-6 mx-auto group-hover:bg-primary/10 transition-colors'>
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className='w-10 h-10 lg:w-14 lg:h-14 object-contain group-hover:scale-110 transition-transform duration-300'
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className='font-black text-base lg:text-xl text-center text-text-primary group-hover:text-primary transition-colors mb-2'>
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className='text-xs lg:text-sm text-text-secondary text-center hidden lg:block leading-relaxed mb-4'>
                                        {feature.desc}
                                    </p>

                                    {/* Progress Indicator */}
                                    <div className='w-full h-1.5 bg-background-secondary rounded-full overflow-hidden hidden lg:block'>
                                        <motion.div
                                            className='h-full bg-primary shadow-[0_0_8px_rgba(16,163,16,0.3)]'
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            transition={{ duration: 1.5, delay: 0.6 + index * 0.1 }}
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
