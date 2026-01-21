import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Search,
  Filter,
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
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

const DamageManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea />
      </main>
    </div>
  )
}

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="h-20 bg-background-primary border-b border-border-light flex items-center justify-between px-8 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 hover:bg-background-secondary rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">Damage Reports</h1>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fleet Incident & Insurance Oversight</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 border-r border-border-light pr-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-text-muted">System Integrity</p>
            <p className="text-xs font-bold text-primary flex items-center gap-1 justify-end">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              LIVE MONITORING
            </p>
          </div>
        </div>
        <button className="p-2.5 bg-background-secondary hover:bg-border-light rounded-xl transition-all relative group">
          <Bell size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-primary"></span>
        </button>
      </div>
    </header>
  )
}

const Menu = ({ size }) => <span className="material-symbols-outlined" style={{ fontSize: size }}>menu</span>
const Bell = ({ size, className }) => <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>notifications</span>

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
      {/* Sub-Header / Filters */}
      <div className="bg-background-primary border-b border-border-light p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative group w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search reports, vehicles, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-background-secondary border border-border-light rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="h-8 w-px bg-border-light" />

          {/* Status Filters */}
          <div className="flex items-center gap-2">
            {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterStatus === status
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-transparent border-transparent text-text-muted hover:bg-background-secondary hover:text-text-primary'
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
        {/* Left Side: Claims List */}
        <div className="w-96 bg-background-primary border-r border-border-light overflow-y-auto no-scrollbar shrink-0">
          <div className="p-4 flex flex-col gap-2">
            <p className="px-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Active Reports ({filteredClaims.length})</p>
            {filteredClaims.map((claim) => (
              <motion.button
                key={claim.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectClaim(claim)}
                className={`w-full p-5 rounded-2xl flex flex-col gap-3 group transition-all text-left relative ${selectedClaim.id === claim.id
                    ? 'bg-background-secondary border border-border-light shadow-sm'
                    : 'hover:bg-background-secondary/50 border border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedClaim.id === claim.id ? 'text-primary' : 'text-text-muted'}`}>
                    {claim.id}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted">{claim.date}</span>
                </div>

                <div>
                  <h3 className="font-black text-sm tracking-tight text-text-primary group-hover:text-primary transition-colors">{claim.vehicle}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={12} className="text-text-muted" />
                    <span className="text-xs font-bold text-text-secondary">{claim.user}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${claim.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                      claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {claim.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${claim.priority === 'High' ? 'bg-red-500 animate-pulse' :
                        claim.priority === 'Medium' ? 'bg-yellow-500' : 'bg-slate-400'
                      }`} />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{claim.priority} PRIORITY</span>
                  </div>
                </div>

                {selectedClaim.id === claim.id && (
                  <motion.div layoutId="selection-bar" className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side: Claim Detail */}
        <div className="flex-1 bg-background-secondary overflow-y-auto no-scrollbar relative p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-background-primary rounded-3xl p-8 border border-border-light shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight text-text-primary">CLAIM {selectedClaim.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedClaim.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                        selectedClaim.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                      {selectedClaim.status}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium mt-1">Reported on {selectedClaim.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 bg-background-secondary border border-border-light rounded-xl hover:bg-border-light transition-all">
                  <Printer size={20} className="text-text-secondary" />
                </button>
                <button className="p-3 bg-background-secondary border border-border-light rounded-xl hover:bg-border-light transition-all">
                  <Mail size={20} className="text-text-secondary" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Vehicle & User Grid */}
              <div className="flex flex-col gap-6">
                {/* Vehicle Card */}
                <div className="bg-background-primary rounded-3xl p-6 border border-border-light shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Vehicle Assets</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-background-secondary flex items-center justify-center">
                      <Car size={32} className="text-text-muted" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight text-text-primary">{selectedClaim.vehicle}</h4>
                      <p className="text-sm font-bold text-text-secondary">License: {selectedClaim.license}</p>
                      <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-primary/10 rounded-lg w-fit">
                        <History size={12} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase">TRIP #{selectedClaim.tripId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Card */}
                <div className="bg-background-primary rounded-3xl p-6 border border-border-light shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Customer Profile</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
                      {selectedClaim.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight text-text-primary">{selectedClaim.user}</h4>
                      <p className="text-sm font-bold text-text-secondary">Member Since {selectedClaim.userSince}</p>
                      <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-text-primary/5 rounded-lg w-fit">
                        <User size={12} className="text-text-primary" />
                        <span className="text-[10px] font-black text-text-primary uppercase">{selectedClaim.userTier}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-background-primary rounded-3xl p-6 border border-border-light shadow-sm flex flex-col">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Incident Intelligence</p>
                <div className="bg-background-secondary rounded-2xl p-5 border border-border-light flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Description</span>
                  </div>
                  <p className="text-sm font-medium text-text-secondary leading-relaxed">
                    {selectedClaim.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Gallery */}
            <div className="bg-background-primary rounded-3xl p-6 border border-border-light shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary" />
                  <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Visual Evidence</h4>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-all">
                  <Download size={14} /> DOWNLOAD ARCHIVE
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {selectedClaim.evidenceImages.map((image, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border-light group cursor-pointer relative shadow-sm">
                    <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <ExternalLink size={24} className="text-white" />
                    </div>
                  </div>
                ))}
                <div className="aspect-square rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary hover:text-primary transition-all cursor-pointer group">
                  <Camera size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Evidence</span>
                </div>
              </div>
            </div>

            {/* Assessment Section */}
            <div className="bg-background-primary rounded-3xl p-8 border border-border-light shadow-sm flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Calculator size={20} className="text-primary" />
                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Financial Assessment</h4>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Estimated Repair Cost</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                    <input
                      type="number"
                      value={repairCost}
                      onChange={(e) => setRepairCost(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-4 bg-background-secondary border border-border-light rounded-2xl font-black text-lg focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Member Deduction</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                    <input
                      type="number"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-4 bg-primary/5 border border-primary/20 rounded-2xl font-black text-lg text-primary focus:border-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Administrative Notes</label>
                  <textarea
                    placeholder="Enter internal resolution notes..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-5 bg-background-secondary border border-border-light rounded-2xl font-medium text-sm min-h-[120px] focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border-light">
                <button
                  onClick={handleRejectClaim}
                  className="px-8 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-black text-xs uppercase tracking-[0.1em] hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <X size={16} /> REJECT CLAIM
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSaveDraft}
                    className="px-8 py-4 rounded-2xl bg-background-secondary text-text-primary font-black text-xs uppercase tracking-[0.1em] hover:bg-border-light transition-all"
                  >
                    SAVE DRAFT
                  </button>
                  <button
                    onClick={handleApproveClaim}
                    className="px-10 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                  >
                    <Check size={18} /> APPROVE & CHARGE ${deductionAmount}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DamageManagement;
