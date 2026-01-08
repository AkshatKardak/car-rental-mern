import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Inventory', href: '#inventory' },
    { name: 'Contact', href: '#contact' }
  ]

  // Smooth scroll function
  const handleScroll = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = 80 // Height of navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false) // Close mobile menu after click
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50 shadow-lg shadow-purple-500/20'
    >
      <div className='max-w-7xl mx-auto px-4 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <motion.a 
            href="#home"
            onClick={(e) => handleScroll(e, '#home')}
            whileHover={{ scale: 1.05 }}
            className='flex items-center gap-3 cursor-pointer'
          >
            {/* Logo Image */}
            <img src={Logo} alt="RentRide Logo" className='h-10 w-auto object-contain' />
          </motion.a>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-8'>
            {menuItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                whileHover={{ scale: 1.1, color: '#06b6d4' }}
                whileTap={{ scale: 0.95 }}
                className='text-gray-300 hover:text-cyan-400 font-semibold transition-colors'
              >
                {item.name}
              </motion.a>
            ))}
            
            {/* Auth Buttons */}
            <div className='flex items-center gap-3'>
              <motion.button
                onClick={() => navigate('/signin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-5 py-2 border-2 border-purple-500 text-purple-400 rounded-lg font-bold hover:bg-cyan-300 transition-all'
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg font-bold text-white glow-blue hover:shadow-cyan-500/50 transition-all'
              >
                Sign Up
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden text-white hover:text-cyan-400 transition-colors'
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden pb-4 space-y-3'
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className='block text-gray-300 hover:text-cyan-400 font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-all'
              >
                {item.name}
              </a>
            ))}
            <div className='space-y-2 px-4'>
              <button 
                onClick={() => navigate('/signin')}
                className='w-full px-6 py-2 border-2 border-purple-500 text-purple-400 rounded-lg font-bold hover:bg-cyan-500 transition-all'
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className='w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg font-bold text-white'
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
