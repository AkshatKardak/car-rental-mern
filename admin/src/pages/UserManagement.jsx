import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CarFront,
  CreditCard,
  CalendarDays,
  Tag,
  AlertTriangle,
  BarChart3,
  Settings,
  X,
  Menu,
  Bell,
  Mail,
  Phone,
  Clock,
  ExternalLink
} from 'lucide-react'

const UserManagement = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      {/* Sidebar - Desktop */}
      <Sidebar navigate={navigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea />
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-border-light">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <SidebarContent navigate={navigate} closeMobile={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const Sidebar = ({ navigate }) => (
  <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border-light z-20 h-full shadow-xl shadow-black/5">
    <div className="p-8 pb-10 flex items-center justify-center">
      <img src={logo} alt="RentRide Logo" className="h-9 w-auto object-contain" />
    </div>
    <SidebarContent navigate={navigate} />
  </aside>
)

const SidebarContent = ({ navigate, closeMobile }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: false, path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', active: true, path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: <CreditCard size={20} />, label: 'Payments', active: false, path: '/admin/payments' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', active: false, path: '/admin/bookings' },
  ]

  const handleNav = (path) => {
    navigate(path)
    if (closeMobile) closeMobile()
  }

  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex-1 flex flex-col gap-1 px-4 py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNav(item.path)}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${item.active
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={item.active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}>
              {item.icon}
            </span>
            <span className={`text-sm font-black tracking-tight ${item.active ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}

        <div className="pt-6 mt-6 border-t border-border-light">
          <p className="px-5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">System</p>
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-all">
            <Settings size={20} />
            <span className="text-sm font-black tracking-tight opacity-80">Settings</span>
          </button>
        </div>
      </nav>

      <div className="p-5 border-t border-border-light bg-background-secondary/30">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-border-light shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">AM</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-primary truncate">Admin</p>
            <p className="text-[10px] text-text-secondary font-bold truncate opacity-60 uppercase">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-background-secondary rounded-xl hover:bg-border-light transition-colors">
          <Menu size={20} />
        </button>
        {/* Breadcrumbs */}
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
            placeholder="Search by identity..."
            type="text"
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
  const stats = [
    { label: 'Registered Fleet', value: '12,450', trend: '+2.5%', trendUp: true },
    { label: 'Active Drivers', value: '10,820', progress: 85 },
    { label: 'New This Week', value: '342', avatars: true },
    { label: 'Awaiting ID', value: '48', warning: true },
  ]

  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Drale', email: 'alex.drale@rentride.com', phone: '+1 (555) 123-4567', role: 'Premium', status: 'Active', bookings: 24, since: '2023', image: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+1 (555) 987-6543', role: 'Standard', status: 'Offline', bookings: 3, since: '2024', image: 'https://i.pravatar.cc/150?img=45' },
    { id: 3, name: 'Michael Ross', email: 'm.ross88@outlook.com', phone: '+44 7700 900077', role: 'Premium', status: 'Banned', bookings: 0, since: '2022', image: 'https://i.pravatar.cc/150?img=33' },
    { id: 4, name: 'Emily Chen', email: 'emily.c@techcorp.io', phone: '+1 (415) 555-0100', role: 'Corporate', status: 'Active', bookings: 156, since: '2023', image: 'https://i.pravatar.cc/150?img=47' },
    { id: 5, name: 'David Kim', email: 'david.kim@example.org', phone: '+1 (202) 555-0122', role: 'Standard', status: 'Pending', bookings: 0, since: '2024', image: 'https://i.pravatar.cc/150?img=68' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Title Bar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">User <span className="text-primary italic">Directory</span></h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">Control panel for member permissions and fleet access.</p>
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

        {/* Analytics Mini-Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all cursor-default"
            >
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-text-primary tracking-tight">{stat.value}</span>
                {stat.trend && <span className="text-green-600 text-[10px] font-black bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">{stat.trend} <TrendingUp size={10} /></span>}
                {stat.progress && (
                  <div className="h-2 w-20 bg-background-secondary rounded-full overflow-hidden border border-border-light">
                    <div className="h-full bg-primary" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                )}
                {stat.avatars && (
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <img key={i} className="h-7 w-7 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="" />)}
                  </div>
                )}
                {stat.warning && <AlertTriangle size={20} className="text-red-500" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ledger Control Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[32px] border border-border-light shadow-2xl shadow-black/5 overflow-hidden flex flex-col"
        >
          {/* Controls Hook */}
          <div className="flex flex-col gap-6 p-8 border-b border-border-light lg:flex-row lg:items-center lg:justify-between bg-background-secondary/20">
            <div className="flex gap-2">
              {['all', 'active', 'banned'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterStatus === f
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white border-border-light text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                    }`}
                >
                  {f} {f === 'all' && `(${users.length})`}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-border-light text-xs font-black text-text-secondary hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest">
              <Filter size={16} /> Advanced Sorting
            </button>
          </div>

          {/* Core Table */}
          <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-light bg-background-secondary/10">
                  <th className="px-8 py-5">Identity Segment</th>
                  <th className="px-8 py-5">Contact Node</th>
                  <th className="px-8 py-5">Tier</th>
                  <th className="px-8 py-5">Status Token</th>
                  <th className="px-8 py-5 text-right">Activity</th>
                  <th className="px-8 py-5 text-center">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-background-secondary/40 transition-colors cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl border-2 border-border-light group-hover:border-primary/50 transition-all shadow-sm">
                          <img className="h-full w-full object-cover" src={user.image} alt={user.name} />
                        </div>
                        <div>
                          <div className="font-black text-text-primary uppercase tracking-tight text-sm group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-[10px] text-text-secondary font-bold opacity-60 uppercase">Node Since {user.since}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5 opacity-90">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                          <Mail size={12} className="text-primary" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary italic">
                          <Phone size={12} className="opacity-40" /> {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.role === 'Premium' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          user.role === 'Corporate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'Active' ? 'bg-primary shadow-[0_0_8px_rgba(16,163,16,0.6)] animate-pulse' :
                            user.status === 'Offline' ? 'bg-slate-300' :
                              user.status === 'Banned' ? 'bg-red-500' :
                                'bg-orange-400'
                          }`} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-text-primary opacity-80">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xl font-black text-text-primary">{user.bookings}</p>
                      <p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">Trips</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-border-light"><ExternalLink size={16} /></button>
                        <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-orange-50 hover:text-orange-500 transition-all border border-border-light"><ShieldAlert size={16} /></button>
                        <button className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all border border-border-light"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pager */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-t border-border-light bg-background-secondary/10">
            <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.1em] opacity-60 mb-4 sm:mb-0">Showing 05 of 12,450 entities registered</p>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all"><ChevronLeft size={18} /></button>
              <button className="w-10 h-10 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20">1</button>
              <button className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary font-black text-sm hover:bg-white transition-all">2</button>
              <button className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary font-black text-sm hover:bg-white transition-all">3</button>
              <button className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserManagement
