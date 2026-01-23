import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  CarFront,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Layers,
  IndianRupee,
  Users,
  Fuel,
  Settings2,
  Info,
  Power,
  Trash2,
  X,
  LayoutDashboard,
  Users as UsersIcon,
  CreditCard,
  CalendarDays,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Bell,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react'
import adminApi from '../services/adminApi'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAssetPicker, setShowAssetPicker] = useState(false)
  const [formData, setFormData] = useState({
    name: '', brand: '', model: '', year: '', category: 'Sedan',
    price: '', seats: '', transmission: 'Automatic', fuelType: 'Petrol',
    color: '', plateNumber: '', mileage: '', images: '', features: '',
    description: '', available: true, location: ''
  })

  const availableAssets = [
    { name: 'Porsche', path: '/src/assets/porsche.png' },
    { name: 'Lamborghini', path: '/src/assets/lambo.png' },
    { name: 'Bugatti', path: '/src/assets/Bugatti.png' },
    { name: 'Mercedes G63', path: '/src/assets/mercedes g63 amg.png' },
    { name: 'Mercedes', path: '/src/assets/mercedes.png' },
    { name: 'Kia', path: '/src/assets/Kia.png' },
    { name: 'Skoda', path: '/src/assets/skoda.png' },
    { name: 'Supra', path: '/src/assets/supra.png' },
    { name: 'Rolls Royce', path: '/src/assets/rolls royce.png' },
    { name: 'Audi Electric', path: '/src/assets/AudiElectric.png' },
    { name: 'Luxury White', path: '/src/assets/luxury.png' },
    { name: 'Black Car', path: '/src/assets/blackcar.png' },
    { name: 'Blue Car', path: '/src/assets/bluecar.png' },
    { name: 'Hero Car', path: '/src/assets/herocar.png' },
  ]

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await adminApi.get('/cars')
      const data = response.data
      // Backend returns { success, count, data: [] }
      setVehicles(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
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
        pricePerDay: Number(formData.price), // Renamed to match backend
        seats: Number(formData.seats),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        category: formData.category.toLowerCase(), // Backend expects lowercase
        fuelType: formData.fuelType.toLowerCase(), // Backend expects lowercase
        transmission: formData.transmission.toLowerCase(), // Backend expects lowercase
        images: formData.images.split(',').map(img => img.trim()).filter(img => img),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      }

      // Remove the old 'price' field as it's now 'pricePerDay'
      delete vehicleData.price;

      const response = await adminApi.post('/cars', vehicleData)

      if (response.status === 201 || response.status === 200) {
        alert('Vehicle added successfully!')
        setShowAddModal(false)
        fetchVehicles()
        setFormData({
          name: '', brand: '', model: '', year: '', category: 'Sedan',
          price: '', seats: '', transmission: 'Automatic', fuelType: 'Petrol',
          color: '', plateNumber: '', mileage: '', images: '', features: '',
          description: '', available: true, location: ''
        })
      } else {
        alert(`Failed to add vehicle: ${response.data.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Error adding vehicle: ' + error.message)
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    try {
      const response = await adminApi.delete(`/cars/${vehicleId}`)
      if (response.status === 200) {
        alert('Vehicle deleted successfully!')
        fetchVehicles()
      } else {
        alert(`Failed to delete: ${response.data.message || 'Unauthorized'}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Delete failed: ' + (error.response?.data?.message || error.message))
    }
  }

  const toggleAvailability = async (vehicleId, currentStatus) => {
    try {
      const response = await adminApi.put(`/cars/${vehicleId}`, { available: !currentStatus })
      if (response.status === 200) {
        alert('Vehicle availability updated!')
        fetchVehicles()
      } else {
        alert(`Update failed: ${response.data.message || 'Unauthorized'}`)
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Update failed: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'available' && vehicle.available) || (filterStatus === 'unavailable' && !vehicle.available)
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
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea
          vehicles={vehicles} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          filteredVehicles={filteredVehicles} stats={stats} setSelectedVehicle={setSelectedVehicle}
          setShowModal={setShowModal} selectedVehicle={selectedVehicle} showModal={showModal}
          setShowAddModal={setShowAddModal} showAddModal={showAddModal} formData={formData} setFormData={setFormData}
          handleAddVehicle={handleAddVehicle} handleDeleteVehicle={handleDeleteVehicle} toggleAvailability={toggleAvailability}
          showAssetPicker={showAssetPicker} setShowAssetPicker={setShowAssetPicker} availableAssets={availableAssets}
        />
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl">
              <div className="p-6 flex items-center justify-between border-b border-border-light">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <SidebarContent navigate={navigate} closeMobile={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const Sidebar = ({ navigate }) => (
  <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border-light z-20 h-full shadow-xl shadow-black/5">
    <div className="p-8 pb-10 flex items-center justify-center">
      <img src={logo} alt="RentRide Logo" className="h-9 w-auto object-contain" />
    </div>
    <SidebarContent navigate={navigate} />
  </aside>
)

const SidebarContent = ({ navigate, closeMobile }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: <UsersIcon size={20} />, label: 'User Management', active: false, path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicles', active: true, path: '/admin/vehicles' },
    { icon: <CreditCard size={20} />, label: 'Payments', active: false, path: '/admin/payments' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', active: false, path: '/admin/bookings' },
  ]

  const handleNav = (path) => {
    navigate(path)
    if (closeMobile) closeMobile()
  }

  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex-1 flex flex-col gap-1 px-4 py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNav(item.path)}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={item.active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}>{item.icon}</span>
            <span className={`text-sm font-black tracking-tight ${item.active ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
          </button>
        ))}
        <div className="pt-6 mt-6 border-t border-border-light">
          <p className="px-5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">System</p>
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-all">
            <Settings size={20} />
            <span className="text-sm font-black tracking-tight opacity-80">Settings</span>
          </button>
        </div>
      </nav>
      <div className="p-5 border-t border-border-light bg-background-secondary/30">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-border-light shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">AM</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-primary truncate">Admin</p>
            <p className="text-[10px] text-text-secondary font-bold truncate opacity-60 uppercase">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Header = ({ setSidebarOpen }) => (
  <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-background-secondary rounded-xl hover:bg-border-light transition-colors"><Menu size={20} /></button>
      <div className="hidden md:flex items-center gap-3 text-xs font-black tracking-widest uppercase text-text-secondary/60">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <ChevronRight size={12} />
        <span className="text-text-primary">Inventory Management</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light bg-white text-text-secondary hover:bg-background-secondary hover:text-primary transition-all shadow-sm">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
      </button>
    </div>
  </header>
)

const ContentArea = ({
  vehicles, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus,
  filterCategory, setFilterCategory, filteredVehicles, stats,
  setSelectedVehicle, setShowModal, selectedVehicle, showModal,
  setShowAddModal, showAddModal, formData, setFormData, handleAddVehicle,
  handleDeleteVehicle, toggleAvailability,
  showAssetPicker, setShowAssetPicker, availableAssets
}) => {
  const categories = ['all', ...new Set(vehicles.map(v => v.category))]

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Title Bar */}
        <motion.header initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Fleet <span className="text-primary italic">Inventory</span></h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">Full control over your vehicle ecosystem and live status.</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover uppercase tracking-widest">
            <Plus size={20} />
            <span>Add Vehicle</span>
          </motion.button>
        </motion.header>

        {/* Analytics Mini-Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Total Fleet', value: stats.total, icon: <CarFront size={20} />, color: 'primary' },
            { label: 'Available', value: stats.available, icon: <CheckCircle2 size={20} />, color: 'green-600' },
            { label: 'In Use', value: stats.unavailable, icon: <XCircle size={20} />, color: 'orange-500' },
            { label: 'Categories', value: stats.categories, icon: <Layers size={20} />, color: 'indigo-500' },
            { label: 'Daily Avg', value: `₹${stats.avgPrice.toLocaleString()}`, icon: <IndianRupee size={20} />, color: 'primary' }
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-6 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-background-secondary text-${stat.color} group-hover:bg-primary/10 transition-colors`}>{stat.icon}</div>
              </div>
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{stat.label}</p>
              <span className={`text-2xl font-black text-text-primary tracking-tight`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Controls Hook */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[32px] p-8 border border-border-light shadow-2xl shadow-black/5 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
            <input type="text" placeholder="Search by name, brand, or plate..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-background-secondary/50 border border-border-light text-sm font-bold text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
          </div>
          <div className="flex gap-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
              <option value="all">Status: All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'Type: All' : cat}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div key={vehicle._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-[40px] overflow-hidden border border-border-light hover:border-primary/50 transition-all duration-500 flex flex-col shadow-xl hover:shadow-2xl group">
                <div className="relative h-64 overflow-hidden bg-background-secondary">
                  {vehicle.images?.[0] ? <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><CarFront size={80} /></div>}
                  <div className="absolute top-6 right-6">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${vehicle.available ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>{vehicle.available ? 'Live' : 'Maintenance'}</span>
                  </div>
                </div>
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase group-hover:text-primary transition-colors">{vehicle.name}</h3>
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">{vehicle.brand} • {vehicle.model} • {vehicle.year}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-y border-border-light/50 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <Users size={16} className="text-primary opacity-40" />
                      <span className="text-[10px] font-black text-text-primary opacity-80 uppercase tracking-tighter">{vehicle.seats} PRS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-border-light/50">
                      <Settings2 size={16} className="text-primary opacity-40" />
                      <span className="text-[10px] font-black text-text-primary opacity-80 uppercase tracking-tighter">{vehicle.transmission.substring(0, 3)}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Fuel size={16} className="text-primary opacity-40" />
                      <span className="text-[10px] font-black text-text-primary opacity-80 uppercase tracking-tighter">{vehicle.fuelType.substring(0, 3)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-40">Operational Fare</p>
                      <p className="text-2xl font-black text-primary">₹{vehicle.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1 opacity-40">Registry</p>
                      <p className="font-black text-text-primary text-xs uppercase tracking-tight">{vehicle.plateNumber}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setSelectedVehicle(vehicle); setShowModal(true) }} className="flex-1 bg-background-secondary text-text-primary h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-border-light">Details</button>
                    <button onClick={() => toggleAvailability(vehicle._id, vehicle.available)} className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all border ${vehicle.available ? 'bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-500 hover:text-white' : 'bg-green-50 text-green-500 border-green-100 hover:bg-green-500 hover:text-white'}`}><Power size={18} /></button>
                    <button onClick={() => handleDeleteVehicle(vehicle._id)} className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* View Vehicle Modal */}
      <AnimatePresence>
        {showModal && selectedVehicle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[48px] border border-border-light max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-10 border-b border-border-light flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">Vehicle <span className="text-primary italic">Signature</span></h3>
                  <p className="text-text-secondary text-sm font-bold opacity-60 uppercase mt-1 tracking-widest">{selectedVehicle.brand} {selectedVehicle.model} Index</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-background-secondary hover:bg-primary/10 text-text-secondary hover:text-primary transition-all flex items-center justify-center"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="aspect-video rounded-[32px] overflow-hidden bg-background-secondary border border-border-light">
                      {selectedVehicle.images?.[0] ? <img src={selectedVehicle.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><CarFront size={100} /></div>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedVehicle.images?.slice(1, 4).map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border-light bg-background-secondary"><img src={img} className="w-full h-full object-cover" /></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div><p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">Build Year</p><p className="text-xl font-black text-text-primary">{selectedVehicle.year}</p></div>
                      <div><p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">Category</p><p className="text-xl font-black text-text-primary uppercase">{selectedVehicle.category}</p></div>
                      <div><p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">License Plate</p><p className="text-xl font-black text-text-primary uppercase font-mono">{selectedVehicle.plateNumber}</p></div>
                      <div><p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-2">Daily Revenue</p><p className="text-2xl font-black text-primary">₹{selectedVehicle.price.toLocaleString()}</p></div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-background-secondary border border-border-light">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 mb-3">Technical Brief</p>
                      <p className="text-sm font-bold text-text-primary leading-relaxed">{selectedVehicle.description}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">Equipped Modules</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVehicle.features?.map((f, i) => <span key={i} className="px-4 py-2 rounded-xl bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-widest">{f}</span>)}
                      </div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[48px] border border-border-light max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 md:p-10 border-b border-border-light flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">New <span className="text-primary italic">Record</span></h3>
                  <p className="text-text-secondary text-sm font-bold opacity-60 uppercase mt-1 tracking-widest">Registering a new vehicle to the operational fleet.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-2xl bg-background-secondary hover:bg-primary/10 text-text-secondary hover:text-primary transition-all flex items-center justify-center"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddVehicle} className="flex-1 overflow-y-auto p-8 md:p-10 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Asset Full Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. BMW X5 xDrive40i" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Brand Signature</label>
                    <input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. BMW" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Model Index</label>
                    <input type="text" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. X5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Production Year</label>
                    <input type="number" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="2024" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Vessel Type</label>
                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-xs font-black uppercase tracking-widest text-text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all">
                      <option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Luxury">Luxury</option><option value="Sports">Sports</option><option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Daily Operational Fee (INR)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Passenger Capacity</label>
                    <input type="number" required value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Registry Number</label>
                    <input type="text" required value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-mono" placeholder="MH-01-AB-1234" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Current Mileage (km/l)</label>
                    <input type="number" required value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="15" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Vehicle Color</label>
                    <input type="text" required value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. Midnight Black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Operational City/Location</label>
                    <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. Mumbai, Maharashtra" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Key Features (comma separated)</label>
                    <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="e.g. Sunroof, ADAS, 360 Camera" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Telemetry Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full h-32 p-6 rounded-3xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none" placeholder="Provide detailed technical briefing..." />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 ml-1">Vehicle Assets (Manual URL or Local Selection)</label>
                      <button
                        type="button"
                        onClick={() => setShowAssetPicker(!showAssetPicker)}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        {showAssetPicker ? 'Close Picker' : 'Pick from Assets'}
                      </button>
                    </div>

                    {showAssetPicker && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-4 rounded-3xl bg-background-secondary/50 border border-border-light max-h-60 overflow-y-auto no-scrollbar">
                        {availableAssets.map((asset) => (
                          <button
                            key={asset.path}
                            type="button"
                            onClick={() => {
                              const currentImages = formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : [];
                              if (!currentImages.includes(asset.path)) {
                                setFormData({ ...formData, images: [...currentImages, asset.path].join(', ') });
                              }
                            }}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-border-light hover:border-primary transition-all bg-white"
                          >
                            <img src={asset.path} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[8px] font-black text-white uppercase">{asset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary size-5" />
                      <input
                        type="text"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        className="w-full h-14 pl-14 pr-6 rounded-2xl bg-background-secondary border border-border-light text-sm font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        placeholder="Select from picker or paste https://..."
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary/60 font-bold px-2 italic text-center">Tip: Local asset paths start with /src/assets/ and are preferred for standardized models.</p>
                  </div>
                </div>
                <div className="mt-12 flex gap-4">
                  <button type="submit" className="flex-1 h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95">Verify & Add to Fleet</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-10 h-14 bg-background-secondary text-text-secondary rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-border-light">Cancel</button>
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
