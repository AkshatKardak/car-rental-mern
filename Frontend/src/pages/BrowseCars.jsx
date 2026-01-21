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
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <DashboardNavbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">
            Browse Cars
          </h1>
          <p className="text-text-secondary text-lg">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search by name, brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-border-light text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-white border border-border-light text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border font-semibold transition-all min-w-[140px] ${showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-primary border-primary hover:bg-background-secondary'
                }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedBrand !== 'All' || selectedFuelType !== 'All' || selectedTransmission !== 'All' || selectedSeats !== 'All' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-secondary">Active filters:</span>
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
                className="text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
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
              <div className="rounded-2xl bg-white border border-border-light p-6 shadow-sm">
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
                  <label className="text-sm font-semibold text-text-primary mb-3 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]} / day
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(...cars.map(c => c.pricePerDay || 0), 10000)}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary"
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
          <p className="text-text-secondary">
            Showing <span className="text-text-primary font-semibold">{filteredCars.length}</span> of{' '}
            <span className="text-text-primary font-semibold">{cars.length}</span> vehicles
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-text-secondary text-lg">Loading amazing cars for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-500 text-lg font-semibold mb-2">Failed to load cars</p>
            <p className="text-text-secondary mb-6">{error}</p>
            <button
              onClick={fetchCars}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-background-secondary border border-border-light flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-text-primary text-lg font-semibold mb-2">No cars found</p>
            <p className="text-text-secondary mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-xl bg-white border border-border-light text-text-primary font-semibold hover:bg-background-secondary transition-colors"
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
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

// Filter Select Component
const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-semibold text-text-primary mb-2 block">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white border border-border-light text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
    </div>
  </div>
);

// Car Card Component
const CarCard = ({ car, index, onViewDetails, onBookNow }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = 'https://via.placeholder.com/400x300/f1f1f1/999999?text=Car+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group rounded-2xl bg-white border border-border-light overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Car Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background-secondary">
        <img
          src={imageError ? defaultImage : (car.images?.[0] || defaultImage)}
          alt={car.name || 'Car'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow-sm">
            Featured
          </div>
        )}

        {/* Rating Badge */}
        {car.rating && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-text-primary text-sm font-bold">{car.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-6">
        {/* Brand & Model */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            {car.brand || 'Brand'}
          </p>
          <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
            {car.model || car.name || 'Car Model'}
          </h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm">{car.seats || 4} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-sm text-xs">{car.fuelType || 'Petrol'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm text-xs">{car.transmission || 'Auto'}</span>
          </div>
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-2 text-text-secondary mb-4 text-sm">
            <MapPin className="w-4 h-4 text-text-secondary" />
            <span>{car.location}</span>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-end justify-between pt-4 border-t border-border-light">
          <div>
            <p className="text-xs text-text-secondary mb-1">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                ₹{car.pricePerDay || 0}
              </span>
              <span className="text-sm text-text-secondary">/day</span>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewDetails}
              className="px-4 py-2 rounded-lg bg-white border border-border-light text-text-primary text-sm font-semibold hover:bg-background-secondary transition-colors"
            >
              Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
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
