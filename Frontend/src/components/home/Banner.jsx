import React from 'react'
import banner from '../../assets/banner.jpg'
import { motion } from 'framer-motion'
import { FadeLeft } from '../../utility/Animation'
import { Send } from 'lucide-react'

const Banner = () => {
  return (
    <div id="contact" className='relative overflow-hidden bg-slate-900'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0'>
        <img 
          src={banner} 
          alt="Banner" 
          className='w-full h-full object-cover opacity-30'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-purple-900/80 via-slate-900/80 to-cyan-900/80'></div>
      </div>

      {/* Contact Form - Right Side */}
      <div className='relative min-h-[700px] lg:min-h-[800px] flex items-center justify-end px-4 lg:px-16 max-w-7xl mx-auto py-20'>
        <motion.div
          variants={FadeLeft(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='w-full max-w-md'
        >
          <h2 className='text-4xl lg:text-5xl font-bold mb-2'>
            <span className='gradient-text'>Get In Touch</span>
          </h2>
          <p className='text-gray-400 mb-6'>Connect with our team to book your ride</p>

          <form className='bg-slate-800/90 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-8 space-y-4 shadow-2xl'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='font-semibold text-cyan-400 text-sm'>First Name</label>
                <input
                  className='p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all'
                  type="text"
                  name="firstName"
                  placeholder='firstName'
                  required
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='font-semibold text-cyan-400 text-sm'>Last Name</label>
                <input
                  className='p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all'
                  type="text"
                  name="lastName"
                  placeholder='lastName'
                  required
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-purple-400 text-sm'>Email</label>
              <input
                className='p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all'
                type="email"
                name="email"
                placeholder='john@example.com'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-pink-400 text-sm'>Phone Number</label>
              <input
                className='p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all'
                type="tel"
                name="phone"
                placeholder='+91 98765 43210'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-yellow-400 text-sm'>Message</label>
              <textarea
                className='p-3 rounded-lg bg-slate-900/50 border-2 border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all min-h-[100px] resize-none'
                name="message"
                placeholder='Tell us about your requirements...'
                required
              />
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 glow-blue hover:shadow-cyan-500/50 transition-all'
            >
              <Send size={20} />
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Banner
