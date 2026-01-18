import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const VehicleManagement = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    category: 'Sedan',
    price: '',
    seats: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: '',
    plateNumber: '',
    mileage: '',
    images: '',
    features: '',
    description: '',
    available: true
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars')
      const data = await response.json()
      setVehicles(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setLoading(false)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    try {
      const vehicleData = {
        ...formData,
        price: Number(formData.price),
        seats: Number(formData.seats),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        images: formData.images.split(',').map(img => img.trim()),
        features: formData.features.split(',').map(f => f.trim())
      }

      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      })

      if (response.ok) {
        alert('Vehicle added successfully!')
        setShowAddModal(false)
        fetchVehicles()
        // Reset form
        setFormData({
          name: '', brand: '', model: '', year: '', category: 'Sedan',
          price: '', seats: '', transmission: 'Automatic', fuelType: 'Petrol',
          color: '', plateNumber: '', mileage: '', images: '', features: '',
          description: '', available: true
        })
      } else {
        alert('Failed to add vehicle')
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Error adding vehicle')
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${vehicleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Vehicle deleted successfully!')
        fetchVehicles()
      } else {
        alert('Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Error deleting vehicle')
    }
  }

  const toggleAvailability = async (vehicleId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus })
      })

      if (response.ok) {
        alert('Vehicle availability updated!')
        fetchVehicles()
      } else {
        alert('Failed to update vehicle')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Error updating vehicle')
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'available' && vehicle.available) ||
      (filterStatus === 'unavailable' && !vehicle.available)
    
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.available).length,
    unavailable: vehicles.filter(v => !v.available).length,
    categories: [...new Set(vehicles.map(v => v.category))].length,
    avgPrice: vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length) : 0
  }

  return (
    <div className="relative flex h-screen w-full bg-dashboard-gradient overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]"></div>
      </div>

      <Sidebar navigate={navigate} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <ContentArea 
          vehicles={vehicles}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filteredVehicles={filteredVehicles}
          stats={stats}
          setSelectedVehicle={setSelectedVehicle}
          setShowModal={setShowModal}
          selectedVehicle={selectedVehicle}
          showModal={showModal}
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
          formData={formData}
          setFormData={setFormData}
          handleAddVehicle={handleAddVehicle}
          handleDeleteVehicle={handleDeleteVehicle}
          toggleAvailability={toggleAvailability}
        />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: true, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', active: false, path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', active: false, path: '/admin/analytics' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 glass-panel border-r border-white/5 z-20 h-full">
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="RentRide Logo" className="h-12 w-auto object-contain" />
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
        {navItems.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 3 }}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group text-left ${
              item.active
                ? 'bg-primary/10 border border-primary/20 text-white shadow-neon'
                : 'hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <span 
              className={`material-symbols-outlined ${
                item.active ? 'text-primary' : 'group-hover:text-primary'
              } transition-colors`}
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}

        <div className="pt-4 mt-2 border-t border-white/5">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">System</p>
          <motion.button
            whileHover={{ x: 3 }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white text-slate-400 transition-all duration-300 group text-left"
          >
            <span 
              className="material-symbols-outlined group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
            >
              settings
            </span>
            <span className="font-medium">Settings</span>
          </motion.button>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-purple to-primary flex items-center justify-center text-white font-bold text-sm">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Morgan</p>
            <p className="text-xs text-slate-400 truncate">Super Admin</p>
          </div>
          <span 
            className="material-symbols-outlined text-slate-400 text-lg"
            style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
          >
            expand_more
          </span>
        </motion.div>
      </div>
    </aside>
  )
}

const ContentArea = ({ 
  vehicles, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus,
  filterCategory, setFilterCategory, filteredVehicles, stats,
  setSelectedVehicle, setShowModal, selectedVehicle, showModal,
  setShowAddModal, showAddModal, formData, setFormData, handleAddVehicle,
  handleDeleteVehicle, toggleAvailability
}) => {
  const categories = ['all', ...new Set(vehicles.map(v => v.category))]

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">VEHICLE MANAGEMENT</h2>
            <p className="text-slate-400 mt-1">Manage your fleet inventory and availability</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent-purple rounded-lg font-semibold text-black hover:shadow-[0_0_20px_rgba(19,200,236,0.5)] transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Add Vehicle
          </motion.button>
        </motion.header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Vehicles', value: stats.total, icon: 'directions_car', color: 'primary' },
            { label: 'Available', value: stats.available, icon: 'check_circle', color: 'green-400' },
            { label: 'Unavailable', value: stats.unavailable, icon: 'cancel', color: 'red-400' },
            { label: 'Categories', value: stats.categories, icon: 'category', color: 'purple-400' },
            { label: 'Avg. Price', value: `₹${stats.avgPrice.toLocaleString()}`, icon: 'payments', color: 'primary' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                <span className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</span>
              </div>
              <span className={`material-symbols-outlined text-${stat.color} text-3xl mt-2`}>{stat.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Vehicles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading vehicles...</div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No vehicles found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-800">
                    {vehicle.images && vehicle.images[0] ? (
                      <img 
                        src={vehicle.images[0]} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 text-6xl">directions_car</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.available 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{vehicle.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{vehicle.brand} • {vehicle.model} • {vehicle.year}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">airline_seat_recline_normal</span>
                        <span className="text-slate-300 text-xs">{vehicle.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">settings</span>
                        <span className="text-slate-300 text-xs">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">local_gas_station</span>
                        <span className="text-slate-300 text-xs">{vehicle.fuelType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-slate-500 text-xs">Price per day</p>
                        <p className="text-primary font-bold text-2xl">₹{vehicle.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-xs">Plate Number</p>
                        <p className="text-white font-mono text-sm">{vehicle.plateNumber}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          setShowModal(true)
                        }}
                        className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-lg transition-all font-medium text-sm"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAvailability(vehicle._id, vehicle.available)}
                        className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                          vehicle.available
                            ? 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black'
                            : 'bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black'
                        }`}
                      >
                        {vehicle.available ? 'Disable' : 'Enable'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* View Vehicle Modal */}
      <AnimatePresence>
        {showModal && selectedVehicle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Vehicle Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-2">
                      {selectedVehicle.images?.map((img, index) => (
                        <img key={index} src={img} alt={`${selectedVehicle.name} ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Vehicle Name</p>
                    <p className="text-white font-bold text-lg">{selectedVehicle.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Brand & Model</p>
                    <p className="text-white font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Year</p>
                    <p className="text-white font-semibold">{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Category</p>
                    <p className="text-white font-semibold">{selectedVehicle.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Price per Day</p>
                    <p className="text-primary font-bold text-2xl">₹{selectedVehicle.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Plate Number</p>
                    <p className="text-white font-mono font-bold">{selectedVehicle.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Seats</p>
                    <p className="text-white font-semibold">{selectedVehicle.seats}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Transmission</p>
                    <p className="text-white font-semibold">{selectedVehicle.transmission}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Fuel Type</p>
                    <p className="text-white font-semibold">{selectedVehicle.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Color</p>
                    <p className="text-white font-semibold">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Mileage</p>
                    <p className="text-white font-semibold">{selectedVehicle.mileage} km/l</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedVehicle.available 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedVehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <div className="col-span-2">
                    <p className="text-slate-400 text-sm mb-1">Description</p>
                    <p className="text-white">{selectedVehicle.description}</p>
                  </div>

                  {/* Features */}
                  <div className="col-span-2">
                    <p className="text-slate-400 text-sm mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVehicle.features?.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Add New Vehicle</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddVehicle} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Vehicle Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tesla Model 3"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Brand*</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tesla"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Model*</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Model 3"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Year*</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Category*</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sports">Sports</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Price per Day*</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Seats*</label>
                    <input
                      type="number"
                      required
                      value={formData.seats}
                      onChange={(e) => setFormData({...formData, seats: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Transmission*</label>
                    <select
                      required
                      value={formData.transmission}
                      onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Fuel Type*</label>
                    <select
                      required
                      value={formData.fuelType}
                      onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Color*</label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="White"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Plate Number*</label>
                    <input
                      type="text"
                      required
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MH-01-AB-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Mileage (km/l)*</label>
                    <input
                      type="number"
                      required
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="15"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">Image URLs (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData({...formData, images: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="GPS, Bluetooth, Sunroof"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter vehicle description..."
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({...formData, available: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label className="text-white">Available for Rent</label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple text-black font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(19,200,236,0.5)] transition-all"
                  >
                    Add Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VehicleManagement
