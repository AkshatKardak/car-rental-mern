import React from 'react'
import { motion } from 'framer-motion'
import { Car, Mail, Phone, MapPin } from 'lucide-react'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import instagram from '../../assets/instagram.png'


const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', img: facebook, url: 'https://facebook.com' },
    { name: 'Twitter', img: twitter, url: 'https://twitter.com' },
    { name: 'Instagram', img: instagram, url: 'https://instagram.com' },
  ]

  return (
    <footer className='bg-background border-t border-border-light'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>

          {/* Brand */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <img
                src="/tab.png"
                alt="RentRide Logo"
                className='w-10 h-10 object-contain'
              />
              <span className='text-2xl font-bold text-primary'>RentRide</span>
            </div>
            <p className='text-text-secondary mb-4'>
              Reliable, swift, and comfortable car rentals for every journey.
            </p>

            {/* Social Media Icons */}
            <div className='flex gap-3'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 bg-background-secondary border border-border-light rounded-lg flex items-center justify-center hover:bg-primary-hover hover:border-primary-hover group transition-all'
                >
                  <img
                    src={social.img}
                    alt={social.name}
                    className='w-5 h-5 object-contain opacity-70 group-hover:opacity-100 group-hover:invert group-hover:brightness-0 transition-all'
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-bold text-text-primary mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              {['Home', 'Inventory', 'About Us', 'Contact', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href='#' className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-xl font-bold text-text-primary mb-4'>Services</h3>
            <ul className='space-y-2'>
              {['Luxury Cars', 'Sports Cars', 'SUVs', 'Electric Vehicles', 'Chauffeur Service'].map((service) => (
                <li key={service}>
                  <a href='#' className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>
                    → {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-xl font-bold text-text-primary mb-4'>Contact Us</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3 text-text-secondary group hover:text-primary transition-colors'>
                <MapPin size={20} className='text-primary mt-1 flex-shrink-0' />
                <span>123 RentRide Street, Mumbai, Maharashtra, India</span>
              </li>
              <li className='flex items-center gap-3 text-text-secondary group hover:text-primary transition-colors'>
                <Phone size={20} className='text-primary flex-shrink-0' />
                <span>+91 98765 43210</span>
              </li>
              <li className='flex items-center gap-3 text-text-secondary group hover:text-primary transition-colors'>
                <Mail size={20} className='text-primary flex-shrink-0' />
                <span>support@rentride.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-border-light mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-text-secondary text-sm'>
            © 2025 RentRide. All rights reserved. Made with 💚 by <span className='text-primary font-semibold'>Akshat</span>
          </p>
          <div className='flex gap-6 text-sm'>
            <a href='#' className='text-text-secondary hover:text-primary transition-colors'>Privacy Policy</a>
            <a href='#' className='text-text-secondary hover:text-primary transition-colors'>Terms of Service</a>
            <a href='#' className='text-text-secondary hover:text-primary transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
