import React from 'react'
import { motion } from 'framer-motion'
import { ZoomIn } from '../utility/Animation'

const Cards = ({item}) => {
    return (
        <motion.div 
            variants={ZoomIn()}
            className='group'
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className='relative border-2 border-purple-500/30 rounded-xl flex flex-col gap-3 items-center justify-center py-10 px-10 bg-gradient-to-br from-slate-800/80 to-purple-900/20 backdrop-blur-sm group-hover:border-cyan-400 group-hover:from-purple-900/40 group-hover:to-cyan-900/20 transition-all duration-500 shadow-xl group-hover:shadow-cyan-500/50 overflow-hidden'>
                
                {/* Gaming Corner Accent */}
                <div className='absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <div className='absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                
                {/* Image with Multiple Animated Glow Layers */}
                <div className='relative'>
                    <motion.img 
                        src={item.img} 
                        alt={item.name} 
                        className='w-60 h-40 object-contain relative z-10'
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ duration: 0.4 }}
                    />
                    
                    {/* Primary Glow Layer - Cyan */}
                    <motion.div 
                        className='absolute inset-0 bg-cyan-500 rounded-lg blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300'
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    {/* Secondary Glow Layer - Purple */}
                    <motion.div 
                        className='absolute inset-0 bg-purple-500 rounded-lg blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300'
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />
                    
                    {/* Tertiary Glow Layer - Pink */}
                    <motion.div 
                        className='absolute inset-0 bg-pink-500 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300'
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                <h3 className='font-bold text-xl text-cyan-300 group-hover:text-white transition-colors duration-300'>{item.name}</h3>
                <p className='text-gray-400 group-hover:text-gray-200 transition-colors duration-300 text-center text-sm'>{item.desc}</p>
                
                {/* Stats Bar */}
                <div className='w-full h-1 bg-slate-700 rounded-full overflow-hidden'>
                    <motion.div 
                        className='h-full bg-gradient-to-r from-cyan-400 to-purple-400'
                        initial={{ width: 0 }}
                        whileInView={{ width: '80%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </div>
                
                <div className='flex justify-between items-center gap-6 pt-2 w-full'>
                    <p className='font-bold text-cyan-400 group-hover:text-white transition-colors duration-300'>{item.price}</p>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-md font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all group-hover:from-cyan-600 group-hover:to-purple-600'
                    >
                        Rent Now
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default Cards
