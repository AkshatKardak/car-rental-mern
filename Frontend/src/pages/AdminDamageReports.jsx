import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  MessageSquare,
  X,
  TrendingUp,
  FileText
} from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import damageService from '../services/damageService';

const AdminDamageReports = () => {
  const { isDarkMode } = useTheme();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'
  const [actualCost, setActualCost] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, statsData] = await Promise.all([
        damageService.getPendingDamageReports(),
        damageService.getAdminDamageStats()
      ]);
      setReports(reportsData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load damage reports');
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (report) => {
    setSelectedReport(report);
    setModalAction('approve');
    setActualCost(report.estimatedCost || '');
    setAdminNotes('');
    setShowModal(true);
  };

  const openRejectModal = (report) => {
    setSelectedReport(report);
    setModalAction('reject');
    setAdminNotes('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (modalAction === 'approve') {
      if (!actualCost || actualCost <= 0) {
        alert('Please enter a valid cost');
        return;
      }
    } else if (modalAction === 'reject') {
      if (!adminNotes.trim()) {
        alert('Please provide a reason for rejection');
        return;
      }
    }

    try {
      setProcessing(true);
      
      if (modalAction === 'approve') {
        await damageService.approveDamageReport(selectedReport._id, {
          actualCost: parseFloat(actualCost),
          adminNotes: adminNotes
        });
      } else {
        await damageService.rejectDamageReport(selectedReport._id, {
          adminNotes: adminNotes
        });
      }

      alert(`Damage report ${modalAction === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to process report:', error);
      alert('Failed to process damage report');
    } finally {
      setProcessing(false);
    }
  };

  const markUnderReview = async (reportId) => {
    try {
      await damageService.setUnderReview(reportId);
      alert('Marked as under review');
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200',
      under_review: 'px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200',
    };
    return badges[status] || badges.pending;
  };

  return (
    <div 
      className="min-h-screen pb-12 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderColor: 'rgba(249, 115, 22, 0.3)'
              }}
            >
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black" style={{ color: theme.text }}>
                Damage Reports Management
              </h1>
              <p style={{ color: theme.textSecondary }}>
                Review and process pending damage reports
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
                      Total Reports
                    </p>
                    <p className="text-3xl font-black" style={{ color: theme.text }}>
                      {stats.totalReports}
                    </p>
                  </div>
                  <FileText className="w-10 h-10 text-orange-500 opacity-20" />
                </div>
              </div>

              <div 
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
                      Pending Review
                    </p>
                    <p className="text-3xl font-black text-yellow-500">
                      {stats.pendingReports}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
                </div>
              </div>

              <div 
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
                      Total Cost
                    </p>
                    <p className="text-3xl font-black text-green-500">
                      ₹{stats.statusBreakdown
                        .reduce((sum, stat) => sum + (stat.totalActualCost || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border p-12 text-center"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-30" />
            <h3 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
              All Caught Up!
            </h3>
            <p style={{ color: theme.textSecondary }}>
              No pending damage reports to review
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {reports.map((report, idx) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border p-6 hover:border-orange-500/30 transition-colors"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Report Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={getStatusBadge(report.status)}>
                          {report.status === 'pending' ? 'Pending Review' : 'Under Review'}
                        </span>
                        <h3 className="text-xl font-black mt-2" style={{ color: theme.text }}>
                          {report.car?.brand} {report.car?.model}
                        </h3>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>
                          Reported by: {report.user?.name} • {report.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Images */}
                    {report.images && report.images.length > 0 && (
                      <div className="mb-4 grid grid-cols-4 gap-2">
                        {report.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Damage"
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <div 
                      className="p-4 rounded-xl border mb-4"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border
                      }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
                        User Description
                      </p>
                      <p className="text-sm" style={{ color: theme.text }}>
                        {report.description}
                      </p>
                    </div>

                    {/* AI Analysis */}
                    {report.aiAnalysis && (
                      <div 
                        className="p-4 rounded-xl border bg-blue-50"
                        style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-700">
                          🤖 AI Analysis
                        </p>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div>
                            <p className="text-xs text-blue-600">Damage Type</p>
                            <p className="text-sm font-bold text-blue-800">
                              {report.aiAnalysis.damageType}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-600">Severity</p>
                            <p className="text-sm font-bold text-blue-800">
                              {report.aiAnalysis.severity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-600">Est. Cost</p>
                            <p className="text-sm font-bold text-blue-800">
                              ₹{report.aiAnalysis.estimatedCost?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-blue-700">
                          {report.aiAnalysis.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border
                      }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
                        Admin Actions
                      </p>

                      {report.status === 'pending' && (
                        <button
                          onClick={() => markUnderReview(report._id)}
                          className="w-full mb-3 px-4 py-3 rounded-xl border border-blue-300 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mark as Reviewing
                        </button>
                      )}

                      <button
                        onClick={() => openApproveModal(report)}
                        className="w-full mb-3 px-4 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve & Set Cost
                      </button>

                      <button
                        onClick={() => openRejectModal(report)}
                        className="w-full px-4 py-3 rounded-xl border border-red-300 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Report
                      </button>
                    </div>

                    <div 
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border
                      }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
                        Report Details
                      </p>
                      <div className="space-y-2 text-xs" style={{ color: theme.text }}>
                        <div className="flex justify-between">
                          <span style={{ color: theme.textSecondary }}>Report ID:</span>
                          <span className="font-bold">{report._id.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: theme.textSecondary }}>Booking ID:</span>
                          <span className="font-bold">{report.booking?._id?.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: theme.textSecondary }}>Submitted:</span>
                          <span className="font-bold">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl border p-8 max-w-md w-full shadow-2xl"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black" style={{ color: theme.text }}>
                  {modalAction === 'approve' ? 'Approve Damage Report' : 'Reject Damage Report'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" style={{ color: theme.textSecondary }} />
                </button>
              </div>

              {modalAction === 'approve' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" style={{ color: theme.text }}>
                      Final Damage Cost (₹) *
                    </label>
                    <input
                      type="number"
                      value={actualCost}
                      onChange={(e) => setActualCost(e.target.value)}
                      placeholder="Enter final cost"
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />
                    <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                      AI Estimated: ₹{selectedReport?.estimatedCost?.toLocaleString()}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" style={{ color: theme.text }}>
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any notes for the user..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition resize-none"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="w-full px-6 py-4 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Approve & Notify User'}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" style={{ color: theme.text }}>
                      Reason for Rejection *
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Please provide a clear reason for rejecting this report..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition resize-none"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        color: theme.text
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="w-full px-6 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Reject Report'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDamageReports;
