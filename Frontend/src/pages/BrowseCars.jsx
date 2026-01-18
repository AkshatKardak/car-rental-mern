import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Users, 
  Fuel, 
  Gauge,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  Loader2
} from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { carService } from '../services/carService';

const BrowseCars = () => {
  const navigate = useNavigate();

  // State for cars data
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedFuelType, setSelectedFuelType] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('featured');

  // Available filter options (will be populated from backend data)
  const [brands, setBrands] = useState(['All']);
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const seatOptions = ['All', '2', '4', '5', '7', '8'];

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [cars, searchQuery, selectedBrand, selectedFuelType, selectedTransmission, priceRange, selectedSeats, sortBy]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await carService.getAllCars({
        status: 'Available', // Only fetch available cars
      });

      if (response.success && response.data) {
        setCars(response.data);
        setFilteredCars(response.data);

        // Extract unique brands from the data
        const uniqueBrands = ['All', ...new Set(response.data.map(car => car.brand))];
        setBrands(uniqueBrands);

        // Set initial price range based on data
        const prices = response.data.map(car => car.pricePerDay);
        const maxPrice = Math.max(...prices, 10000);
        setPriceRange([0, maxPrice]);
      } else {
        setError('Failed to load cars');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err.message || 'Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car => 
        car.name?.toLowerCase().includes(query) ||
        car.brand?.toLowerCase().includes(query) ||
        car.model?.toLowerCase().includes(query) ||
        car.description?.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    // Fuel type filter
    if (selectedFuelType !== 'All') {
      filtered = filtered.filter(car => car.fuelType === selectedFuelType);
    }

    // Transmission filter
    if (selectedTransmission !== 'All') {
      filtered = filtered.filter(car => car.transmission === selectedTransmission);
    }

    // Price range filter
    filtered = filtered.filter(car => 
      car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]
    );

    // Seats filter
    if (selectedSeats !== 'All') {
      filtered = filtered.filter(car => car.seats === parseInt(selectedSeats));
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredCars(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedFuelType('All');
    setSelectedTransmission('All');
    setSelectedSeats('All');
    const prices = cars.map(car => car.pricePerDay);
    const maxPrice = Math.max(...prices, 10000);
    setPriceRange([0, maxPrice]);
    setSortBy('featured');
  };

  const handleViewDetails = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleBookNow = (car) => {
    navigate('/payment', {
      state: {
        carId: car._id,
        carName: `${car.brand} ${car.model}`,
        pricePerDay: car.pricePerDay,
        baseFare: car.pricePerDay * 2, // Default 2 days
        days: 2,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#1a0f2e] text-white">
      <DashboardNavbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Browse Cars
          </h1>
          <p className="text-slate-400 text-lg">
            Find your perfect ride from our premium collection
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/20 transition-all min-w-[140px]"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-semibold">Filters</span>
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedBrand !== 'All' || selectedFuelType !== 'All' || selectedTransmission !== 'All' || selectedSeats !== 'All' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">Active filters:</span>
              {searchQuery && (
                <FilterChip label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery('')} />
              )}
              {selectedBrand !== 'All' && (
                <FilterChip label={`Brand: ${selectedBrand}`} onRemove={() => setSelectedBrand('All')} />
              )}
              {selectedFuelType !== 'All' && (
                <FilterChip label={`Fuel: ${selectedFuelType}`} onRemove={() => setSelectedFuelType('All')} />
              )}
              {selectedTransmission !== 'All' && (
                <FilterChip label={`Transmission: ${selectedTransmission}`} onRemove={() => setSelectedTransmission('All')} />
              )}
              {selectedSeats !== 'All' && (
                <FilterChip label={`Seats: ${selectedSeats}`} onRemove={() => setSelectedSeats('All')} />
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Brand Filter */}
                  <FilterSelect
                    label="Brand"
                    value={selectedBrand}
                    onChange={setSelectedBrand}
                    options={brands}
                  />

                  {/* Fuel Type Filter */}
                  <FilterSelect
                    label="Fuel Type"
                    value={selectedFuelType}
                    onChange={setSelectedFuelType}
                    options={fuelTypes}
                  />

                  {/* Transmission Filter */}
                  <FilterSelect
                    label="Transmission"
                    value={selectedTransmission}
                    onChange={setSelectedTransmission}
                    options={transmissions}
                  />

                  {/* Seats Filter */}
                  <FilterSelect
                    label="Seats"
                    value={selectedSeats}
                    onChange={setSelectedSeats}
                    options={seatOptions}
                  />
                </div>

                {/* Price Range Filter */}
                <div className="mt-6">
                  <label className="text-sm font-semibold text-slate-300 mb-3 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]} / day
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(...cars.map(c => c.pricePerDay || 0), 10000)}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-slate-400">
            Showing <span className="text-white font-semibold">{filteredCars.length}</span> of{' '}
            <span className="text-white font-semibold">{cars.length}</span> vehicles
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-slate-400 text-lg">Loading amazing cars for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-rose-400 text-lg font-semibold mb-2">Failed to load cars</p>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchCars}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 text-lg font-semibold mb-2">No cars found</p>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && filteredCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCars.map((car, index) => (
              <CarCard
                key={car._id || index}
                car={car}
                index={index}
                onViewDetails={() => handleViewDetails(car._id)}
                onBookNow={() => handleBookNow(car)}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

// Filter Chip Component
const FilterChip = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-cyan-400/20 rounded-full p-0.5 transition-colors"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

// Filter Select Component
const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-semibold text-slate-300 mb-2 block">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20 transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

// Car Card Component
const CarCard = ({ car, index, onViewDetails, onBookNow }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = 'https://via.placeholder.com/400x300/1e293b/64748b?text=Car+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-xl hover:border-cyan-400/30 transition-all duration-300"
    >
      {/* Car Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        <img
          src={imageError ? defaultImage : (car.images?.[0] || defaultImage)}
          alt={car.name || 'Car'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-500/90 backdrop-blur-sm text-slate-900 text-xs font-bold">
            Featured
          </div>
        )}

        {/* Rating Badge */}
        {car.rating && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm font-bold">{car.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Car Details */}
      <div className="p-6">
        {/* Brand & Model */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            {car.brand || 'Brand'}
          </p>
          <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
            {car.model || car.name || 'Car Model'}
          </h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">{car.seats || 4} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Fuel className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-xs">{car.fuelType || 'Petrol'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Gauge className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-xs">{car.transmission || 'Auto'}</span>
          </div>
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-2 text-slate-400 mb-4 text-sm">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{car.location}</span>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-end justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-slate-500 mb-1">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                ₹{car.pricePerDay || 0}
              </span>
              <span className="text-sm text-slate-500">/day</span>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewDetails}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowseCars;
