import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Printer,
  Mail,
  Car,
  User,
  History,
  ShieldCheck,
  Info,
  Image as ImageIcon,
  Download,
  Camera,
  Calculator,
  X,
  Check,
  ExternalLink,
  Bell
} from 'lucide-react'

const DamageManagement = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      <Header />
      <ContentArea />
    </div>
  )
}

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
      <div>
        <h1 className="text-2xl font-black tracking-tight uppercase text-gray-900">Damage Reports</h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fleet Incident & Insurance Oversight</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 border-r border-gray-200 pr-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-500">System Integrity</p>
            <p className="text-xs font-bold text-blue-600 flex items-center gap-1 justify-end">
              <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              LIVE MONITORING
            </p>
          </div>
        </div>
        <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all relative group">
          <Bell size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-2 right-2 size-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
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
  ])

  const [selectedClaim, setSelectedClaim] = useState(claims[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminNotes, setAdminNotes] = useState('')
  const [repairCost, setRepairCost] = useState(selectedClaim.repairCost)
  const [deductionAmount, setDeductionAmount] = useState(selectedClaim.deduction)

  React.useEffect(() => {
    setRepairCost(selectedClaim.repairCost)
    setDeductionAmount(selectedClaim.deduction)
    setAdminNotes('')
  }, [selectedClaim])

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
    alert(`Claim ${selectedClaim.id} approved!\nUser will be charged: ₹${deductionAmount}\nRepair cost: ₹${repairCost}`)
  }

  const handleRejectClaim = () => {
    if (confirm(`Are you sure you want to reject claim ${selectedClaim.id}?`)) {
      alert('Claim rejected successfully!')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search reports, vehicles, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filterStatus === status
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Claims List */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <div className="p-4 flex flex-col gap-2">
            <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
              Active Reports ({filteredClaims.length})
            </p>
            {filteredClaims.map((claim) => (
              <motion.button
                key={claim.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectClaim(claim)}
                className={`w-full p-5 rounded-2xl flex flex-col gap-3 group transition-all text-left relative ${
                  selectedClaim.id === claim.id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    selectedClaim.id === claim.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {claim.id}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">{claim.date}</span>
                </div>

                <div>
                  <h3 className="font-black text-sm tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    {claim.vehicle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">{claim.user}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                    claim.status === 'Resolved' ? 'bg-green-100 text-green-600 border border-green-200' :
                    claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                    'bg-blue-100 text-blue-600 border border-blue-200'
                  }`}>
                    {claim.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${
                      claim.priority === 'High' ? 'bg-red-500 animate-pulse' :
                      claim.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {claim.priority}
                    </span>
                  </div>
                </div>

                {selectedClaim.id === claim.id && (
                  <motion.div 
                    layoutId="selection-bar" 
                    className="absolute left-0 top-6 bottom-6 w-1 bg-blue-600 rounded-r-full" 
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Claim Detail */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">CLAIM {selectedClaim.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedClaim.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                      selectedClaim.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedClaim.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mt-1">Reported on {selectedClaim.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
                  <Printer size={20} className="text-gray-600" />
                </button>
                <button className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
                  <Mail size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Vehicle & User Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">Vehicle Details</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Car size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight text-gray-900">{selectedClaim.vehicle}</h4>
                    <p className="text-sm font-bold text-gray-600">License: {selectedClaim.license}</p>
                    <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-blue-50 rounded-lg w-fit">
                      <History size={12} className="text-blue-600" />
                      <span className="text-[10px] font-black text-blue-600 uppercase">TRIP #{selectedClaim.tripId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">Customer Profile</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    {selectedClaim.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tight text-gray-900">{selectedClaim.user}</h4>
                    <p className="text-sm font-bold text-gray-600">Member Since {selectedClaim.userSince}</p>
                    <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-gray-50 rounded-lg w-fit">
                      <User size={12} className="text-gray-900" />
                      <span className="text-[10px] font-black text-gray-900 uppercase">{selectedClaim.userTier}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">Incident Description</p>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-blue-600" />
                    <span className="text-xs font-black uppercase tracking-widest">Details</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {selectedClaim.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Gallery */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600" />
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Visual Evidence</h4>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:opacity-70 transition-all">
                  <Download size={14} /> DOWNLOAD ALL
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {selectedClaim.evidenceImages.map((image, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-200 group cursor-pointer relative shadow-sm">
                    <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Evidence ${i + 1}`} />
                    <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <ExternalLink size={24} className="text-white" />
                    </div>
                  </div>
                ))}
                <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group">
                  <Camera size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                </div>
              </div>
            </div>

            {/* Assessment Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Calculator size={20} className="text-blue-600" />
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Financial Assessment</h4>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Repair Cost</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={repairCost}
                      onChange={(e) => setRepairCost(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-lg focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">User Deduction</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold">₹</span>
                    <input
                      type="number"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-4 bg-blue-50 border border-blue-200 rounded-2xl font-black text-lg text-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Notes</label>
                  <textarea
                    placeholder="Enter resolution notes..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm min-h-[120px] focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handleRejectClaim}
                  className="px-8 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <X size={16} /> REJECT
                </button>

                <button
                  onClick={handleApproveClaim}
                  className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Check size={18} /> APPROVE & CHARGE ₹{deductionAmount}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DamageManagement
