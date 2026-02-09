import React from 'react';
import Cards from './Cards';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FadeUp, StaggerContainer } from '../../utils/Animation';
import RollsRoyce from '../../assets/rolls royce.png';
import Mercedes from '../../assets/mercedes.png';
import Bugatti from '../../assets/Bugatti.png';
import luxury from '../../assets/luxury.png';
import bluecar from '../../assets/bluecar.png';
import blackcar from '../../assets/blackcar.png';

const Inventory = () => {
  const { isDarkMode } = useTheme();

  const cars = [
    {
      id: 1,
      name: "Rolls-Royce Phantom",
      desc: "Experience unparalleled luxury with handcrafted interiors and whisper-quiet performance.",
      price: "10.48 Cr",
      img: RollsRoyce
    },
    {
      id: 2,
      name: "Mercedes-Benz S-Class",
      desc: "Premium executive sedan featuring cutting-edge technology and refined German engineering.",
      price: "1.76 Cr",
      img: Mercedes
    },
    {
      id: 3,
      name: "Ferrari 488 GTB",
      desc: "Italian supercar delivering breathtaking speed with iconic Prancing Horse heritage.",
      price: "4.02 Cr",
      img: Bugatti
    },
    {
      id: 4,
      name: "Bentley Continental GT",
      desc: "Handcrafted British luxury combining elegant design with exceptional performance.",
      price: "5.50 Cr",
      img: luxury
    },
    {
      id: 5,
      name: "Lamborghini Huracán EVO",
      desc: "Track-ready supercar with aggressive styling and naturally aspirated V10 power.",
      price: "4.29 Cr",
      img: bluecar
    },
    {
      id: 6,
      name: "Porsche 911 Turbo S",
      desc: "Legendary sports car offering precision handling and everyday supercar usability.",
      price: "3.51 Cr",
      img: blackcar,
      isBlackcar: true
    }
  ];

  const theme = {
    bg: isDarkMode ? 'linear-gradient(to bottom, #1e293b, #0f172a)' : 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
  };

  return (
    <div
      id="inventory"
      className='py-20 px-4 relative overflow-hidden transition-all duration-300'
      style={{ background: theme.bg }}
    >
      {/* Background Effects */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse'></div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='flex flex-col space-y-3 text-center'>
          <motion.h1
            variants={FadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className='text-4xl lg:text-6xl font-bold text-green-500'
          >
            Our Elite Fleet
          </motion.h1>
          <motion.p
            variants={FadeUp(0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className='text-sm transition-colors'
            style={{ color: theme.textSecondary }}
          >
            Discover legendary vehicles in your collection
          </motion.p>

          <motion.div
            variants={StaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-10'
          >
            {cars.map((item) => (
              <Cards key={item.id} item={item} />
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={FadeUp(0.6)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='pt-10'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-6 py-3 bg-green-500 hover:bg-green-600 text-white mx-auto flex rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300'
          >
            Load More <ChevronRight />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Inventory;
