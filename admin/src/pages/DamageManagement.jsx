import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const DamageManagement = () => {
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
        <ContentArea navigate={navigate} />
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
  { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
  { icon: 'car_crash', label: 'Damage Reports', active: true, path: '/admin/damage' },
  { icon: 'bar_chart', label: 'Analytics', active: false, path: '/admin/analytics' },
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

const ContentArea = () => {
  const [claims] = useState([
    {
      id: 'CLM-8832',
      vehicle: 'Tesla Model S Plaid',
      license: '8XF-291',
      tripId: 'TR-9921',
      user: 'Alex D.',
      userSince: '2021',
      userTier: 'Elite Member',
      date: 'Today, 10:23 AM',
      status: 'Pending',
      statusColor: 'yellow',
      priority: 'High',
      priorityColor: 'red',
      description: 'Customer reported scratching the rear bumper while parking in a tight underground garage. The sensor did not alert in time. Damage is strictly cosmetic but deep enough to require repainting. No structural damage observed.',
      repairCost: 1200,
      deduction: 500,
      evidenceImages: [
        'https://images.pexels.com/photos/7144171/pexels-photo-7144171.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/9638359/pexels-photo-9638359.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/9638367/pexels-photo-9638367.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: 'CLM-8831',
      vehicle: 'Porsche 911 GT3',
      license: '4KL-892',
      tripId: 'TR-9920',
      user: 'Sarah L.',
      userSince: '2022',
      userTier: 'Premium Member',
      date: 'Yesterday',
      status: 'Resolved',
      statusColor: 'green',
      priority: 'Low',
      priorityColor: 'slate',
      description: 'Minor windshield crack reported. Issue resolved with insurance claim.',
      repairCost: 450,
      deduction: 150,
      evidenceImages: [
        'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/8985321/pexels-photo-8985321.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: 'CLM-8830',
      vehicle: 'BMW i8 Roadster',
      license: '9PL-123',
      tripId: 'TR-9919',
      user: 'Mike R.',
      userSince: '2023',
      userTier: 'Standard Member',
      date: 'Oct 22',
      status: 'In Progress',
      statusColor: 'blue',
      priority: 'Medium',
      priorityColor: 'yellow',
      description: 'Dent on driver-side door from parking lot incident. Being assessed by repair shop.',
      repairCost: 800,
      deduction: 400,
      evidenceImages: [
        'https://images.pexels.com/photos/6870318/pexels-photo-6870318.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/7144171/pexels-photo-7144171.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/9638359/pexels-photo-9638359.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/9638367/pexels-photo-9638367.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: 'CLM-8829',
      vehicle: 'Mercedes AMG GT',
      license: '2XY-456',
      tripId: 'TR-9918',
      user: 'Jessica T.',
      userSince: '2021',
      userTier: 'Elite Member',
      date: 'Oct 20',
      status: 'Pending',
      statusColor: 'yellow',
      priority: 'High',
      priorityColor: 'red',
      description: 'Front bumper damage from minor collision. Police report filed.',
      repairCost: 2100,
      deduction: 1000,
      evidenceImages: [
        'https://images.pexels.com/photos/8985321/pexels-photo-8985321.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6870318/pexels-photo-6870318.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/7144171/pexels-photo-7144171.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/9638359/pexels-photo-9638359.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
  ])

  const [selectedClaim, setSelectedClaim] = useState(claims[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminNotes, setAdminNotes] = useState('')
  const [repairCost, setRepairCost] = useState(selectedClaim.repairCost)
  const [deductionAmount, setDeductionAmount] = useState(selectedClaim.deduction)

  // Update costs when claim changes
  React.useEffect(() => {
    setRepairCost(selectedClaim.repairCost)
    setDeductionAmount(selectedClaim.deduction)
    setAdminNotes('')
  }, [selectedClaim])

  // Filter claims
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && claim.status === 'Pending') ||
      (filterStatus === 'in-progress' && claim.status === 'In Progress') ||
      (filterStatus === 'resolved' && claim.status === 'Resolved')
    
    return matchesSearch && matchesFilter
  })

  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim)
  }

  const handleApproveClaim = () => {
    alert(`Claim ${selectedClaim.id} approved!\nUser will be charged: $${deductionAmount}\nRepair cost: $${repairCost}`)
  }

  const handleRejectClaim = () => {
    if (confirm(`Are you sure you want to reject claim ${selectedClaim.id}?`)) {
      alert('Claim rejected successfully!')
    }
  }

  const handleSaveDraft = () => {
    alert('Draft saved successfully!')
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex flex-col gap-4 p-6 pb-4 shrink-0 border-b border-white/5">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-black tracking-tight uppercase">Damage Management</h2>
            <p className="text-slate-400 text-sm">Review and resolve incoming vehicle damage reports</p>
          </div>
          {/* Search Bar */}
          <div className="relative group w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-primary/70">search</span>
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="Search Claim ID, Vehicle, or User..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
              filterStatus === 'all'
                ? 'bg-primary/20 border border-primary/30 text-primary shadow-neon'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Claims ({claims.length})
          </button>
          <button 
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all ${
              filterStatus === 'pending'
                ? 'bg-primary/20 border border-primary/30 text-primary'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Pending ({claims.filter(c => c.status === 'Pending').length})
          </button>
          <button 
            onClick={() => setFilterStatus('in-progress')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all ${
              filterStatus === 'in-progress'
                ? 'bg-primary/20 border border-primary/30 text-primary'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            In Progress ({claims.filter(c => c.status === 'In Progress').length})
          </button>
          <button 
            onClick={() => setFilterStatus('resolved')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all ${
              filterStatus === 'resolved'
                ? 'bg-primary/20 border border-primary/30 text-primary'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Resolved ({claims.filter(c => c.status === 'Resolved').length})
          </button>
        </div>
      </header>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden p-6 pt-4 gap-6">
        {/* Left Panel: Claims List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] flex flex-col gap-3 overflow-y-auto pr-2">
          {filteredClaims.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectClaim(claim)}
              className={`p-4 rounded-xl cursor-pointer transition-all group relative overflow-hidden ${
                selectedClaim.id === claim.id
                  ? 'bg-primary/10 border border-primary/20 shadow-neon'
                  : 'glass-panel hover:bg-white/5'
              }`}
            >
              {claim.priority === 'High' && (
                <div className="absolute top-0 right-0 p-3">
                  <span className="size-2 rounded-full bg-yellow-400 block shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-mono ${selectedClaim.id === claim.id ? 'text-primary' : 'text-slate-500 group-hover:text-primary/70'}`}>
                  {claim.id}
                </span>
                <span className="text-[10px] text-slate-400">{claim.date}</span>
              </div>
              
              <h3 className={`font-bold text-lg leading-tight mb-1 transition-colors ${
                selectedClaim.id === claim.id ? 'text-white' : 'text-slate-200 group-hover:text-white'
              }`}>
                {claim.vehicle}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="size-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700"></div>
                <span className="text-sm text-slate-300">{claim.user}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                  claim.statusColor === 'yellow' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  claim.statusColor === 'green' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                }`}>
                  {claim.status}
                </span>
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  claim.priority === 'High' ? 'text-red-400' : 
                  claim.priority === 'Medium' ? 'text-yellow-500/80' : 
                  'text-slate-500'
                }`}>
                  {claim.priority === 'High' && <span className="material-symbols-outlined text-[14px]">priority_high</span>}
                  {claim.priority} Priority
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Panel: Claim Details */}
        <div className="flex-1 glass-panel rounded-2xl overflow-y-auto relative shadow-2xl">
          {/* Detail Header */}
          <div className="sticky top-0 z-10 glass-panel border-x-0 border-t-0 border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl bg-slate-900/80">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Claim {selectedClaim.id}</h2>
              <span className={`px-3 py-1 rounded-md ${
                selectedClaim.statusColor === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                selectedClaim.statusColor === 'green' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              } text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.2)]`}>
                <span className="material-symbols-outlined text-[16px]">
                  {selectedClaim.status === 'Pending' ? 'pending' : selectedClaim.status === 'Resolved' ? 'check_circle' : 'sync'}
                </span>
                {selectedClaim.status === 'Pending' ? 'Pending Review' : selectedClaim.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="size-9 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700">
                <span className="material-symbols-outlined text-[20px]">print</span>
              </button>
              <button className="size-9 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </button>
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8 pb-32">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Vehicle Card */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex gap-4 items-center">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 shrink-0 shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-600">directions_car</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Vehicle</p>
                  <h3 className="text-white font-bold text-lg">{selectedClaim.vehicle}</h3>
                  <p className="text-slate-400 text-sm mb-2">License: {selectedClaim.license}</p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    <span>Trip ID: #{selectedClaim.tripId}</span>
                  </div>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex gap-4 items-center">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-accent-purple to-primary shrink-0 shadow-lg flex items-center justify-center text-white font-bold text-2xl">
                  {selectedClaim.user.charAt(0)}{selectedClaim.user.charAt(selectedClaim.user.indexOf(' ') + 1)}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Renter</p>
                  <h3 className="text-white font-bold text-lg">{selectedClaim.user}</h3>
                  <p className="text-slate-400 text-sm mb-2">Member since {selectedClaim.userSince}</p>
                  <div className="flex items-center gap-1 text-xs text-accent-purple">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>{selectedClaim.userTier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="bg-slate-800/20 rounded-xl border border-white/5 p-6">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span> Incident Summary
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm">
                {selectedClaim.description}
              </p>
            </div>

            {/* Evidence Gallery */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-purple text-[18px]">image</span> Evidence Gallery
                </h4>
                <button className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                  Download All <span className="material-symbols-outlined text-[14px]">download</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {selectedClaim.evidenceImages.map((image, i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-lg bg-cover bg-center cursor-pointer hover:ring-2 hover:ring-primary transition-all relative group overflow-hidden"
                    style={{ backgroundImage: `url(${image})` }}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">visibility</span>
                    </div>
                  </div>
                ))}
                <div className="aspect-square rounded-lg bg-slate-800 border border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-700/50 hover:text-slate-300 transition-all">
                  <span className="material-symbols-outlined mb-1">add_a_photo</span>
                  <span className="text-xs">Add Photo</span>
                </div>
              </div>
            </div>

            {/* Assessment Tools */}
            <div className="grid grid-cols-2 gap-6 p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-accent-purple/10 border border-accent-purple/20 shadow-lg">
              <div className="col-span-2">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">calculate</span> Cost Assessment
                </h4>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Estimated Repair Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input 
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-lg py-2 pl-7 pr-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    type="number"
                    value={repairCost}
                    onChange={(e) => setRepairCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-primary font-medium">Deduction Amount (Charge to User)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-primary">$</span>
                  <input 
                    className="w-full bg-slate-900/80 border border-primary/50 rounded-lg py-2 pl-7 pr-3 text-primary font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_0_10px_rgba(19,200,236,0.1)] transition-all" 
                    type="number"
                    value={deductionAmount}
                    onChange={(e) => setDeductionAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="col-span-2 space-y-2 mt-2">
                <label className="text-xs text-slate-400 font-medium">Admin Notes</label>
                <textarea 
                  className="w-full bg-slate-900/80 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all min-h-[80px]" 
                  placeholder="Add internal notes regarding this claim..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="sticky bottom-0 left-0 w-full p-6 glass-panel border-t border-white/10 flex justify-between items-center bg-slate-900/90 backdrop-blur-xl z-20">
            <button 
              onClick={handleRejectClaim}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all text-sm font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span> Reject Claim
            </button>
            <div className="flex gap-4">
              <button 
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-semibold"
              >
                Save Draft
              </button>
              <button 
                onClick={handleApproveClaim}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-primary text-white font-bold shadow-neon hover:shadow-[0_0_20px_rgba(19,200,236,0.5)] hover:brightness-110 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">check</span> Approve & Charge ${deductionAmount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DamageManagement
