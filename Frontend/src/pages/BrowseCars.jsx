import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Users, Fuel, Gauge, AlertCircle } from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { carService } from '../services/carService';

// Existing assets only (from repo)
import heroCarImg from '../assets/herocar.png';
import porscheImg from '../assets/porsche.png';
import mercedesImg from '../assets/mercedesg63amg.png'; // use this for G63 too (avoid cyan image)
import kiaImg from '../assets/Kia.png';
import skodaImg from '../assets/skoda.png';
import audiImg from '../assets/AudiElectric.png';
import supraImg from '../assets/supra.png';
import lamboImg from '../assets/lambo.png';
import bugattiImg from '../assets/Bugatti.png';
import rollsImg from '../assets/rolls royce.png';


const CHEAP_CAR = {
  _id: 'cheap-tata-nano',
  name: 'Tata Nano',
  brand: 'Tata',
  model: 'Nano',
  year: 2021,
  pricePerDay: 799,
  category: 'Hatchback',
  fuelType: 'Petrol',
  transmission: 'Manual',
  seats: 4,
  available: true,
  description: 'Ultra-budget city car for daily commute.',
  images: [],
};

const getImageForCar = (car) => {
  if (!car) return heroCarImg;

  // Try db images tags first
  if (car.images && car.images.length > 0) {
    const tag = String(car.images[0]).toLowerCase();
    if (tag.includes('porsche')) return porscheImg;
    if (tag.includes('mercedes')) return mercedesImg; // always mercedes.png
    if (tag.includes('kia')) return kiaImg;
    if (tag.includes('skoda')) return skodaImg;
    if (tag.includes('audi')) return audiImg;
    if (tag.includes('supra') || tag.includes('toyota')) return supraImg;
    if (tag.includes('lambo')) return lamboImg;
    if (tag.includes('bugatti')) return bugattiImg;
    if (tag.includes('rolls')) return rollsImg;
  }

  // Name matching
  const text = `${car.brand || ''} ${car.model || ''}`.toLowerCase();

  if (text.includes('porsche') || text.includes('911')) return porscheImg;

  // IMPORTANT: Use mercedes.png for any Mercedes incl G63/AMG (avoid cyan image)
  if (text.includes('mercedes') || text.includes('g63') || text.includes('g-wagon') || text.includes('amg')) return mercedesImg;

  if (text.includes('kia') || text.includes('carens')) return kiaImg;
  if (text.includes('skoda') || text.includes('kylaq')) return skodaImg;
  if (text.includes('audi') || text.includes('e-tron')) return audiImg;
  if (text.includes('supra') || text.includes('toyota')) return supraImg;
  if (text.includes('lambo')) return lamboImg;
  if (text.includes('bugatti')) return bugattiImg;
  if (text.includes('rolls')) return rollsImg;

  return heroCarImg;
};

const BrowseCars = () => {
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [displayCars, setDisplayCars] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [brands, setBrands] = useState(['All']);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getAllCars();

      if (response.success && Array.isArray(response.data)) {
        setAllCars(response.data);
        setBrands(['All', ...new Set(response.data.map(c => c.brand).filter(Boolean))]);
      } else {
        setError('Failed to load cars');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const ensureSixCarsWithCheap = (cars) => {
    let list = [...cars];

    // insert cheap car only if Tata Nano not already in backend
    const hasNano = list.some(
      c => (c.brand || '').toLowerCase() === 'tata' && (c.model || '').toLowerCase().includes('nano')
    );

    if (!hasNano) list = [CHEAP_CAR, ...list];

    return list.slice(0, 6);
  };

  const filteredCars = useMemo(() => {
    let result = [...allCars];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.brand || '').toLowerCase().includes(q) ||
        (c.model || '').toLowerCase().includes(q)
      );
    }

    if (brand !== 'All') {
      result = result.filter(c => c.brand === brand);
    }

    return ensureSixCarsWithCheap(result);
  }, [allCars, search, brand]);

  useEffect(() => {
    setDisplayCars(filteredCars);
  }, [filteredCars]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setDisplayCars(filteredCars);
  };

  const handleClear = () => {
    setSearch('');
    setBrand('All');
  };

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">Browse Cars</h1>
          <p className="text-text-secondary text-lg">Choose from our exclusive collection</p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleApplyFilters} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border-light">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="w-full md:w-48">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 border border-border-light font-bold rounded-xl bg-white hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {displayCars.map((car, index) => (
              <CarCard
                key={car._id || index}
                car={car}
                index={index}
                onBook={() => navigate('/payment', { state: { carId: car._id, pricePerDay: car.pricePerDay } })}
                onDetails={() => navigate(`/car/${car._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const CarCard = ({ car, index, onBook, onDetails }) => {
  const imageSrc = getImageForCar(car);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group h-full"
      whileHover={{ y: -10 }}
    >
      <div className="relative h-full border-2 border-primary/30 rounded-xl flex flex-col gap-3 items-center justify-between py-10 px-6 bg-white dark:bg-background-dark-secondary backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 shadow-xl group-hover:shadow-primary/50 overflow-hidden">
        {!car.available && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-20">
            <AlertCircle size={12} /> Booked
          </div>
        )}

        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative w-full flex justify-center mb-4">
          <motion.img
            src={imageSrc}
            alt={car.name}
            className="w-64 h-40 object-contain relative z-10"
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-pulse" />
        </div>

        <div className="text-center space-y-2 w-full">
          <h3 className="font-bold text-xl text-primary group-hover:text-text-primary transition-colors duration-300">
            {car.brand} {car.model}
          </h3>

          <p className="text-sm text-gray-500 px-2 line-clamp-2">
            {car.description || 'Experience premium comfort and performance.'}
          </p>

          <div className="flex justify-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1"><Users size={12} /> {car.seats}</span>
            <span className="flex items-center gap-1"><Fuel size={12} /> {car.fuelType}</span>
            <span className="flex items-center gap-1"><Gauge size={12} /> {car.transmission}</span>
          </div>
        </div>

        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden my-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: '80%' }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>

        <div className="flex justify-between items-center gap-4 pt-2 w-full mt-auto">
          <p className="font-bold text-primary text-lg group-hover:text-text-primary transition-colors">
            ₹{car.pricePerDay}/day
          </p>

          <div className="flex gap-2">
            <button
              onClick={onDetails}
              className="px-3 py-2 text-sm border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all duration-300"
            >
              Details
            </button>

            <button
              onClick={car.available ? onBook : null}
              disabled={!car.available}
              className={`px-4 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 text-sm ${
                car.available
                  ? 'bg-primary hover:bg-primary-hover text-white hover:shadow-primary/50'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {car.available ? 'Rent Now' : 'Booked'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowseCars;
