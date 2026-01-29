import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Fuel, Settings } from 'lucide-react';

// Existing assets only (from repo)
import AudiImg from '../assets/AudiElectric.png';
import SkodaImg from '../assets/skoda.png';
import MercedesNormalImg from '../assets/mercedes.png'; // use this (avoid cyan g63 image)
import KiaImg from '../assets/Kia.png';
import Supra from '../assets/supra.png';
import Nano from '../assets/Nano.png';
import HondaImg from '../assets/Honda.png';

const carImages = {
  audi: AudiImg,
  skoda: SkodaImg,
  mercedes: MercedesNormalImg, 
  honda:HondaImg,
  kia: KiaImg,
  supra:Supra,
  nano:Nano,
};

const INITIAL_CARS = [
  { _id: '1', name: 'Audi e-tron', brand: 'Audi', model: 'GT RS', year: 2024, pricePerDay: 12000, imageKey: 'audi', category: 'Electric', fuelType: 'Electric', transmission: 'Automatic', seats: 5, available: true },
  { _id: '2', name: 'Skoda Kylaq', brand: 'Skoda', model: 'Style 1.0', year: 2024, pricePerDay: 2500, imageKey: 'skoda', category: 'SUV', fuelType: 'Petrol', transmission: 'Manual', seats: 5, available: true },


  { _id: '3', name: 'Mercedes-Benz G63', brand: 'Mercedes', model: 'AMG', year: 2023, pricePerDay: 25000, imageKey: 'mercedes', category: 'Luxury', fuelType: 'Petrol', transmission: 'Automatic', seats: 5, available: false },

  { _id: '4', name: 'Kia Carens', brand: 'Kia', model: 'Luxury Plus', year: 2023, pricePerDay: 3000, imageKey: 'kia', category: 'MUV', fuelType: 'Diesel', transmission: 'Automatic', seats: 7, available: true },


  { _id: '5', name: 'Toyota Supra', brand: 'Toyota', model: 'Supra', year: 2022, pricePerDay: 9000, imageKey: 'supra', category: 'Sports', fuelType: 'Petrol', transmission: 'Automatic', seats: 2, available: true },

 
  { _id: '6', name: 'Tata Nano', brand: 'Tata', model: 'Nano', year: 2021, pricePerDay: 799, imageKey: 'nano', category: 'Hatchback', fuelType: 'Petrol', transmission: 'Manual', seats: 4, available: true },
];

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState(INITIAL_CARS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: 2024,
    pricePerDay: '',
    imageKey: 'audi',
    category: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCar = { ...formData, _id: Date.now().toString(), available: true };
    setVehicles([...vehicles, newCar]);
    setIsModalOpen(false);
    alert('Vehicle Added (Dummy Mode)');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this car?')) {
      setVehicles(vehicles.filter(v => v._id !== id));
    }
  };

  const filteredVehicles = vehicles.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between md:items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">Vehicle Fleet</h1>

        <div className="flex gap-3 items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vehicles..."
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2"
          >
            <Plus /> Add Car
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((car) => (
          <motion.div
            key={car._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition group"
          >
            <div className="h-40 flex items-center justify-center bg-gray-50 rounded-xl mb-4 relative">
              <img
                src={carImages[car.imageKey] || DefaultImg}
                alt={car.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
              />
              <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase rounded ${car.available ? 'bg-green-100 text-green-700' : 'bg-gray-800 text-white'}`}>
                {car.available ? 'Available' : 'Rented'}
              </span>
            </div>

            <h3 className="font-bold text-lg">{car.name}</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
              {car.brand} • {car.year}
            </p>

            <div className="flex gap-2 text-[10px] font-bold text-gray-600 mb-4">
              <span className="bg-gray-50 border px-2 py-1 rounded flex gap-1 items-center">
                <Fuel size={10} /> {car.fuelType}
              </span>
              <span className="bg-gray-50 border px-2 py-1 rounded flex gap-1 items-center">
                <Settings size={10} /> {car.transmission}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-black text-xl">₹{car.pricePerDay}</span>
              <button
                onClick={() => handleDelete(car._id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Add Car</h2>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Brand"
                  className="w-full p-3 border rounded-xl"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                />
                <input
                  placeholder="Name"
                  className="w-full p-3 border rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  placeholder="Model"
                  className="w-full p-3 border rounded-xl"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price per day"
                  className="w-full p-3 border rounded-xl"
                  value={formData.pricePerDay}
                  onChange={e => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                />

                <select
                  className="w-full p-3 border rounded-xl"
                  value={formData.imageKey}
                  onChange={e => setFormData({ ...formData, imageKey: e.target.value })}
                >
                  <option value="audi">Audi</option>
                  <option value="skoda">Skoda</option>
                  <option value="mercedes">Mercedes (Normal)</option>
                  <option value="kia">Kia</option>
                  <option value="default">Default</option>
                </select>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                  Save (Dummy)
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
