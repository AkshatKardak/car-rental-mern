import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Bell,
  Loader,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { damageService } from '../services/damageService'
import toast from 'react-hot-toast'

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
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [adminNotes, setAdminNotes] = useState('')
  const [repairCost, setRepairCost] = useState(0)
  const [processing, setProcessing] = useState(false)

  // Fetch claims on mount
  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      // Fetch both pending and all reports to show complete history
      // Ideally we should have a single endpoint with filters, but for now let's use getPending for the active ones
      // or getAllReports for everything.
      // Let's use getAllReports to see everything but sort/filter in UI
      const response = await damageService.getAllReports()

      const mappedClaims = (response.data || []).map(report => ({
        id: report._id,
        bookingId: report.booking?._id || 'N/A',
        vehicle: report.car ? `${report.car.brand} ${report.car.model}` : 'Unknown Vehicle',
        license: report.car?.registrationNumber || 'N/A',
        user: report.user?.name || 'Unknown User',
        userEmail: report.user?.email || '',
        date: new Date(report.createdAt).toLocaleDateString() + ' ' + new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: report.status.charAt(0).toUpperCase() + report.status.slice(1), // Capitalize
        originalStatus: report.status,
        description: report.description,
        evidenceImages: report.images || [],
        aiAnalysis: report.aiAnalysis || {},
        estimatedCost: report.estimatedCost || 0,
        actualCost: report.actualCost || 0,
        adminNotes: report.adminNotes || ''
      }))

      setClaims(mappedClaims)
      if (mappedClaims.length > 0 && !selectedClaim) {
        setSelectedClaim(mappedClaims[0])
      }
    } catch (error) {
      console.error('Failed to fetch damage reports:', error)
      toast.error('Failed to load damage reports')
    } finally {
      setLoading(false)
    }
  }

  // Update local state when selected claim changes
  useEffect(() => {
    if (selectedClaim) {
      setRepairCost(selectedClaim.actualCost || selectedClaim.estimatedCost || 0)
      setAdminNotes(selectedClaim.adminNotes || '')
    }
  }, [selectedClaim])

  const filteredClaims = claims.filter(claim => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && (claim.originalStatus === 'pending' || claim.originalStatus === 'under_review')) ||
      (filterStatus === 'approved' && claim.originalStatus === 'approved') ||
      (filterStatus === 'rejected' && claim.originalStatus === 'rejected')

    return matchesSearch && matchesFilter
  })

  // Set under review
  const handleSetUnderReview = async () => {
    if (!selectedClaim || selectedClaim.originalStatus !== 'pending') return;
    try {
      await damageService.setUnderReview(selectedClaim.id);
      toast.success('Marked as Under Review');
      fetchClaims(); // Refresh
    } catch (error) {
      toast.error('Failed to update status');
    }
  }

  const handleApproveClaim = async () => {
    if (!repairCost || repairCost <= 0) {
      toast.error('Please enter a valid repair cost')
      return
    }

    if (!confirm(`Are you sure you want to approve this claim? The user will be charged ₹${repairCost}.`)) {
      return
    }

    try {
      setProcessing(true)
      await damageService.approveReport(selectedClaim.id, {
        actualCost: repairCost,
        adminNotes: adminNotes
      })
      toast.success('Claim approved and cost set successfully')
      fetchClaims() // Refresh list
    } catch (error) {
      console.error('Approve error:', error)
      toast.error(error.response?.data?.message || 'Failed to approve claim')
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectClaim = async () => {
    if (!adminNotes) {
      toast.error('Please provide a reason for rejection in Admin Notes')
      return
    }

    if (!confirm(`Are you sure you want to reject this claim?`)) {
      return
    }

    try {
      setProcessing(true)
      await damageService.rejectReport(selectedClaim.id, {
        adminNotes: adminNotes
      })
      toast.success('Claim rejected successfully')
      fetchClaims()
    } catch (error) {
      console.error('Reject error:', error)
      toast.error(error.response?.data?.message || 'Failed to reject claim')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
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
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterStatus === status
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {status}
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
              Reports ({filteredClaims.length})
            </p>
            {filteredClaims.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No reports found</div>
            ) : filteredClaims.map((claim) => (
              <motion.button
                key={claim.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClaim(claim)}
                className={`w-full p-5 rounded-2xl flex flex-col gap-3 group transition-all text-left relative ${selectedClaim?.id === claim.id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[120px] ${selectedClaim?.id === claim.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    {claim.id.slice(-8)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">{claim.date.split(' ')[0]}</span>
                </div>

                <div>
                  <h3 className="font-black text-sm tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {claim.vehicle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 truncate">{claim.user}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${claim.originalStatus === 'approved' ? 'bg-green-100 text-green-600 border border-green-200' :
                      claim.originalStatus === 'pending' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                        claim.originalStatus === 'rejected' ? 'bg-red-100 text-red-600 border border-red-200' :
                          'bg-blue-100 text-blue-600 border border-blue-200'
                    }`}>
                    {claim.status}
                  </span>
                  {claim.aiAnalysis?.severity && (
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${claim.aiAnalysis.severity === 'Severe' ? 'bg-red-500 animate-pulse' :
                          claim.aiAnalysis.severity === 'Moderate' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {claim.aiAnalysis.severity}
                      </span>
                    </div>
                  )}
                </div>

                {selectedClaim?.id === claim.id && (
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
        {selectedClaim ? (
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
                      <h2 className="text-2xl font-black tracking-tight text-gray-900">CLAIM #{selectedClaim.id.slice(-6).toUpperCase()}</h2>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedClaim.originalStatus === 'approved' ? 'bg-green-100 text-green-600' :
                          selectedClaim.originalStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            selectedClaim.originalStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                        }`}>
                        {selectedClaim.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mt-1">Reported on {selectedClaim.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedClaim.originalStatus === 'pending' && (
                    <button
                      onClick={handleSetUnderReview}
                      className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase rounded-xl hover:bg-blue-100 transition"
                    >
                      Mark Under Review
                    </button>
                  )}
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
                      <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-green-50 rounded-lg w-fit">
                        <FileText size={12} className="text-green-600" />
                        <span className="text-[10px] font-black text-green-600 uppercase">Booking: {selectedClaim.bookingId.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">Customer Profile</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedClaim.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight text-gray-900">{selectedClaim.user}</h4>
                      <p className="text-sm font-bold text-gray-600">{selectedClaim.userEmail}</p>
                      <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-gray-50 rounded-lg w-fit">
                        <User size={12} className="text-gray-900" />
                        <span className="text-[10px] font-black text-gray-900 uppercase">Verfied User</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-4">Incident Description</p>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Info size={16} className="text-blue-600" />
                      <span className="text-xs font-black uppercase tracking-widest">User Report</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {selectedClaim.description}
                    </p>
                  </div>

                  {selectedClaim.aiAnalysis?.description && (
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} className="text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI Analysis</span>
                      </div>
                      <p className="text-sm font-medium text-blue-800 leading-relaxed">
                        {selectedClaim.aiAnalysis.description}
                      </p>
                      <div className="mt-3 flex gap-4">
                        <div>
                          <span className="text-xs font-bold text-blue-600 block">Severity</span>
                          <span className="text-sm font-black text-blue-900">{selectedClaim.aiAnalysis.severity}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-blue-600 block">Est. Cost</span>
                          <span className="text-sm font-black text-blue-900">₹{selectedClaim.aiAnalysis.estimatedCost?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                  {selectedClaim.evidenceImages.length > 0 ? selectedClaim.evidenceImages.map((image, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-200 group cursor-pointer relative shadow-sm">
                      <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Evidence ${i + 1}`} />
                      <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <ExternalLink size={24} className="text-white" onClick={() => window.open(image, '_blank')} />
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-4 py-8 text-center text-gray-400 text-sm font-medium">No images uploaded</div>
                  )}
                </div>
              </div>

              {/* Assessment Section - Only show actions if not resolved */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <Calculator size={20} className="text-blue-600" />
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Resolution & Assessment</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Final Charge Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold">₹</span>
                      <input
                        type="number"
                        value={repairCost}
                        onChange={(e) => setRepairCost(parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-4 bg-blue-50 border border-blue-200 rounded-2xl font-black text-lg text-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm"
                        disabled={selectedClaim.originalStatus === 'approved' || selectedClaim.originalStatus === 'rejected'}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Notes (Reasoning)</label>
                    <textarea
                      placeholder="Enter notes about the damage assessment or rejection reason..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm min-h-[120px] focus:border-blue-600 outline-none transition-all"
                      disabled={selectedClaim.originalStatus === 'approved' || selectedClaim.originalStatus === 'rejected'}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedClaim.originalStatus !== 'approved' && selectedClaim.originalStatus !== 'rejected' && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={handleRejectClaim}
                      disabled={processing}
                      className="px-8 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <X size={16} /> REJECT CLAIM
                    </button>

                    <button
                      onClick={handleApproveClaim}
                      disabled={processing}
                      className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {processing ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <Check size={18} />
                      )}
                      APPROVE & CHARGE USER
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Select a report to view details</div>
        )}
      </div>
    </div>
  )
}

export default DamageManagement
