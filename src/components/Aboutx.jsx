import React from 'react'
import About from '../assets/Supercar-PNG-Photo-Image.png'
import { motion } from 'framer-motion'
import { FadeUp } from '../utility/Animation'
import maintenance from '../assets/maintenance.png'
import steering from '../assets/steering.png'
import battery from '../assets/battery.png'
import tyre from '../assets/tyre.png'

const Aboutx = () => {
    return (
        <div className='relative bg-gradient-to-br from-slate-50 to-slate-100'>
            <div className='max-w-6xl mx-auto py-12 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className='relative h-[500px] lg:h-[600px]'>
                    
                    {/* Car Image - Centered */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <img src={About} alt="" className='w-full max-w-4xl object-contain' />
                    </div>

                    {/* Top Left Card */}
                    <div className='absolute top-0 left-0 lg:left-8 flex flex-col items-center text-center w-32 lg:w-48 space-y-2'>
                        <div className='bg-white shadow-lg rounded-full p-4'>
                            <img src={tyre} alt="" className='w-12 lg:w-16' />
                        </div>
                        <h3 className='font-semibold text-sm lg:text-base'>BATTERY REPAIR</h3>
                        <p className='text-xs lg:text-sm text-gray-600 hidden lg:block'>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
                        <h4 className='text-blue-500 text-sm hidden lg:block cursor-pointer hover:underline'>Read More</h4>
                    </div>

                    {/* Top Right Card */}
                    <div className='absolute top-0 right-0 lg:right-8 flex flex-col items-center text-center w-32 lg:w-48 space-y-2'>
                        <div className='bg-white shadow-lg rounded-full p-4'>
                            <img src={maintenance} alt="" className='w-12 lg:w-16' />
                        </div>
                        <h3 className='font-semibold text-sm lg:text-base'>BATTERY REPAIR</h3>
                        <p className='text-xs lg:text-sm text-gray-600 hidden lg:block'>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
                        <h4 className='text-blue-500 text-sm hidden lg:block cursor-pointer hover:underline'>Read More</h4>
                    </div>

                    {/* Bottom Left Card */}
                    <div className='absolute bottom-0 left-0 lg:left-8 flex flex-col items-center text-center w-32 lg:w-48 space-y-2'>
                        <div className='bg-white shadow-lg rounded-full p-4'>
                            <img src={steering} alt="" className='w-12 lg:w-16' />
                        </div>
                        <h3 className='font-semibold text-sm lg:text-base'>BATTERY REPAIR</h3>
                        <p className='text-xs lg:text-sm text-gray-600 hidden lg:block'>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
                        <h4 className='text-blue-500 text-sm hidden lg:block cursor-pointer hover:underline'>Read More</h4>
                    </div>

                    {/* Bottom Right Card */}
                    <div className='absolute bottom-0 right-0 lg:right-8 flex flex-col items-center text-center w-32 lg:w-48 space-y-2'>
                        <div className='bg-white shadow-lg rounded-full p-4'>
                            <img src={battery} alt="" className='w-12 lg:w-16' />
                        </div>
                        <h3 className='font-semibold text-sm lg:text-base'>BATTERY REPAIR</h3>
                        <p className='text-xs lg:text-sm text-gray-600 hidden lg:block'>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
                        <h4 className='text-blue-500 text-sm hidden lg:block cursor-pointer hover:underline'>Read More</h4>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default Aboutx
