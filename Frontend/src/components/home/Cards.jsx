import React from 'react'
import { motion } from 'framer-motion'
import { ZoomIn } from '../../utils/Animation'

const Cards = ({item}) => {
    return (
        <motion.div 
            variants={ZoomIn()}
            className='group'
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className='relative border-2 border-primary/30 rounded-xl flex flex-col gap-3 items-center justify-center py-10 px-10 bg-white dark:bg-background-dark-secondary backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 shadow-xl group-hover:shadow-primary/50 overflow-hidden'>
                
                {/* Corner Accents */}
                <div className='absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <div className='absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity'></div>
                
                {/* Image with Glow */}
                <div className='relative'>
                    <motion.img 
                        src={item.img} 
                        alt={item.name} 
                        className='w-60 h-40 object-contain relative z-10'
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ duration: 0.4 }}
                    />
                    
                    {/* Glow Effect */}
                    <motion.div 
                        className='absolute inset-0 bg-primary rounded-lg blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300'
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
                </div>

                <h3 className='font-bold text-xl text-primary group-hover:text-text-primary dark:group-hover:text-text-dark-primary transition-colors duration-300'>{item.name}</h3>
                <p className='text-text-secondary dark:text-text-dark-secondary group-hover:text-text-primary dark:group-hover:text-text-dark-primary transition-colors duration-300 text-center text-sm'>{item.desc}</p>
                
                {/* Progress Bar */}
                <div className='w-full h-1 bg-background-secondary dark:bg-background-dark rounded-full overflow-hidden'>
                    <motion.div 
                        className='h-full bg-primary'
                        initial={{ width: 0 }}
                        whileInView={{ width: '80%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </div>
                
                <div className='flex justify-between items-center gap-6 pt-2 w-full'>
                    <p className='font-bold text-primary group-hover:text-text-primary dark:group-hover:text-text-dark-primary transition-colors duration-300'>{item.price}</p>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-bold shadow-lg hover:shadow-primary/50 transition-all'
                    >
                        Rent Now
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default Cards
