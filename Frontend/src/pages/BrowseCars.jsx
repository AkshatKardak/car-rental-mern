import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Users, Fuel, Gauge, AlertCircle, SlidersHorizontal, X } from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { carService } from '../services/carService';

// Import all car images from assets
import heroCarImg from '../assets/herocar.png';
import porscheImg from '../assets/porsche.png';
import mercedesImg from '../assets/mercedesg63amg.png';
import kiaImg from '../assets/Kia.png';
import skodaImg from '../assets/skoda.png';
import audiImg from '../assets/AudiElectric.png';
import supraImg from '../assets/supra.png';
import lamboImg from '../assets/lambo.png';
import bugattiImg from '../assets/Bugatti.png';
import rollsImg from '../assets/rolls royce.png';
import nanoImg from '../assets/Nano.png';

const getImageForCar = (car) => {
  if (!car) return heroCarImg;

  if (car.images && car.images.length > 0) {
    const tag = String(car.images[0]).toLowerCase();
    if (tag.includes('nano') || tag.includes('tata')) return nanoImg;
    if (tag.includes('porsche')) return porscheImg;
    if (tag.includes('mercedes')) return mercedesImg;
    if (tag.includes('kia')) return kiaImg;
    if (tag.includes('skoda')) return skodaImg;
    if (tag.includes('audi')) return audiImg;
    if (tag.includes('supra') || tag.includes('toyota')) return supraImg;
    if (tag.includes('lambo')) return lamboImg;
    if (tag.includes('bugatti')) return bugattiImg;
    if (tag.includes('rolls')) return rollsImg;
  }

  const text = `${car.brand || ''} ${car.model || ''}`.toLowerCase();

  if (text.includes('nano') || (text.includes('tata') && text.includes('nano'))) return nanoImg;
  if (text.includes('porsche') || text.includes('911')) return porscheImg;
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

  // Filter states
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic filter options
  const [brands, setBrands] = useState(['All']);
  const [categories, setCategories] = useState(['All']);
  const [transmissions, setTransmissions] = useState(['All']);
  const [fuelTypes, setFuelTypes] = useState(['All']);

  const priceRanges = [
    { label: 'All', value: 'All' },
    { label: 'Under ₹1000', value: '0-1000' },
    { label: '₹1000 - ₹3000', value: '1000-3000' },
    { label: '₹3000 - ₹5000', value: '3000-5000' },
    { label: '₹5000 - ₹10000', value: '5000-10000' },
    { label: 'Above ₹10000', value: '10000-999999' }
  ];

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getAllCars();

      if (response.success && Array.isArray(response.data)) {
        setAllCars(response.data);
        
        // Extract unique filter options
        setBrands(['All', ...new Set(response.data.map(c => c.brand).filter(Boolean))]);
        setCategories(['All', ...new Set(response.data.map(c => c.category).filter(Boolean))]);
        setTransmissions(['All', ...new Set(response.data.map(c => c.transmission).filter(Boolean))]);
        setFuelTypes(['All', ...new Set(response.data.map(c => c.fuelType).filter(Boolean))]);
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

  const filteredCars = useMemo(() => {
    let result = [...allCars];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.brand || '').toLowerCase().includes(q) ||
        (c.model || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (brand !== 'All') {
      result = result.filter(c => c.brand === brand);
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }

    // Transmission filter
    if (transmission !== 'All') {
      result = result.filter(c => c.transmission === transmission);
    }

    // Fuel Type filter
    if (fuelType !== 'All') {
      result = result.filter(c => c.fuelType === fuelType);
    }

    // Price Range filter
    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(c => c.pricePerDay >= min && c.pricePerDay <= max);
    }

    return result;
  }, [allCars, search, brand, category, transmission, fuelType, priceRange]);

  useEffect(() => {
    setDisplayCars(filteredCars);
  }, [filteredCars]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setDisplayCars(filteredCars);
    setShowFilters(false);
  };

  const handleClearAll = () => {
    setSearch('');
    setBrand('All');
    setCategory('All');
    setTransmission('All');
    setPriceRange('All');
    setFuelType('All');
  };

  const activeFiltersCount = [brand, category, transmission, priceRange, fuelType].filter(f => f !== 'All').length;

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">Browse Cars</h1>
          <p className="text-text-secondary text-lg">Choose from our exclusive collection of {displayCars.length} vehicles</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border-light">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 relative"
            >
              <SlidersHorizontal size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAll}
                className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition flex items-center gap-2"
              >
                <X size={20} />
                Clear All
              </button>
            )}
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-border-light mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {priceRanges.map(pr => <option key={pr.value} value={pr.value}>{pr.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-8 py-3 border border-gray-300 font-bold rounded-xl bg-white hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {brand !== 'All' && (
                <FilterTag label={`Brand: ${brand}`} onRemove={() => setBrand('All')} />
              )}
              {category !== 'All' && (
                <FilterTag label={`Category: ${category}`} onRemove={() => setCategory('All')} />
              )}
              {transmission !== 'All' && (
                <FilterTag label={`Transmission: ${transmission}`} onRemove={() => setTransmission('All')} />
              )}
              {fuelType !== 'All' && (
                <FilterTag label={`Fuel: ${fuelType}`} onRemove={() => setFuelType('All')} />
              )}
              {priceRange !== 'All' && (
                <FilterTag 
                  label={`Price: ${priceRanges.find(pr => pr.value === priceRange)?.label}`} 
                  onRemove={() => setPriceRange('All')} 
                />
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : displayCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-gray-600 mb-2">No cars found</p>
            <p className="text-gray-500 mb-4">Try adjusting your filters</p>
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition"
            >
              Clear All Filters
            </button>
          </div>
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

// Filter Tag Component
const FilterTag = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-primary/20 rounded-full p-0.5 transition"
    >
      <X size={14} />
    </button>
  </div>
);

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
