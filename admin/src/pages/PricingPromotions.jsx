import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar' // ✅ ADD THIS IMPORT
import {
  Plus,
  Search,
  Tag,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart2,
  PiggyBank,
  Edit,
  Trash2,
  Calendar,
  ChevronRight,
  Filter as FilterIcon,
  Zap,
  Clock,
  LayoutGrid,
  Bell
} from 'lucide-react'

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

  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [carsRes, usersRes, bookingsRes] = await Promise.all([
        fetch('http://127.0.0.1:5005/api/cars'),
        fetch('http://127.0.0.1:5005/api/users'),
        fetch('http://127.0.0.1:5005/api/bookings')
      ])

      const carsData = await carsRes.json()
      const usersData = await usersRes.json()
      const bookingsData = await bookingsRes.json()

      setCars(carsData)
      setUsers(usersData)
      setBookings(bookingsData)

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
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* ✅ Shared Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header />
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

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-border-light flex items-center justify-between px-8 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase text-text-primary">Promotions</h1>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Offers & Dynamic Pricing Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 border-r border-border-light pr-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-text-secondary opacity-60">Promotion Status</p>
            <p className="text-xs font-bold text-primary flex items-center gap-1 justify-end">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              ACTIVE ENGINE
            </p>
          </div>
        </div>
        <button className="p-2.5 bg-background-secondary hover:bg-border-light rounded-xl transition-all relative group">
          <Bell size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
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
    <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-background-secondary">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Action */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap size={20} className="text-primary" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-secondary opacity-70">Dynamic Campaigns</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={18} />
            Create Promotion
          </motion.button>
        </div>

        {/* Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Promos', value: stats.total, icon: Tag, color: 'text-text-primary', bg: 'bg-white' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Inactive', value: stats.inactive, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Total Usage', value: stats.totalUsage, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Avg Usage', value: stats.avgDiscountPerPromo, icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Total Saved', value: `₹${stats.totalDiscountGiven.toLocaleString()}`, icon: PiggyBank, color: 'text-orange-500', bg: 'bg-orange-50' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-3xl border border-border-light shadow-sm flex flex-col gap-3 ${stat.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <span className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-3xl p-6 border border-border-light shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search promotions, codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background-secondary border border-border-light rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text-secondary"
              />
            </div>

            <div className="relative group">
              <FilterIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background-secondary border border-border-light rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Campaigns</option>
                <option value="inactive">Paused / Expired</option>
              </select>
            </div>

            <div className="relative group">
              <LayoutGrid size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background-secondary border border-border-light rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Discount Types</option>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Promotions Ledger */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border-light">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-black text-text-secondary uppercase tracking-widest">Hydrating Promotions Ledger...</p>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border-light border-dashed">
              <Tag size={48} className="text-text-secondary/30 mb-4" />
              <p className="text-lg font-black text-text-secondary">No active promotions match your criteria</p>
              <p className="text-sm text-text-secondary mt-1 opacity-60">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPromotions.map((promo, index) => (
                <motion.div
                  key={promo._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-3xl p-6 border border-border-light shadow-sm group hover:border-primary/30 transition-all ${!promo.active ? 'opacity-70 grayscale-[0.5]' : ''}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-primary" />
                        <h3 className="text-lg font-black text-text-primary tracking-tight">{promo.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black tracking-widest">
                          {promo.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${promo.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {promo.active ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-text-secondary mb-6 line-clamp-2 leading-relaxed text-left">
                    {promo.description}
                  </p>

                  <div className="bg-background-secondary rounded-2xl p-5 border border-border-light mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">Benefit</span>
                      <span className="text-2xl font-black text-primary">
                        {promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`}
                      </span>
                    </div>
                    {promo.maxDiscount && (
                      <div className="flex items-center justify-between pt-2 border-t border-border-light mt-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase opacity-60">Max Cap</span>
                        <span className="text-sm font-black text-text-primary">₹{promo.maxDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">Threshold</p>
                      <p className="text-sm font-bold text-text-primary">₹{promo.minBookingAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">Redeemed</p>
                      <p className="text-sm font-bold text-text-primary">{promo.usedCount || 0} / {promo.usageLimit}</p>
                    </div>
                    <div className="col-span-2 text-left">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">Availability</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <Calendar size={14} className="text-text-secondary opacity-60" />
                        <span>{new Date(promo.validFrom).toLocaleDateString('en-IN')}</span>
                        <ChevronRight size={12} className="text-border-light" />
                        <span>{new Date(promo.validTo).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-text-secondary opacity-60">Utilization Ratio</span>
                      <span className="text-primary">{Math.round(((promo.usedCount || 0) / promo.usageLimit) * 100)}%</span>
                    </div>
                    <div className="w-full bg-background-secondary rounded-full h-1.5 overflow-hidden border border-border-light">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((promo.usedCount || 0) / promo.usageLimit) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 1 }}
                        className="bg-primary h-full rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
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
                      className="flex-1 px-4 py-2.5 bg-background-secondary border border-border-light rounded-xl hover:bg-border-light transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Edit size={14} /> EDIT
                    </button>
                    <button
                      onClick={() => togglePromoStatus(promo._id, promo.active)}
                      className={`px-4 py-2.5 border rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${promo.active ? 'bg-yellow-50 border-yellow-100 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100'}`}
                    >
                      {promo.active ? <Clock size={14} /> : <Zap size={14} />}
                      {promo.active ? 'PAUSE' : 'RESUME'}
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promo._id)}
                      className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 rounded-xl transition-all flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )))}
            </div>
          )}
        </div>
      </div>

      {/* Modals - Keep your existing modal code */}
    </div>
  )
}

export default PricingPromotions
