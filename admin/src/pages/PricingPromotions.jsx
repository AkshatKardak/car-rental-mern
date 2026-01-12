import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PricingPromotions = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-full bg-dashboard-gradient overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <ContentArea />
      </main>
    </div>
  )
}

const Sidebar = ({ navigate }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: 'group', label: 'User Management', active: false, path: '/admin/users' },
    { icon: 'payments', label: 'Payments', active: false, path: '/admin/payments' },
    { icon: 'directions_car', label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: 'calendar_month', label: 'Bookings', active: false, path: '#' },
    { icon: 'sell', label: 'Pricing & Promotions', active: true, path: '/admin/promotions' },
    { icon: 'car_crash', label: 'Damage Management', active: false, path: '/admin/damage' },
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
              style={{ fontVariationSettings: item.active ? '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
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
  const [searchQuery, setSearchQuery] = useState('')
  const [promotions] = useState([
    {
      code: 'SUMMER2024',
      name: 'Summer campaign',
      type: 'Percentage',
      typeColor: 'purple',
      value: '20% Off',
      expiry: 'Dec 31, 2024',
      used: 450,
      limit: 1000,
      active: true,
      expired: false
    },
    {
      code: 'WELCOME50',
      name: 'New user bonus',
      type: 'Fixed Amount',
      typeColor: 'blue',
      value: '$50.00 Off',
      expiry: 'Unlimited',
      used: 1204,
      limit: null,
      active: true,
      expired: false
    },
    {
      code: 'FLASH24H',
      name: 'Flash sale',
      type: 'Percentage',
      typeColor: 'slate',
      value: '15% Off',
      expiry: 'Expired',
      used: 500,
      limit: 500,
      active: false,
      expired: true
    },
    {
      code: 'VIP_Upgrade',
      name: 'Loyalty tier 2',
      type: 'Percentage',
      typeColor: 'purple',
      value: '10% Off',
      expiry: 'Dec 31, 2025',
      used: 88,
      limit: 200,
      active: true,
      expired: false
    },
    {
      code: 'WEEKEND25',
      name: 'Weekend Special',
      type: 'Percentage',
      typeColor: 'purple',
      value: '25% Off',
      expiry: 'Nov 15, 2024',
      used: 12,
      limit: 50,
      active: true,
      expired: false
    },
  ])

  const handleToggleActive = (code) => {
    alert(`Toggling status for ${code}`)
  }

  const handleEdit = (code) => {
    alert(`Editing ${code}`)
  }

  const handleDelete = (code) => {
    if (confirm(`Are you sure you want to delete ${code}?`)) {
      alert(`Deleted ${code}`)
    }
  }

  const handleCreatePromo = () => {
    alert('Create Promotion modal would open here!')
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm z-20">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-white tracking-tight">Pricing & Promotions</h2>
          <p className="text-sm text-slate-400">Manage marketing campaigns, coupons, and seasonal discounts</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">Help Center</button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-6 relative group overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary">local_activity</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1">Active Promos</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold text-white">12</h3>
                  <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center">
                    <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +2%
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-transparent opacity-50"></div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-xl p-6 relative group overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-purple-400">shopping_bag</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1">Total Redeemed</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold text-white">450</h3>
                  <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center">
                    <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +15%
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-transparent opacity-50"></div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-xl p-6 relative group overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-pink-400">savings</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1">Discount Volume</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold text-white">$12,400</h3>
                  <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center">
                    <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +8%
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-pink-500 to-transparent opacity-50"></div>
            </motion.div>
          </div>

          {/* Toolbar & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              {/* Search */}
              <div className="relative group w-full md:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input 
                  className="block w-full p-2.5 pl-10 text-sm text-white bg-slate-800/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500 transition-all backdrop-blur-sm" 
                  placeholder="Search by code or name..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Filters */}
              <div className="hidden md:flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors">
                  <span>Status: All</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors">
                  <span>Type: All</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              </div>
            </div>
            {/* Main Action */}
            <button 
              onClick={handleCreatePromo}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-primary rounded-lg shadow-neon hover:bg-white hover:shadow-[0_0_25px_rgba(19,200,236,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create Promotion
            </button>
          </div>

          {/* Data Table */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Promo Code</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Type</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Value</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Expiry</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase w-48">Usage Limit</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {promotions.map((promo, index) => (
                    <motion.tr 
                      key={promo.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-white/5 transition-colors group ${promo.expired ? 'opacity-60 hover:opacity-100' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold tracking-wide ${promo.expired ? 'text-slate-300 line-through decoration-slate-500' : 'text-white'}`}>
                            {promo.code}
                          </span>
                          <span className="text-xs text-slate-500">{promo.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium ${
                          promo.typeColor === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          promo.typeColor === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                        }`}>
                          {promo.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white font-medium">{promo.value}</td>
                      <td className="p-4 text-sm">
                        {promo.expired ? (
                          <span className="text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">warning</span> Expired
                          </span>
                        ) : (
                          <span className="text-slate-400">{promo.expiry}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="w-full flex flex-col gap-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{promo.used} used</span>
                            <span>{promo.limit ? `${promo.limit} limit` : '∞'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                promo.expired ? 'bg-emerald-500' :
                                promo.limit ? 'bg-gradient-to-r from-primary to-purple-500' : 'bg-slate-500 opacity-30'
                              }`}
                              style={{ width: promo.limit ? `${(promo.used / promo.limit) * 100}%` : '100%' }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            checked={promo.active} 
                            className="sr-only peer" 
                            type="checkbox"
                            onChange={() => handleToggleActive(promo.code)}
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(promo.code)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(promo.code)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing <span className="text-white font-medium">1-5</span> of <span className="text-white font-medium">12</span> promotions
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium text-slate-400 bg-white/5 rounded hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 text-xs font-medium text-slate-400 bg-white/5 rounded hover:bg-white/10 hover:text-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPromotions
