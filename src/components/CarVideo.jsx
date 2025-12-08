import React from 'react'
import video from '../assets/car.mov'
import CarAI from '../assets/CarAI2.png'
import bluecar from '../assets/bluecar.png'
import Bugatti from '../assets/Bugatti.png'


const CarVideo = () => {
  return (
    <div className='w-full'>
      <div>
        <img src={CarAI} alt="" className='md:hidden' />
        <img src={Bugatti} alt="" className='md:hidden'/>
        <img src={bluecar} alt="" className='md:hidden'/>
        <video src={video} className='w-full' autoPlay loop muted />
      </div>
    </div>
  )
}

export default CarVideo
