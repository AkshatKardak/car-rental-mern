import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const UserManagement = () => {
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
    { icon: 'group', label: 'User Management', active: true, path: '/admin/users' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Promotions', active: false, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Reports', active: false, path: '/admin/damage' },
    { icon: 'bar_chart', label: 'Analytics', active: false, path: '/admin/analytics' },
  ]


  return (
    <aside className="hidden lg:flex flex-col w-72 glass-panel border-r border-white/5 z-20 h-full">
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
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Main Menu</div>
        
        {navItems.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 3 }}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group text-left relative ${
              item.active
                ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_rgba(19,200,236,0.1)]'
                : 'hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            {item.active && (
              <div className="absolute left-0 h-full w-1 rounded-r-full bg-primary"></div>
            )}
            <span 
              className={`material-symbols-outlined ${
                item.active ? 'text-primary' : 'group-hover:text-primary'
              } transition-colors`}
              style={{ fontVariationSettings: `"FILL" ${item.active ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" 20` }}
            >
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </motion.button>
        ))}

        <div className="pt-4 mt-2 border-t border-white/5">
          <p className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System
          </p>
          <motion.button
            whileHover={{ x: 3 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 hover:text-white text-slate-400 transition-all duration-300 group text-left"
          >
            <span 
              className="material-symbols-outlined group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20' }}
            >
              settings
            </span>
            <span className="font-medium text-sm">Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 3 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 hover:text-white text-slate-400 transition-all duration-300 group text-left"
          >
            <span 
              className="material-symbols-outlined group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20' }}
            >
              security
            </span>
            <span className="font-medium text-sm">Access Control</span>
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
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">Super Admin</p>
          </div>
          <span 
            className="material-symbols-outlined text-slate-400 text-lg"
            style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
          >
            logout
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
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg font-bold text-white">RentRide</span>
      </div>

      {/* Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <a className="text-slate-400 hover:text-primary transition-colors" href="#">Dashboard</a>
        <span className="text-slate-600">/</span>
        <span className="text-primary font-medium text-glow">User Management</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative hidden sm:block">
          <input 
            className="h-10 w-64 rounded-full border border-white/10 bg-white/5 px-4 pl-10 text-sm text-white placeholder-slate-500 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-0 transition-all" 
            placeholder="Quick search..." 
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-slate-500">search</span>
          <div className="absolute right-3 top-2.5 flex items-center gap-1">
            <span className="text-[10px] text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>
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
    { label: 'Total Users', value: '12,450', trend: '+2.5%', trendUp: true },
    { label: 'Active Users', value: '10,820', progress: 85 },
    { label: 'New This Week', value: '342', avatars: true },
    { label: 'Pending Verification', value: '48', icon: 'pending_actions' },
  ]

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alex Drale',
      email: 'alex.drale@rentride.com',
      phone: '+1 (555) 123-4567',
      role: 'Premium',
      roleColor: 'purple',
      status: 'Active',
      statusColor: 'primary',
      bookings: 24,
      since: '2023',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      phone: '+1 (555) 987-6543',
      role: 'Standard',
      roleColor: 'blue',
      status: 'Offline',
      statusColor: 'slate',
      bookings: 3,
      since: '2024',
      image: 'https://i.pravatar.cc/150?img=45'
    },
    {
      id: 3,
      name: 'Michael Ross',
      email: 'm.ross88@outlook.com',
      phone: '+44 7700 900077',
      role: 'Premium',
      roleColor: 'purple',
      status: 'Banned',
      statusColor: 'red',
      bookings: 0,
      since: '2022',
      image: 'https://i.pravatar.cc/150?img=33',
      banned: true
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.c@techcorp.io',
      phone: '+1 (415) 555-0100',
      role: 'Corporate',
      roleColor: 'yellow',
      status: 'Active',
      statusColor: 'primary',
      bookings: 156,
      since: '2023',
      image: 'https://i.pravatar.cc/150?img=47'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.org',
      phone: '+1 (202) 555-0122',
      role: 'Standard',
      roleColor: 'blue',
      status: 'Pending',
      statusColor: 'orange',
      bookings: 0,
      since: '2024',
      image: 'https://i.pravatar.cc/150?img=68',
      pending: true
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.status === 'Active') ||
      (filterStatus === 'banned' && user.status === 'Banned')
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
      alert('User deleted successfully!')
    }
  }

  const handleBanUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned', statusColor: u.status === 'Banned' ? 'primary' : 'red', banned: !u.banned }
        : u
    ))
    alert(`User ${users.find(u => u.id === userId).status === 'Banned' ? 'unbanned' : 'banned'} successfully!`)
  }

  const handleApproveUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: 'Active', statusColor: 'primary', pending: false }
        : u
    ))
    alert('User approved successfully!')
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">User Management</h2>
            <p className="text-slate-400 mt-1">Manage user access, roles, and platform activity.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddUserModal(true)}
            className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-purple to-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:shadow-[0_0_30px_rgba(19,200,236,0.6)]"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Add New User</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-4 flex flex-col gap-1 cursor-pointer"
            >
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.trend && (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    {stat.trend} 
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  </span>
                )}
                {stat.progress && (
                  <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-primary`} style={{ width: `${stat.progress}%` }}></div>
                  </div>
                )}
                {stat.avatars && (
                  <div className="flex -space-x-2">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://i.pravatar.cc/150?img=1" alt="" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://i.pravatar.cc/150?img=2" alt="" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://i.pravatar.cc/150?img=3" alt="" />
                  </div>
                )}
                {stat.icon && (
                  <span className="material-symbols-outlined text-orange-400 text-xl">{stat.icon}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel flex flex-col rounded-xl overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <div className="flex w-full items-center rounded-lg bg-slate-900/50 border border-white/10 input-glass">
                <div className="flex h-12 w-12 items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="h-12 w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm" 
                  placeholder="Search by name, email, or phone..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(19,200,236,0.2)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                <span>All Users</span>
                <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] text-black font-bold">{users.length}</span>
              </button>
              <button 
                onClick={() => setFilterStatus('active')}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                <span>Active</span>
              </button>
              <button 
                onClick={() => setFilterStatus('banned')}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  filterStatus === 'banned'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                <span>Banned</span>
              </button>
              <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-500 text-xs font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Bookings</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                              <img className="h-full w-full object-cover" src={user.image} alt={user.name} />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</div>
                              <div className="text-xs text-slate-500">Member since {user.since}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-300">{user.email}</span>
                            <span className="text-xs font-mono text-slate-500">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-md bg-${user.roleColor}-500/10 px-2.5 py-1 text-xs font-medium text-${user.roleColor}-400 border border-${user.roleColor}-500/20`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.statusColor === 'primary' ? (
                              <>
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                </span>
                                <span className="text-slate-200">{user.status}</span>
                              </>
                            ) : (
                              <>
                                <span className={`h-2.5 w-2.5 rounded-full bg-${user.statusColor}-500`}></span>
                                <span className={`text-${user.statusColor}-400`}>{user.status}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-bold text-white text-base">{user.bookings}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="rounded p-1.5 text-slate-400 hover:bg-primary/20 hover:text-primary transition-colors" 
                              title="View Profile"
                            >
                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </motion.button>
                            {user.banned ? (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleBanUser(user.id)}
                                className="rounded p-1.5 text-slate-400 hover:bg-green-500/20 hover:text-green-400 transition-colors" 
                                title="Unban User"
                              >
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                              </motion.button>
                            ) : user.pending ? (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleApproveUser(user.id)}
                                className="rounded p-1.5 text-slate-400 hover:bg-green-500/20 hover:text-green-400 transition-colors" 
                                title="Approve"
                              >
                                <span className="material-symbols-outlined text-[20px]">check</span>
                              </motion.button>
                            ) : (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleBanUser(user.id)}
                                className="rounded p-1.5 text-slate-400 hover:bg-orange-500/20 hover:text-orange-400 transition-colors" 
                                title="Ban User"
                              >
                                <span className="material-symbols-outlined text-[20px]">block</span>
                              </motion.button>
                            )}
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(user.id)}
                              className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors" 
                              title="Delete User"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/40 p-4">
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">{filteredUsers.length}</span> of <span className="text-white font-medium">{users.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-bold shadow-[0_0_10px_rgba(19,200,236,0.4)]">1</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">2</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">3</button>
              <span className="text-slate-500">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">25</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
              <p className="text-slate-400 text-sm mb-6">This feature is coming soon! User management functionality will be implemented shortly.</p>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-full px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserManagement
