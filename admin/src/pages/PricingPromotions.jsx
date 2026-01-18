import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PricingPromotions = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minBookingAmount: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    applicableVehicles: [],
    active: true
  })

  // Promotions state
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [carsRes, usersRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/cars'),
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/bookings')
      ])

      const carsData = await carsRes.json()
      const usersData = await usersRes.json()
      const bookingsData = await bookingsRes.json()

      setCars(carsData)
      setUsers(usersData)
      setBookings(bookingsData)

      // Generate sample promotions
      const samplePromotions = [
        {
          _id: 'PROMO001',
          code: 'WELCOME50',
          name: 'Welcome Offer',
          description: 'Get 50% off on your first booking',
          type: 'percentage',
          value: 50,
          minBookingAmount: 5000,
          maxDiscount: 2500,
          validFrom: '2026-01-01T00:00:00Z',
          validTo: '2026-12-31T23:59:59Z',
          usageLimit: 100,
          usedCount: 24,
          applicableVehicles: [],
          active: true,
          createdAt: '2026-01-01T00:00:00Z'
        },
        {
          _id: 'PROMO002',
          code: 'WEEKEND20',
          name: 'Weekend Special',
          description: '20% off on weekend bookings',
          type: 'percentage',
          value: 20,
          minBookingAmount: 3000,
          maxDiscount: 1500,
          validFrom: '2026-01-10T00:00:00Z',
          validTo: '2026-03-31T23:59:59Z',
          usageLimit: 200,
          usedCount: 87,
          applicableVehicles: carsData.slice(0, 5).map(c => c._id),
          active: true,
          createdAt: '2026-01-10T00:00:00Z'
        },
        {
          _id: 'PROMO003',
          code: 'LUXURY1000',
          name: 'Luxury Discount',
          description: 'Flat ₹1000 off on luxury vehicles',
          type: 'fixed',
          value: 1000,
          minBookingAmount: 10000,
          maxDiscount: 1000,
          validFrom: '2026-01-15T00:00:00Z',
          validTo: '2026-02-28T23:59:59Z',
          usageLimit: 50,
          usedCount: 12,
          applicableVehicles: carsData.filter(c => c.category === 'Luxury').map(c => c._id),
          active: true,
          createdAt: '2026-01-15T00:00:00Z'
        },
        {
          _id: 'PROMO004',
          code: 'NEWYEAR2026',
          name: 'New Year Bonanza',
          description: '30% off on all bookings',
          type: 'percentage',
          value: 30,
          minBookingAmount: 4000,
          maxDiscount: 3000,
          validFrom: '2026-01-01T00:00:00Z',
          validTo: '2026-01-15T23:59:59Z',
          usageLimit: 500,
          usedCount: 456,
          applicableVehicles: [],
          active: false,
          createdAt: '2025-12-25T00:00:00Z'
        },
        {
          _id: 'PROMO005',
          code: 'STUDENT15',
          name: 'Student Discount',
          description: '15% off for verified students',
          type: 'percentage',
          value: 15,
          minBookingAmount: 2000,
          maxDiscount: 1000,
          validFrom: '2026-01-01T00:00:00Z',
          validTo: '2026-06-30T23:59:59Z',
          usageLimit: 300,
          usedCount: 45,
          applicableVehicles: [],
          active: true,
          createdAt: '2026-01-01T00:00:00Z'
        },
        {
          _id: 'PROMO006',
          code: 'LONGTERM25',
          name: 'Long Term Rental',
          description: '25% off on bookings over 7 days',
          type: 'percentage',
          value: 25,
          minBookingAmount: 15000,
          maxDiscount: 5000,
          validFrom: '2026-01-01T00:00:00Z',
          validTo: '2026-12-31T23:59:59Z',
          usageLimit: 100,
          usedCount: 18,
          applicableVehicles: [],
          active: true,
          createdAt: '2026-01-05T00:00:00Z'
        }
      ]

      setPromotions(samplePromotions)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleAddPromotion = (e) => {
    e.preventDefault()
    const newPromo = {
      _id: `PROMO${Date.now()}`,
      ...formData,
      value: Number(formData.value),
      minBookingAmount: Number(formData.minBookingAmount),
      maxDiscount: Number(formData.maxDiscount),
      usageLimit: Number(formData.usageLimit),
      usedCount: 0,
      createdAt: new Date().toISOString()
    }
    
    setPromotions([newPromo, ...promotions])
    setShowAddModal(false)
    alert('Promotion added successfully!')
    
    // Reset form
    setFormData({
      code: '', name: '', description: '', type: 'percentage',
      value: '', minBookingAmount: '', maxDiscount: '',
      validFrom: '', validTo: '', usageLimit: '',
      applicableVehicles: [], active: true
    })
  }

  const handleEditPromotion = (e) => {
    e.preventDefault()
    setPromotions(promotions.map(promo =>
      promo._id === selectedPromo._id ? {
        ...promo,
        ...formData,
        value: Number(formData.value),
        minBookingAmount: Number(formData.minBookingAmount),
        maxDiscount: Number(formData.maxDiscount),
        usageLimit: Number(formData.usageLimit)
      } : promo
    ))
    setShowEditModal(false)
    alert('Promotion updated successfully!')
  }

  const handleDeletePromotion = (promoId) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return
    setPromotions(promotions.filter(p => p._id !== promoId))
    alert('Promotion deleted successfully!')
  }

  const togglePromoStatus = (promoId, currentStatus) => {
    setPromotions(promotions.map(promo =>
      promo._id === promoId ? { ...promo, active: !currentStatus } : promo
    ))
    alert(`Promotion ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
  }

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && promo.active) ||
      (statusFilter === 'inactive' && !promo.active)
    
    const matchesType = typeFilter === 'all' || promo.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.active).length,
    inactive: promotions.filter(p => !p.active).length,
    totalUsage: promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0),
    totalDiscountGiven: promotions.reduce((sum, p) => {
      const bookingsWithPromo = bookings.filter(b => b.promoCode === p.code)
      return sum + bookingsWithPromo.length * (p.type === 'fixed' ? p.value : 0)
    }, 0),
    avgDiscountPerPromo: Math.round(promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0) / (promotions.length || 1))
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
          promotions={promotions}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          filteredPromotions={filteredPromotions}
          stats={stats}
          setShowAddModal={setShowAddModal}
          showAddModal={showAddModal}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedPromo={selectedPromo}
          setSelectedPromo={setSelectedPromo}
          formData={formData}
          setFormData={setFormData}
          handleAddPromotion={handleAddPromotion}
          handleEditPromotion={handleEditPromotion}
          handleDeletePromotion={handleDeletePromotion}
          togglePromoStatus={togglePromoStatus}
          cars={cars}
        />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: true, path: '/admin/promotions' },
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
  promotions, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  typeFilter, setTypeFilter, filteredPromotions, stats, setShowAddModal,
  showAddModal, showEditModal, setShowEditModal, selectedPromo, setSelectedPromo,
  formData, setFormData, handleAddPromotion, handleEditPromotion,
  handleDeletePromotion, togglePromoStatus, cars
}) => {
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
            <h2 className="text-3xl font-black text-white tracking-tight">PRICING & PROMOTIONS</h2>
            <p className="text-slate-400 mt-1">Manage discount codes and promotional offers</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent-purple rounded-lg font-semibold text-black hover:shadow-[0_0_20px_rgba(19,200,236,0.5)] transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Create Promotion
          </motion.button>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Promos', value: stats.total, icon: 'local_offer', color: 'primary' },
            { label: 'Active', value: stats.active, icon: 'check_circle', color: 'green-400' },
            { label: 'Inactive', value: stats.inactive, icon: 'cancel', color: 'red-400' },
            { label: 'Total Usage', value: stats.totalUsage, icon: 'trending_up', color: 'blue-400' },
            { label: 'Avg Usage', value: stats.avgDiscountPerPromo, icon: 'analytics', color: 'purple-400' },
            { label: 'Total Saved', value: `₹${stats.totalDiscountGiven.toLocaleString()}`, icon: 'savings', color: 'orange-400' }
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
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </motion.div>

        {/* Promotions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading promotions...</div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No promotions found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPromotions.map((promo, index) => (
                <motion.div
                  key={promo._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-panel rounded-xl p-6 group hover:border-primary/30 transition-all ${
                    !promo.active ? 'opacity-60' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-2xl">local_offer</span>
                        <h3 className="text-xl font-bold text-white">{promo.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-mono font-bold border border-primary/30">
                          {promo.code}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          promo.active 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {promo.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4">{promo.description}</p>

                  {/* Discount Info */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Discount</span>
                      <span className="text-primary font-bold text-2xl">
                        {promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`}
                      </span>
                    </div>
                    {promo.maxDiscount && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-500 text-xs">Max Discount</span>
                        <span className="text-slate-300 text-sm font-semibold">₹{promo.maxDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Min. Booking</p>
                      <p className="text-white font-semibold">₹{promo.minBookingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Usage</p>
                      <p className="text-white font-semibold">{promo.usedCount || 0} / {promo.usageLimit}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 text-xs mb-1">Valid Period</p>
                      <p className="text-white text-xs">
                        {new Date(promo.validFrom).toLocaleDateString('en-IN')} - {new Date(promo.validTo).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Usage Progress</span>
                      <span className="text-slate-400">{Math.round(((promo.usedCount || 0) / promo.usageLimit) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((promo.usedCount || 0) / promo.usageLimit) * 100}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-primary to-accent-purple h-2 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedPromo(promo)
                        setFormData({
                          code: promo.code,
                          name: promo.name,
                          description: promo.description,
                          type: promo.type,
                          value: promo.value,
                          minBookingAmount: promo.minBookingAmount,
                          maxDiscount: promo.maxDiscount,
                          validFrom: promo.validFrom.split('T')[0],
                          validTo: promo.validTo.split('T')[0],
                          usageLimit: promo.usageLimit,
                          applicableVehicles: promo.applicableVehicles || [],
                          active: promo.active
                        })
                        setShowEditModal(true)
                      }}
                      className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-lg transition-all font-medium text-sm"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePromoStatus(promo._id, promo.active)}
                      className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                        promo.active
                          ? 'bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-black'
                          : 'bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black'
                      }`}
                    >
                      {promo.active ? 'Deactivate' : 'Activate'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeletePromotion(promo._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Promotion Modal */}
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
              className="glass-panel rounded-2xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Create New Promotion</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddPromotion} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Promo Code*</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                      placeholder="SUMMER20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Promotion Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Summer Special"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">Description*</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Get 20% off on summer bookings"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Discount Type*</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">
                      Discount Value* {formData.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={formData.type === 'percentage' ? '20' : '500'}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Min. Booking Amount*</label>
                    <input
                      type="number"
                      required
                      value={formData.minBookingAmount}
                      onChange={(e) => setFormData({...formData, minBookingAmount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Max Discount Amount</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Valid From*</label>
                    <input
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Valid To*</label>
                    <input
                      type="date"
                      required
                      value={formData.validTo}
                      onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Usage Limit*</label>
                    <input
                      type="number"
                      required
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="100"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label className="text-white">Activate immediately</label>
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
                    Create Promotion
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Promotion Modal - Similar to Add Modal */}
      <AnimatePresence>
        {showEditModal && selectedPromo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Edit Promotion</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditPromotion} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Promo Code*</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Promotion Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">Description*</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Discount Type*</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">
                      Discount Value* {formData.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Min. Booking Amount*</label>
                    <input
                      type="number"
                      required
                      value={formData.minBookingAmount}
                      onChange={(e) => setFormData({...formData, minBookingAmount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Max Discount Amount</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Valid From*</label>
                    <input
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Valid To*</label>
                    <input
                      type="date"
                      required
                      value={formData.validTo}
                      onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Usage Limit*</label>
                    <input
                      type="number"
                      required
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label className="text-white">Active</label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple text-black font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(19,200,236,0.5)] transition-all"
                  >
                    Update Promotion
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

export default PricingPromotions
