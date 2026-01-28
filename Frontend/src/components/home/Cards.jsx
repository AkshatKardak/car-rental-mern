import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ZoomIn } from '../../utils/Animation';

const Cards = ({item}) => {
    const { isDarkMode } = useTheme();

    const theme = {
        cardBg: isDarkMode ? '#1e293b' : '#ffffff',
        cardBgHover: isDarkMode ? '#334155' : 'rgba(16, 185, 129, 0.05)',
        text: isDarkMode ? '#f1f5f9' : '#1F2937',
        textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
        border: isDarkMode ? '#334155' : 'rgba(16, 185, 129, 0.3)',
        borderHover: isDarkMode ? '#10b981' : '#10b981',
    };

    return (
        <motion.div 
            variants={ZoomIn()}
            className='group'
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div 
                className='relative rounded-xl flex flex-col gap-3 items-center justify-center py-10 px-10 backdrop-blur-sm transition-all duration-500 shadow-xl overflow-hidden'
                style={{
                    backgroundColor: theme.cardBg,
                    borderWidth: '2px',
                    borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.borderHover;
                    e.currentTarget.style.backgroundColor = theme.cardBgHover;
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = theme.cardBg;
                    e.currentTarget.style.boxShadow = '';
                }}
            >
                
                {/* Corner Accents */}
                <div className='absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <div className='absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                
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
                        className='absolute inset-0 bg-green-500 rounded-lg blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300'
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

                <h3 
                    className='font-bold text-xl transition-colors duration-300'
                    style={{ color: theme.text }}
                >
                    {item.name}
                </h3>
                
                <p 
                    className='text-center text-sm transition-colors duration-300'
                    style={{ color: theme.textSecondary }}
                >
                    {item.desc}
                </p>
                
                {/* Progress Bar */}
                <div 
                    className='w-full h-1 rounded-full overflow-hidden'
                    style={{ backgroundColor: isDarkMode ? '#334155' : '#f8f9fa' }}
                >
                    <motion.div 
                        className='h-full bg-green-500'
                        initial={{ width: 0 }}
                        whileInView={{ width: '80%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </div>
                
                <div className='flex justify-between items-center gap-6 pt-2 w-full'>
                    <p 
                        className='font-bold transition-colors duration-300'
                        style={{ color: isDarkMode ? '#10b981' : '#10b981' }}
                    >
                        {item.price}
                    </p>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold shadow-lg hover:shadow-green-500/50 transition-all'
                    >
                        Rent Now
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default Cards;
