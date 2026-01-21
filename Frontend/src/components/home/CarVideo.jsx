import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { ZoomIn } from '../../utility/Animation'
import carVideo from '../../assets/car1.mp4'

const CarVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className='bg-gradient-to-b from-background-light to-background-secondary dark:from-background-dark dark:to-background-dark-secondary py-20 px-4 relative overflow-hidden'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl'></div>
      
      <div className='max-w-6xl mx-auto relative z-10'>
        <motion.div
          variants={ZoomIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='text-center mb-10'
        >
          <h2 className='text-4xl lg:text-6xl font-bold text-text-primary dark:text-text-dark-primary mb-4'>
            Experience the Thrill
          </h2>
          <p className='text-text-secondary dark:text-text-dark-secondary text-lg'>Watch our collection in action</p>
        </motion.div>

        <motion.div
          variants={ZoomIn(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 group'
        >
          <video
            ref={videoRef}
            src={carVideo}
            loop
            muted
            playsInline
            className='w-full h-[400px] lg:h-[600px] object-cover'
            onEnded={() => setIsPlaying(false)}
          />
          
          <div className={`absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
            <div className='absolute bottom-8 left-8 right-8'>
              <h3 className='text-3xl font-bold text-white mb-2'>Premium Collection</h3>
              <p className='text-gray-300'>Legendary vehicles await your command</p>
            </div>
          </div>

          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className='w-20 h-20 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-2xl hover:shadow-primary/50 transition-all'
                >
                  <Play className='text-white ml-1' size={32} fill='white' />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {isPlaying && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className='absolute top-4 right-4 w-12 h-12 bg-background-dark/80 backdrop-blur-sm border-2 border-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-all'
            >
              <Pause className='text-white' size={20} fill='white' />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CarVideo
