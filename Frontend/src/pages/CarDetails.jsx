import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Star,
  Info 
} from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { carService } from '../services/carService';

// --- IMAGE IMPORTS ---
import PorscheImg from '../assets/porsche.png';
import LamboImg from '../assets/lambo.png';
import BugattiImg from '../assets/Bugatti.png';
import MercedesImg from '../assets/mercedes.png';
import G63Img from '../assets/mercedesg63amg.png';
import KiaImg from '../assets/Kia.png';
import SkodaImg from '../assets/skoda.png';
import SupraImg from '../assets/supra.png';
import RollsImg from '../assets/rolls royce.png';
import AudiImg from '../assets/AudiElectric.png';
import HeroCarImg from '../assets/herocar.png';
import MustangImg from '../assets/blackcar.png'; 

const carImageAssets = {
  'porsche': PorscheImg,
  'lamborghini': LamboImg,
  'bugatti': BugattiImg,
  'mercedes': MercedesImg,
  'mercedes-benz': MercedesImg,
  'g63': G63Img,
  'kia': KiaImg,
  'skoda': SkodaImg,
  'toyota': SupraImg,
  'ford': MustangImg,
  'rolls-royce': RollsImg,
  'audi': AudiImg,
};

const getCarImage = (car) => {
  if (car.images?.[0] && car.images[0].startsWith('http')) return car.images[0];
  
  const brand = (car.brand || '').toLowerCase();
  const model = (car.model || '').toLowerCase();
  
  if (model.includes('g63')) return G63Img;
  if (model.includes('supra')) return SupraImg;
  
  if (carImageAssets[brand]) return carImageAssets[brand];
  return HeroCarImg;
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await carService.getCarById(id);
        if (response.success) {
          setCar(response.data);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  const handleBookNow = () => {
    if (!car) return;
    navigate('/payment', {
      state: {
        carId: car._id,
        carName: `${car.brand} ${car.model}`,
        pricePerDay: car.pricePerDay,
        baseFare: car.pricePerDay * 2,
        days: 2,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Car not found</h2>
      <button onClick={() => navigate('/browsecars')} className="text-green-600 underline">Browse Fleet</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-900">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/browsecars')} 
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition font-medium"
        >
          <ArrowLeft size={20} /> Back to Fleet
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-6"
          >
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-green-50/50 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/5 rounded-[32px] transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              <img 
                src={getCarImage(car)} 
                alt={car.name} 
                className="max-w-full drop-shadow-2xl z-10 transform group-hover:scale-110 transition duration-700 ease-out" 
              />
            </div>
            
            {/* Quick Badges */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
               <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm whitespace-nowrap">
                  <CheckCircle2 size={16} className="text-green-500"/> Verified
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm whitespace-nowrap">
                  <CheckCircle2 size={16} className="text-green-500"/> Insured
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm whitespace-nowrap">
                  <CheckCircle2 size={16} className="text-green-500"/> Cleaned
               </div>
            </div>
          </motion.div>

          {/* Right: Details Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-widest">{car.brand}</span>
                 <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest">{car.year}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-2">
                {car.name}
              </h1>
              <p className="text-2xl text-gray-400 font-medium">{car.model}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm font-medium text-gray-500 border-b border-gray-100 pb-6">
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-green-500"/> {car.location || 'Mumbai Hub'}</span>
                <span className="flex items-center gap-1.5"><Star size={18} className="text-yellow-400 fill-yellow-400"/> {car.rating || '4.8'} (120+ trips)</span>
              </div>
            </div>

            {/* Specs Grid (The Requested Details) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <SpecBox icon={<Gauge size={20} />} label="Transmission" value={car.transmission} />
               <SpecBox icon={<Fuel size={20} />} label="Fuel Type" value={car.fuelType} />
               <SpecBox icon={<Users size={20} />} label="Capacity" value={`${car.seats} Persons`} />
               <SpecBox icon={<Info size={20} />} label="Mileage" value={`${car.mileage || '10'} km/l`} />
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 text-lg mb-3">About this vehicle</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {car.description || "A premium vehicle designed for comfort, style, and performance. Perfect for city drives and weekend getaways. Regularly serviced and sanitized for your safety."}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {(car.features && car.features.length > 0 ? car.features : ['Bluetooth', 'GPS Navigation', 'Climate Control', 'Leather Seats', 'Rear Camera', 'USB Charging']).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Footer */}
            <div className="mt-auto bg-gray-900 rounded-[24px] p-6 text-white flex items-center justify-between shadow-2xl shadow-green-900/20">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Rental Price</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-black text-white">₹{car.pricePerDay?.toLocaleString()}</span>
                   <span className="text-gray-500 font-medium">/day</span>
                </div>
              </div>
              <button 
                onClick={handleBookNow} 
                className="bg-green-500 hover:bg-green-400 text-gray-900 px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Book Now <Calendar size={20} />
              </button>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Reusable Spec Component
const SpecBox = ({ icon, label, value }) => (
  <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:border-green-200 transition-colors">
    <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-bold text-gray-900 capitalize text-base">{value}</p>
    </div>
  </div>
);

export default CarDetails;
