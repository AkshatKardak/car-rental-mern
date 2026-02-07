import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Fuel, Settings, CarFront, Activity, CheckCircle, AlertCircle, RefreshCw, Search, Filter } from 'lucide-react';
import axios from 'axios';

// Assets (Keep existing imports)
import AudiImg from '../assets/AudiElectric.png';
import SkodaImg from '../assets/skoda.png';
import MercedesNormalImg from '../assets/mercedes.png';
import KiaImg from '../assets/Kia.png';
import Supra from '../assets/supra.png';
import Nano from '../assets/Nano.png';
import HondaImg from '../assets/Honda.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const carImages = {
  audi: AudiImg,
  skoda: SkodaImg,
  mercedes: MercedesNormalImg,
  honda: HondaImg,
  kia: KiaImg,
  supra: Supra,
  nano: Nano,
  // Add fallback/default mapping if needed or handle dynamic images from backend
  default: AudiImg
};

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    categoryStats: [],
    fuelStats: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: '',
    imageKey: 'default', // Using key for local assets for now, ideally upload image
    category: 'suv',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    location: 'Main Showroom', // Default
    mileage: 15, // Default
    color: 'White', // Default
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeader();

      // Fetch Cars
      const carsRes = await axios.get(`${API_URL}/cars`); // Public endpoint usually fine, or admin specific
      if (carsRes.data.success) {
        setVehicles(carsRes.data.data);
      } else {
        // Fallback if structure is different
        setVehicles(carsRes.data.cars || []);
      }

      // Fetch Stats
      const statsRes = await axios.get(`${API_URL}/admin/stats/vehicle-analytics`, { headers });
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      // alert('Failed to load vehicle data'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const headers = getAuthHeader();
      // Map friendly image keys to what backend might expect or keep as string
      // Ideally backend handles file upload, but we'll send the key for now if schema allows string
      const payload = {
        ...formData,
        // Ensure numbers are numbers
        year: Number(formData.year),
        pricePerDay: Number(formData.pricePerDay),
        seats: Number(formData.seats),
        mileage: Number(formData.mileage),
        // Add required fields by schema if missing
        features: ['AC', 'Bluetooth', 'GPS'], // Defaults
        images: [formData.imageKey] // Storing the key in images array for simplicity with this UI
      };

      await axios.post(`${API_URL}/cars`, payload, { headers });

      alert('Vehicle Added Successfully!');
      setIsModalOpen(false);
      fetchData(); // Refresh list

      // Reset form
      setFormData({
        name: '', brand: '', model: '', year: new Date().getFullYear(),
        pricePerDay: '', imageKey: 'default', category: 'suv',
        fuelType: 'petrol', transmission: 'automatic', seats: 5,
        location: 'Main Showroom', mileage: 15, color: 'White', description: ''
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this car? This cannot be undone.')) {
      try {
        const headers = getAuthHeader();
        await axios.delete(`${API_URL}/cars/${id}`, { headers });
        alert('Vehicle deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle. It might have active bookings.');
      }
    }
  };

  const filteredVehicles = vehicles.filter(car => {
    const matchesSearch = (car.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (car.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || car.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Calculate stats for top cards if backend stats fail or just for instant updates locally
  const localTotal = vehicles.length;
  const localAvailable = vehicles.filter(v => v.available).length;
  // Use backend stats if available, else local
  const displayTotal = stats.totalCars || localTotal;
  const displayAvailable = stats.availableCars || localAvailable;
  const displayRented = stats.rentedCars || (localTotal - localAvailable);
  const utilization = displayTotal > 0 ? Math.round((displayRented / displayTotal) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
      <div className="max-w-[1800px] mx-auto space-y-8">

        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              Fleet <span className="text-blue-600 italic">Command</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">Manage your vehicle inventory and status</p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CarFront size={24} /></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Fleet</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{displayTotal}</h3>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Vehicles in system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle size={24} /></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Available</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{displayAvailable}</h3>
            <p className="text-xs font-bold text-green-600 mt-1 uppercase">Ready to book</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Activity size={24} /></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">On Trip</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{displayRented}</h3>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${utilization}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase text-right">{utilization}% Utilization</p>
          </motion.div>

          {/* Add Car Button (Large) */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 p-6 rounded-3xl border border-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all group flex flex-col items-center justify-center text-white"
          >
            <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <span className="font-black uppercase tracking-widest">Add New Vehicle</span>
          </motion.button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full md:w-auto bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
            <Search size={18} className="text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand or name..."
              className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 placeholder-gray-400 w-full"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['all', 'suv', 'sedan', 'luxury', 'sports', 'electric'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${filterCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((car) => (
                  <motion.div
                    key={car._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md ${car.available
                          ? 'bg-green-500/10 text-green-600 border border-green-200'
                          : 'bg-gray-900/10 text-gray-900 border border-gray-200'
                        }`}>
                        {car.available ? 'Available' : 'Rented'}
                      </span>
                    </div>

                    <div className="h-44 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-[1.5rem] mb-5 relative group-hover:from-blue-50/50 transition-colors">
                      <img
                        src={carImages[car.images?.[0]] || carImages[car.imageKey] || carImages.default}
                        alt={car.name}
                        className="max-h-[85%] max-w-[90%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                        onError={(e) => { e.target.src = carImages.default; }}
                      />
                    </div>

                    <div className="space-y-1 mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{car.brand}</p>
                      <h3 className="font-black text-xl text-gray-900 leading-tight">{car.name} <span className="text-gray-400 font-medium text-sm ml-1">{car.model}</span></h3>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <span className="bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg flex gap-1.5 items-center text-[10px] font-bold text-gray-500 uppercase">
                        <Fuel size={10} /> {car.fuelType}
                      </span>
                      <span className="bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg flex gap-1.5 items-center text-[10px] font-bold text-gray-500 uppercase">
                        <Settings size={10} /> {car.transmission}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="font-black text-xl text-gray-900">₹{car.pricePerDay.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">/ day</span>
                      </div>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Vehicle"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                  <CarFront size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-bold">No vehicles found</p>
                  <p className="text-sm">Try distinct search terms or clearing filters</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Add Car Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Add Vehicle</h2>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Expand your fleet</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand</label>
                    <input placeholder="e.g. Audi" className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Name</label>
                    <input placeholder="e.g. e-tron GT" className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Model / Trim</label>
                    <input placeholder="e.g. RS" className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Year</label>
                    <input type="number" className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price Per Day (₹)</label>
                    <input type="number" className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none" value={formData.pricePerDay} onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                      <option value="suv">SUV</option>
                      <option value="sedan">Sedan</option>
                      <option value="luxury">Luxury</option>
                      <option value="sports">Sports</option>
                      <option value="electric">Electric</option>
                      <option value="hatchback">Hatchback</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fuel Type</label>
                    <select className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none appearance-none" value={formData.fuelType} onChange={e => setFormData({ ...formData, fuelType: e.target.value })}>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image Preset</label>
                    <select className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl font-bold transition-all outline-none appearance-none" value={formData.imageKey} onChange={e => setFormData({ ...formData, imageKey: e.target.value })}>
                      <option value="audi">Audi</option>
                      <option value="skoda">Skoda</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="kia">Kia</option>
                      <option value="supra">Supra</option>
                      <option value="nano">Nano</option>
                      <option value="honda">Honda</option>
                      <option value="default">Default</option>
                    </select>
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" /> : <Plus />}
                  {isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle to Fleet'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleManagement;
