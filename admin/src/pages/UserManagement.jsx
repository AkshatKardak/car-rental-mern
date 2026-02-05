import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import {
  UserPlus,
  Search,
  Filter,
  ShieldAlert,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Bell,
  Mail,
  Phone,
  ExternalLink,
  TrendingUp,
  Loader
} from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const UserManagement = () => {
  return (
    <>
      <Header />
      <ContentArea />
    </>
  )
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs font-black tracking-widest uppercase text-text-secondary/60">
          <span className="hover:text-primary cursor-pointer transition-colors">Workspace</span>
          <ChevronRight size={12} />
          <span className="text-text-primary">User Directory</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary size-4" />
          <input
            className="h-11 w-72 rounded-2xl border border-border-light bg-background-secondary/50 px-10 text-sm font-bold text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            placeholder="Search by name or email..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light bg-white text-text-secondary hover:bg-background-secondary hover:text-primary transition-all shadow-sm">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
        </button>
      </div>
    </header>
  )
}

const ContentArea = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisWeek: 0,
    pendingUsers: 0
  })

  // Fetch users from backend
  useEffect(() => {
    fetchUsers()
  }, [filterStatus, page])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const params = {
        page,
        limit: 10
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus
      }

      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeader(),
        params
      })

      if (response.data.success) {
        setUsers(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
        setTotalCount(response.data.total || 0)

        // Calculate stats
        const allUsersResponse = await axios.get(`${API_URL}/admin/users`, {
          headers: getAuthHeader(),
          params: { limit: 1000 }
        })

        if (allUsersResponse.data.success) {
          const allUsers = allUsersResponse.data.data || []
          const now = new Date()
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

          setStats({
            totalUsers: allUsers.length,
            activeUsers: allUsers.filter(u => u.status === 'active').length,
            newThisWeek: allUsers.filter(u => new Date(u.createdAt) >= weekAgo).length,
            pendingUsers: allUsers.filter(u => u.status === 'pending').length
          })
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to fetch users. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { label: 'Total Users', value: stats.totalUsers.toString(), trend: '+2.5%', trendUp: true },
    { label: 'Active Users', value: stats.activeUsers.toString(), progress: Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0 },
    { label: 'New This Week', value: stats.newThisWeek.toString(), avatars: true },
    { label: 'Pending Approval', value: stats.pendingUsers.toString(), warning: true },
  ]

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-primary shadow-[0_0_8px_rgba(16,163,16,0.6)] animate-pulse'
      case 'banned':
        return 'bg-red-500'
      case 'pending':
        return 'bg-orange-400'
      default:
        return 'bg-slate-300'
    }
  }

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-50 text-purple-600 border-purple-100'
      case 'manager':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100'
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">
              User <span className="text-primary italic">Directory</span>
            </h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">
              Control panel for member permissions and fleet access.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover uppercase tracking-widest"
          >
            <UserPlus size={20} />
            <span>Create Profile</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default"
            >
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">
                {stat.label}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-text-primary tracking-tight">
                  {stat.value}
                </span>
                {stat.trend && (
                  <span className="text-green-600 text-[10px] font-black bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                    {stat.trend} <TrendingUp size={10} />
                  </span>
                )}
                {stat.progress && (
                  <div className="h-2 w-20 bg-background-secondary rounded-full overflow-hidden border border-border-light">
                    <div className="h-full bg-primary" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                )}
                {stat.avatars && (
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-black text-primary">{i}</span>
                      </div>
                    ))}
                  </div>
                )}
                {stat.warning && <AlertTriangle size={20} className="text-red-500" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[32px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden flex flex-col"
        >
          {/* Filters */}
          <div className="flex flex-col gap-6 p-8 border-b border-border-light lg:flex-row lg:items-center lg:justify-between bg-background-secondary/20">
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'banned'].map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setFilterStatus(f)
                    setPage(1)
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterStatus === f
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white border-border-light text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-border-light text-xs font-black text-text-secondary hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
              <Filter size={16} /> Advanced Sorting
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Bookings</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Loader className="animate-spin h-8 w-8 text-primary" />
                        <span className="text-text-secondary font-bold">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center text-text-secondary font-bold">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-background-secondary/40 transition-colors cursor-default"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 overflow-hidden rounded-2xl border-2 border-border-light group-hover:border-primary/50 transition-all shadow-sm bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-black text-primary">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-black text-text-primary uppercase tracking-tight text-sm group-hover:text-primary transition-colors">
                              {user.name || 'N/A'}
                            </div>
                            <div className="text-[10px] text-text-secondary font-bold opacity-60 uppercase">
                              Since {new Date(user.createdAt).getFullYear()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5 opacity-90">
                          <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                            <Mail size={12} className="text-primary" /> {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary italic">
                            <Phone size={12} className="opacity-40" /> {user.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(user.status)}`} />
                          <span className="text-[11px] font-black uppercase tracking-widest text-text-primary opacity-80">
                            {user.status || 'active'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-xl font-black text-text-primary">{user.bookings || 0}</p>
                        <p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">
                          Trips
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-border-light">
                            <ExternalLink size={16} />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-orange-50 hover:text-orange-500 transition-all border border-border-light">
                            <ShieldAlert size={16} />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all border border-border-light">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-t border-border-light bg-background-secondary/10">
            <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.1em] opacity-60 mb-4 sm:mb-0">
              Showing {users.length} of {totalCount} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(Math.min(3, totalPages))].map((_, i) => {
                const pageNum = page > 2 ? page - 1 + i : i + 1
                if (pageNum > totalPages) return null

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${page === pageNum
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'border border-border-light text-text-secondary hover:bg-white'
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserManagement
