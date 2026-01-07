import React from 'react'
import Cards from './Cards'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeUp, StaggerContainer } from '../utility/Animation'
import RollsRoyce from '../assets/rolls royce.png'
import Mercedes from '../assets/mercedes.png'
import Bugatti from '../assets/Bugatti.png'
import luxury from '../assets/luxury.png'
import bluecar from '../assets/bluecar.png'
import blackcar from '../assets/blackcar.png'

const Inventory = () => {
  const cars = [
    {
      id: 1,
      name: "Rolls-Royce Phantom",
      desc: "Experience unparalleled luxury with handcrafted interiors and whisper-quiet performance.",
      price: "Rs. 9.50 - 10.48 Crore",
      img: RollsRoyce
    },
    {
      id: 2,
      name: "Mercedes-Benz S-Class",
      desc: "Premium executive sedan featuring cutting-edge technology and refined German engineering.",
      price: "Rs. 1.62 - 1.76 Crore",
      img: Mercedes
    },
    {
      id: 3,
      name: "Ferrari 488 GTB",
      desc: "Italian supercar delivering breathtaking speed with iconic Prancing Horse heritage.",
      price: "Rs. 3.88 - 4.02 Crore",
      img: Bugatti
    },
    {
      id: 4,
      name: "Bentley Continental GT",
      desc: "Handcrafted British luxury combining elegant design with exceptional performance.",
      price: "Rs. 3.50 - 5.50 Crore",
      img: luxury
    },
    {
      id: 5,
      name: "Lamborghini Huracán EVO",
      desc: "Track-ready supercar with aggressive styling and naturally aspirated V10 power.",
      price: "Rs. 3.71 - 4.29 Crore",
      img: bluecar
    },
    {
      id: 6,
      name: "Porsche 911 Turbo S",
      desc: "Legendary sports car offering precision handling and everyday supercar usability.",
      price: "Rs. 2.84 - 3.51 Crore",
      img: blackcar,
      isBlackcar:true
    }
  ]

  return (
    <div id="inventory" className='bg-gradient-to-b from-slate-900 to-purple-900/20 py-20 px-4 relative overflow-hidden'>
      {/* Animated Background Circles */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow'></div>
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow'></div>
      
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='flex flex-col space-y-3 text-center'>
          <motion.h1 
            variants={FadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className='text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
          >
            Our Elite Fleet
          </motion.h1>
          <motion.p 
            variants={FadeUp(0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className='text-sm text-gray-300'
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
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white mx-auto flex rounded-lg font-bold glow-blue hover:glow-purple transition-all duration-300'
          >
            Load More <ChevronRight/>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Inventory
