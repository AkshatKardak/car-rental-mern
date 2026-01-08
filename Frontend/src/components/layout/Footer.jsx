import React from 'react'
import { motion } from 'framer-motion'
import { Car, Mail, Phone, MapPin } from 'lucide-react'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import instagram from '../../assets/instagram.png'


const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', img: facebook, url: 'https://facebook.com', color: 'from-blue-600 to-blue-400' },
    { name: 'Twitter', img: twitter, url: 'https://twitter.com', color: 'from-sky-600 to-sky-400' },
    { name: 'Instagram', img: instagram, url: 'https://instagram.com', color: 'from-pink-600 to-purple-600' },
  ]

 return (
    <footer className='bg-slate-950 border-t border-purple-500/30'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Brand - Using favicon from public folder */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              {/* Reference public folder with /tab.png */}
              <img 
                src="/tab.png" 
                alt="RentRide Logo" 
                className='w-10 h-10 object-contain'
              />
              <span className='text-2xl font-bold gradient-text'>RentRide</span>
            </div>
            <p className='text-gray-400 mb-4'>
              Level up your journey with legendary vehicles from our exclusive gaming collection.
            </p>
            
            {/* Social Media Icons */}
            <div className='flex gap-3'>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 transition-all p-2 group'
                >
                  <img 
                    src={social.img} 
                    alt={social.name} 
                    className='w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity'
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-bold text-cyan-400 mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              {['Home', 'Inventory', 'About Us', 'Contact', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href='#' className='text-gray-400 hover:text-cyan-400 transition-colors hover:translate-x-1 inline-block'>
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-xl font-bold text-purple-400 mb-4'>Services</h3>
            <ul className='space-y-2'>
              {['Luxury Cars', 'Sports Cars', 'SUVs', 'Electric Vehicles', 'Chauffeur Service'].map((service) => (
                <li key={service}>
                  <a href='#' className='text-gray-400 hover:text-purple-400 transition-colors hover:translate-x-1 inline-block'>
                    → {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-xl font-bold text-pink-400 mb-4'>Contact Us</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3 text-gray-400 group hover:text-pink-400 transition-colors'>
                <MapPin size={20} className='text-pink-400 mt-1 flex-shrink-0 group-hover:animate-bounce' />
                <span>123 Gaming Street, Mumbai, Maharashtra, India</span>
              </li>
              <li className='flex items-center gap-3 text-gray-400 group hover:text-cyan-400 transition-colors'>
                <Phone size={20} className='text-cyan-400 flex-shrink-0 group-hover:animate-pulse' />
                <span>+91 98765 43210</span>
              </li>
              <li className='flex items-center gap-3 text-gray-400 group hover:text-purple-400 transition-colors'>
                <Mail size={20} className='text-purple-400 flex-shrink-0 group-hover:animate-pulse' />
                <span>support@rentride.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-400 text-sm'>
            © 2025 RentRide. All rights reserved. Made with 💜 by <span className='text-cyan-400 font-semibold'>Akshat</span>
          </p>
          <div className='flex gap-6 text-sm'>
            <a href='#' className='text-gray-400 hover:text-cyan-400 transition-colors'>Privacy Policy</a>
            <a href='#' className='text-gray-400 hover:text-cyan-400 transition-colors'>Terms of Service</a>
            <a href='#' className='text-gray-400 hover:text-cyan-400 transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
