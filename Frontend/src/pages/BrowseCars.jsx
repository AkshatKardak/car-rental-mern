import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, ChevronDown, Loader2, Star, Users, Fuel, Gauge
} from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { carService } from '../services/carService';

// --- SIMPLE IMAGE IMPORT ---
// We use a default image if specific ones fail to load
import heroCarImg from '../assets/herocar.png';
// Import your existing assets (add more as you have them)
import porscheImg from '../assets/porsche.png';
import mercedesImg from '../assets/mercedes.png';
import kiaImg from '../assets/Kia.png';
import skodaImg from '../assets/skoda.png';
import audiImg from '../assets/AudiElectric.png';

// --- SIMPLE MAPPER ---
const getImageForCar = (car) => {
  const brand = car.brand?.toLowerCase() || '';
  // Simple mapping based on your existing files
  if (brand.includes('porsche')) return porscheImg;
  if (brand.includes('mercedes')) return mercedesImg;
  if (brand.includes('kia')) return kiaImg;
  if (brand.includes('skoda')) return skodaImg;
  if (brand.includes('audi')) return audiImg;
  
  // Default for Toyota/Supra and others until you add their images
  return heroCarImg;
};

const BrowseCars = () => {
  const navigate = useNavigate();

  // 1. Data Source (Original List)
  const [allCars, setAllCars] = useState([]);
  
  // 2. Display List (Filtered)
  const [displayCars, setDisplayCars] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Filter States
  const [filters, setFilters] = useState({
    search: '',
    brand: 'All',
    category: 'All',
    fuel: 'All',
    transmission: 'All',
    price: 100000, // High default to show all
  });

  const [showFilters, setShowFilters] = useState(false);

  // Options for Dropdowns
  const [brands, setBrands] = useState(['All']);
  const categories = ['All', 'Luxury', 'Sports', 'SUV', 'Sedan', 'Electric'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric'];
  const transmissions = ['All', 'Automatic', 'Manual'];

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getAllCars({ available: 'true' });
      
      if (response.success && response.data) {
        const cars = response.data;
        setAllCars(cars);
        setDisplayCars(cars); // Show all initially
        
        // Extract Brands
        const uniqueBrands = ['All', ...new Set(cars.map(c => c.brand))];
        setBrands(uniqueBrands);
      }
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  // --- THE LOGIC: ONLY RUNS WHEN TRIGGERED ---
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();

    let result = [...allCars];

    // 1. Search Text
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.brand.toLowerCase().includes(q) || 
        c.model.toLowerCase().includes(q)
      );
    }

    // 2. Dropdowns
    if (filters.brand !== 'All') result = result.filter(c => c.brand === filters.brand);
    if (filters.category !== 'All') result = result.filter(c => c.category.toLowerCase() === filters.category.toLowerCase());
    if (filters.fuel !== 'All') result = result.filter(c => c.fuelType.toLowerCase() === filters.fuel.toLowerCase());
    if (filters.transmission !== 'All') result = result.filter(c => c.transmission.toLowerCase() === filters.transmission.toLowerCase());

    // 3. Price
    result = result.filter(c => c.pricePerDay <= filters.price);

    setDisplayCars(result);
  };

  const handleClear = () => {
    setFilters({
      search: '',
      brand: 'All',
      category: 'All',
      fuel: 'All',
      transmission: 'All',
      price: 100000
    });
    setDisplayCars(allCars); // Reset immediately
  };

  const handleBookNow = (car) => {
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

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">Browse Cars</h1>
          <p className="text-text-secondary text-lg">Find your perfect ride from our premium collection</p>
        </div>

        {/* --- MAIN SEARCH BAR --- */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleApplyFilters} className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search by name, brand..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-border-light focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border font-semibold transition-all min-w-[120px] ${showFilters ? 'bg-white border-primary text-primary' : 'bg-white hover:bg-gray-50'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* SEARCH BUTTON */}
            <button 
                type="submit" 
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            >
                Search
            </button>
          </form>
        </div>

        {/* --- EXPANDABLE FILTERS PANEL --- */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="rounded-2xl bg-white border border-border-light p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Brand */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Brand</label>
                    <select 
                      value={filters.brand} 
                      onChange={(e) => setFilters({...filters, brand: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-border-light"
                    >
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Category</label>
                    <select 
                      value={filters.category} 
                      onChange={(e) => setFilters({...filters, category: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-border-light"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Fuel */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Fuel</label>
                    <select 
                      value={filters.fuel} 
                      onChange={(e) => setFilters({...filters, fuel: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-border-light"
                    >
                      {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Transmission</label>
                    <select 
                      value={filters.transmission} 
                      onChange={(e) => setFilters({...filters, transmission: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-border-light"
                    >
                      {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Price Slider */}
                <div className="mt-6">
                  <label className="text-sm font-semibold mb-3 block">Max Price: ₹{filters.price} / day</label>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000"
                    value={filters.price} 
                    onChange={(e) => setFilters({...filters, price: Number(e.target.value)})} 
                    className="w-full h-2 bg-gray-200 rounded-lg accent-primary cursor-pointer" 
                  />
                </div>
                
                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={handleClear} className="text-red-500 font-semibold px-4">Clear All</button>
                    <button onClick={handleApplyFilters} className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-primary-hover">Apply Filters</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CAR GRID (Cards Design) --- */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-12 h-12 text-primary animate-spin mx-auto"/></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : displayCars.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
             No cars found. <button onClick={handleClear} className="text-primary underline">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCars.map((car, index) => (
              <CarCard 
                key={car._id || index} 
                car={car} 
                index={index} 
                onViewDetails={() => navigate(`/car/${car._id}`)} 
                onBookNow={() => handleBookNow(car)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// --- STYLING (Card Component) ---
const CarCard = ({ car, index, onViewDetails, onBookNow }) => {
  const imageSrc = getImageForCar(car);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className='group h-full'
      whileHover={{ y: -10 }}
    >
      <div className='relative h-full border-2 border-primary/30 rounded-xl flex flex-col gap-3 items-center justify-between py-10 px-6 bg-white dark:bg-background-dark-secondary backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 shadow-xl group-hover:shadow-primary/50 overflow-hidden'>
          
          {/* Corner Accents */}
          <div className='absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          <div className='absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          
          {/* Image */}
          <div className='relative w-full flex justify-center mb-4'>
              <motion.img 
                  src={imageSrc} 
                  alt={car.name} 
                  className='w-64 h-40 object-contain relative z-10'
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.4 }}
              />
              <div className='absolute inset-0 bg-primary rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-pulse'/>
          </div>

          <div className="text-center space-y-2 w-full">
            <h3 className='font-bold text-xl text-primary group-hover:text-text-primary transition-colors duration-300'>
              {car.brand} {car.model}
            </h3>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={12}/> {car.seats}</span>
                <span className="flex items-center gap-1"><Fuel size={12}/> {car.fuelType}</span>
                <span className="flex items-center gap-1"><Gauge size={12}/> {car.transmission}</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className='w-full h-1 bg-gray-200 rounded-full overflow-hidden my-2'>
              <motion.div 
                  className='h-full bg-primary'
                  initial={{ width: 0 }}
                  whileInView={{ width: '80%' }}
                  transition={{ duration: 1, delay: 0.2 }}
              ></motion.div>
          </div>
          
          <div className='flex justify-between items-center gap-4 pt-2 w-full mt-auto'>
              <p className='font-bold text-primary text-lg group-hover:text-text-primary transition-colors'>
                ₹{car.pricePerDay}/day
              </p>
              <div className="flex gap-2">
                 <button 
                   onClick={onViewDetails}
                   className='px-3 py-2 text-sm border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all duration-300'
                 >
                   Details
                 </button>
                 <motion.button 
                    onClick={onBookNow}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-primary/50 transition-all duration-300 text-sm'
                 >
                    Rent Now
                 </motion.button>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export default BrowseCars;
