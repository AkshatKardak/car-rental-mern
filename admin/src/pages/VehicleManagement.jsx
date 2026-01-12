import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const VehicleManagement = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-full bg-dashboard-gradient overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header />
        <ContentArea />
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
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '#' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 glass-panel border-r border-white/5 z-20 h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img
          src={logo}
          alt="RentRide Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
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
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            System
          </p>
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

      {/* User Profile */}
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

const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between px-8 py-4 backdrop-blur-sm z-10 border-b border-white/5">
      {/* Mobile Menu */}
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg font-bold text-white">RentRide</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">garage_home</span>
        <h1 className="text-white text-2xl font-black leading-tight tracking-tight">Vehicle Management</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#13c8ec]"></span>
        </button>
      </div>
    </header>
  )
}

const ContentArea = () => {
  const stats = [
    { label: 'Total Fleet', value: '48', icon: 'directions_car', iconColor: 'primary', trend: '+2 this month', trendIcon: 'trending_up' },
    { label: 'Rented Out', value: '15', icon: 'key', iconColor: 'accent-purple', trend: '+12% usage rate', trendIcon: 'trending_up' },
    { label: 'In Maintenance', value: '3', icon: 'build', iconColor: 'orange', trend: 'Needs attention', trendIcon: 'info' },
  ]

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Tesla Model S',
      vin: '...8932',
      category: 'Electric',
      categoryColor: 'blue',
      price: '$150.00',
      status: 'Available',
      statusColor: 'primary',
      image: 'https://i.pravatar.cc/150?img=51'
    },
    {
      id: 2,
      name: 'Porsche 911',
      vin: '...4421',
      category: 'Sports',
      categoryColor: 'purple',
      price: '$300.00',
      status: 'Maintenance',
      statusColor: 'orange',
      image: 'https://i.pravatar.cc/150?img=52'
    },
    {
      id: 3,
      name: 'Range Rover Sport',
      vin: '...1102',
      category: 'SUV',
      categoryColor: 'emerald',
      price: '$220.00',
      status: 'Rented',
      statusColor: 'slate',
      image: 'https://i.pravatar.cc/150?img=53'
    },
    {
      id: 4,
      name: 'Mercedes S-Class',
      vin: '...9921',
      category: 'Luxury',
      categoryColor: 'amber',
      price: '$280.00',
      status: 'Available',
      statusColor: 'primary',
      image: 'https://i.pravatar.cc/150?img=54'
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    category: 'Sports',
    price: '',
    status: 'Available',
    features: ['GPS', 'Bluetooth']
  })

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vin.includes(searchQuery) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterCategory === 'all' ||
      vehicle.category.toLowerCase() === filterCategory.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.price) {
      alert('Please fill in all required fields!')
      return
    }

    const vehicle = {
      id: vehicles.length + 1,
      name: newVehicle.name,
      vin: `...${Math.floor(Math.random() * 9000) + 1000}`,
      category: newVehicle.category,
      categoryColor: newVehicle.category === 'Sports' ? 'purple' : newVehicle.category === 'Luxury' ? 'amber' : newVehicle.category === 'Electric' ? 'blue' : 'emerald',
      price: newVehicle.price,
      status: newVehicle.status,
      statusColor: newVehicle.status === 'Available' ? 'primary' : newVehicle.status === 'Rented' ? 'slate' : 'orange',
      image: `https://i.pravatar.cc/150?img=${50 + vehicles.length}`
    }

    setVehicles([...vehicles, vehicle])
    setShowAddModal(false)
    setNewVehicle({ name: '', category: 'Sports', price: '', status: 'Available', features: ['GPS', 'Bluetooth'] })
    alert('Vehicle added successfully!')
  }

  const handleDeleteVehicle = (vehicleId) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== vehicleId))
      alert('Vehicle deleted successfully!')
    }
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle)
    setNewVehicle({
      name: vehicle.name,
      category: vehicle.category,
      price: vehicle.price,
      status: vehicle.status,
      features: ['GPS', 'Bluetooth']
    })
    setShowAddModal(true)
  }

  const handleUpdateVehicle = () => {
    if (!newVehicle.name || !newVehicle.price) {
      alert('Please fill in all required fields!')
      return
    }

    setVehicles(vehicles.map(v => 
      v.id === editingVehicle.id 
        ? {
            ...v,
            name: newVehicle.name,
            category: newVehicle.category,
            categoryColor: newVehicle.category === 'Sports' ? 'purple' : newVehicle.category === 'Luxury' ? 'amber' : newVehicle.category === 'Electric' ? 'blue' : 'emerald',
            price: newVehicle.price,
            status: newVehicle.status,
            statusColor: newVehicle.status === 'Available' ? 'primary' : newVehicle.status === 'Rented' ? 'slate' : 'orange'
          }
        : v
    ))
    setShowAddModal(false)
    setEditingVehicle(null)
    setNewVehicle({ name: '', category: 'Sports', price: '', status: 'Available', features: ['GPS', 'Bluetooth'] })
    alert('Vehicle updated successfully!')
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-primary/30"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-symbols-outlined text-${stat.iconColor} text-4xl`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-white text-3xl font-bold tracking-tight mb-2">{stat.value}</p>
              <div className={`flex items-center gap-1 text-${stat.iconColor === 'orange' ? 'orange-500' : stat.iconColor} text-sm font-medium`}>
                <span className="material-symbols-outlined text-base">{stat.trendIcon}</span>
                <span>{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Table Section */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 glass-panel p-4 rounded-xl">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                  placeholder="Search by model, make, or VIN..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <button 
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterCategory === 'all'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-transparent hover:border-slate-600'
                  }`}
                >
                  All Vehicles
                </button>
                <button 
                  onClick={() => setFilterCategory('luxury')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterCategory === 'luxury'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-transparent hover:border-slate-600'
                  }`}
                >
                  Luxury
                </button>
                <button 
                  onClick={() => setFilterCategory('sports')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterCategory === 'sports'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-transparent hover:border-slate-600'
                  }`}
                >
                  Sports
                </button>
                <button 
                  onClick={() => setFilterCategory('electric')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterCategory === 'electric'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-transparent hover:border-slate-600'
                  }`}
                >
                  Electric
                </button>
              </div>
            </div>

            {/* Add Vehicle Button (Mobile) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowAddModal(true); setEditingVehicle(null); }}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-primary text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:shadow-[0_0_30px_rgba(19,200,236,0.6)]"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add New Vehicle
            </motion.button>

            {/* Data Table */}
            <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/30 text-xs uppercase text-slate-400 tracking-wider">
                      <th className="p-4 font-semibold">Vehicle</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price / Day</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    <AnimatePresence>
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle, index) => (
                          <motion.tr
                            key={vehicle.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="group hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-10 rounded-lg bg-slate-800 overflow-hidden border border-white/10">
                                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-600">directions_car</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-white">{vehicle.name}</p>
                                  <p className="text-xs text-slate-500">VIN: {vehicle.vin}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${vehicle.categoryColor}-500/10 text-${vehicle.categoryColor}-400 border border-${vehicle.categoryColor}-500/20`}>
                                {vehicle.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-300 font-medium">{vehicle.price}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${vehicle.statusColor === 'primary' ? 'bg-primary shadow-[0_0_8px_rgba(19,200,236,0.6)]' : vehicle.statusColor === 'orange' ? 'bg-orange-500' : 'bg-slate-500'}`}></span>
                                <span className={`font-medium ${vehicle.statusColor === 'primary' ? 'text-primary' : vehicle.statusColor === 'orange' ? 'text-orange-400' : 'text-slate-400'}`}>{vehicle.status}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditVehicle(vehicle)}
                                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                  <span className="material-symbols-outlined text-[20px]">edit</span>
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteVehicle(vehicle.id)}
                                  className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                >
                                  <span className="material-symbols-outlined text-[20px]">delete</span>
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-400">
                            No vehicles found
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-400">Showing 1-{filteredVehicles.length} of {vehicles.length}</p>
                <div className="flex gap-2">
                  <button className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-50">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel (Desktop Only) */}
          <div className="hidden xl:block w-96 shrink-0 glass-panel rounded-xl border border-white/10 flex-col shadow-2xl">
            <VehicleForm 
              vehicle={newVehicle}
              setVehicle={setNewVehicle}
              onSave={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
              onCancel={() => {
                setNewVehicle({ name: '', category: 'Sports', price: '', status: 'Available', features: ['GPS', 'Bluetooth'] })
                setEditingVehicle(null)
              }}
              isEditing={!!editingVehicle}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Vehicle Modal (Mobile/Tablet) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <VehicleForm 
                vehicle={newVehicle}
                setVehicle={setNewVehicle}
                onSave={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
                onCancel={() => {
                  setShowAddModal(false)
                  setNewVehicle({ name: '', category: 'Sports', price: '', status: 'Available', features: ['GPS', 'Bluetooth'] })
                  setEditingVehicle(null)
                }}
                isEditing={!!editingVehicle}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const VehicleForm = ({ vehicle, setVehicle, onSave, onCancel, isEditing }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-slate-900/40">
        <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
        <p className="text-xs text-slate-400 mt-1">Enter vehicle details to {isEditing ? 'update' : 'add to'} fleet.</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Image Upload */}
        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-slate-800/50 transition-all group">
          <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-primary transition-colors">cloud_upload</span>
          <p className="text-xs text-slate-400 mt-2 font-medium">Click to upload image</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="group">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Vehicle Name *</label>
            <input 
              className="w-full bg-slate-900/50 border-b border-slate-700 focus:border-primary text-white px-0 py-2 placeholder-slate-600 focus:outline-none transition-colors text-sm font-medium" 
              type="text"
              placeholder="e.g., BMW i8 Roadster"
              value={vehicle.name}
              onChange={(e) => setVehicle({ ...vehicle, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Category</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900/50 border-b border-slate-700 focus:border-primary text-white px-0 py-2 pr-8 text-sm focus:outline-none appearance-none cursor-pointer"
                  value={vehicle.category}
                  onChange={(e) => setVehicle({ ...vehicle, category: e.target.value })}
                >
                  <option>Sports</option>
                  <option>Luxury</option>
                  <option>SUV</option>
                  <option>Electric</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-2 text-slate-500 pointer-events-none text-sm">expand_more</span>
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Price / Day *</label>
              <input 
                className="w-full bg-slate-900/50 border-b border-slate-700 focus:border-primary text-white px-0 py-2 text-sm focus:outline-none" 
                type="text"
                placeholder="$350"
                value={vehicle.price}
                onChange={(e) => setVehicle({ ...vehicle, price: e.target.value })}
              />
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Status</label>
            <div className="flex gap-2 mt-2">
              <label className="cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="status" 
                  type="radio"
                  checked={vehicle.status === 'Available'}
                  onChange={() => setVehicle({ ...vehicle, status: 'Available' })}
                />
                <div className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border-primary transition-all">Available</div>
              </label>
              <label className="cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="status" 
                  type="radio"
                  checked={vehicle.status === 'Rented'}
                  onChange={() => setVehicle({ ...vehicle, status: 'Rented' })}
                />
                <div className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 peer-checked:bg-slate-500/20 peer-checked:text-slate-300 peer-checked:border-slate-500 transition-all">Rented</div>
              </label>
              <label className="cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="status" 
                  type="radio"
                  checked={vehicle.status === 'Maintenance'}
                  onChange={() => setVehicle({ ...vehicle, status: 'Maintenance' })}
                />
                <div className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 peer-checked:bg-orange-500/20 peer-checked:text-orange-500 peer-checked:border-orange-500 transition-all">Maint.</div>
              </label>
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Features</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {vehicle.features.map((feature, index) => (
                <span key={index} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 flex items-center gap-1">
                  {feature}
                  <button 
                    onClick={() => setVehicle({ ...vehicle, features: vehicle.features.filter((_, i) => i !== index) })}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button 
                onClick={() => {
                  const newFeature = prompt('Enter feature name:')
                  if (newFeature) setVehicle({ ...vehicle, features: [...vehicle.features, newFeature] })
                }}
                className="px-2 py-1 rounded border border-dashed border-slate-600 text-xs text-slate-500 hover:text-white hover:border-slate-400 transition-colors"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-white/5 bg-slate-900/40 flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={onSave}
          className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent-purple to-primary text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:opacity-90 transition-all"
        >
          {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
        </button>
      </div>
    </div>
  )
}

export default VehicleManagement
