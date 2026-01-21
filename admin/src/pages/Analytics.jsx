import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CarFront,
  CalendarDays,
  IndianRupee,
  ChevronRight,
  PieChart,
  Star,
  Wallet,
  History,
  Search,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  CreditCard,
  Settings,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  UserPlus,
  Clock
} from 'lucide-react'

const Analytics = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Dummy Analytics Data
  const analytics = {
    totalRevenue: 2847500,
    totalBookings: 342,
    totalUsers: 156,
    totalVehicles: 45,
    revenueGrowth: 23.5,
    bookingsGrowth: 18.2,
    usersGrowth: 12.8,
    vehiclesGrowth: 8.5,
    monthlyRevenue: [
      { month: 'Aug', revenue: 385000, bookings: 42 },
      { month: 'Sep', revenue: 420000, bookings: 48 },
      { month: 'Oct', revenue: 398000, bookings: 45 },
      { month: 'Nov', revenue: 512000, bookings: 58 },
      { month: 'Dec', revenue: 647000, bookings: 72 },
      { month: 'Jan', revenue: 485500, bookings: 77 }
    ],
    popularVehicles: [
      { name: 'Tesla Model 3', bookings: 45, revenue: 450000 },
      { name: 'BMW X5', bookings: 38, revenue: 380000 },
      { name: 'Mercedes E-Class', bookings: 35, revenue: 525000 },
      { name: 'Audi Q7', bookings: 32, revenue: 512000 },
      { name: 'Range Rover Sport', bookings: 28, revenue: 448000 }
    ],
    recentActivity: [
      { type: 'booking', user: 'Rajesh Kumar', action: 'Booked Tesla Model 3', amount: 45000, time: '2 hours ago' },
      { type: 'payment', user: 'Priya Sharma', action: 'Payment received', amount: 32000, time: '3 hours ago' },
      { type: 'user', user: 'Amit Patel', action: 'New user registration', amount: 0, time: '5 hours ago' },
      { type: 'booking', user: 'Sneha Reddy', action: 'Booked Audi Q7', amount: 72000, time: '8 hours ago' },
      { type: 'damage', user: 'Vikram Singh', action: 'Reported minor damage', amount: 5000, time: '10 hours ago' },
      { type: 'payment', user: 'Anjali Mehta', action: 'Payment received', amount: 98000, time: '12 hours ago' }
    ],
    statusDistribution: [
      { status: 'Confirmed', count: 128, percentage: 37, color: 'bg-green-500' },
      { status: 'Completed', count: 156, percentage: 46, color: 'bg-blue-500' },
      { status: 'Pending', count: 42, percentage: 12, color: 'bg-orange-400' },
      { status: 'Cancelled', count: 16, percentage: 5, color: 'bg-red-500' }
    ],
    topCustomers: [
      { name: 'Rajesh Kumar', bookings: 12, spent: 180000 },
      { name: 'Priya Sharma', bookings: 10, spent: 165000 },
      { name: 'Amit Patel', bookings: 9, spent: 142000 },
      { name: 'Sneha Reddy', bookings: 8, spent: 128000 },
      { name: 'Vikram Singh', bookings: 7, spent: 112000 }
    ],
    paymentMethods: [
      { method: 'UPI', count: 145, percentage: 42, icon: <Smartphone size={14} />, color: 'bg-indigo-500' },
      { method: 'Credit Card', count: 120, percentage: 35, icon: <CreditCard size={14} />, color: 'bg-blue-500' },
      { method: 'Debit Card', count: 52, percentage: 15, icon: <CreditCard size={14} />, color: 'bg-blue-400' },
      { method: 'Net Banking', count: 25, percentage: 8, icon: <Wallet size={14} />, color: 'bg-green-500' }
    ]
  }

  return (
    <div className="relative flex h-screen w-full bg-background-secondary overflow-hidden text-text-primary">
      <Sidebar navigate={navigate} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header setSidebarOpen={setSidebarOpen} />
        <ContentArea analytics={analytics} timeRange={timeRange} setTimeRange={setTimeRange} />
      </main>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl">
              <div className="p-6 flex items-center justify-between border-b border-border-light">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-xl transition-colors"><X size={20} /></button>
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
    { icon: <Users size={20} />, label: 'User Management', active: false, path: '/admin/users' },
    { icon: <CarFront size={20} />, label: 'Vehicles', active: false, path: '/admin/vehicles' },
    { icon: <CreditCard size={20} />, label: 'Payments', active: false, path: '/admin/payments' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', active: false, path: '/admin/bookings' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', active: true, path: '/admin/analytics' },
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
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={item.active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}>{item.icon}</span>
            <span className={`text-sm font-black tracking-tight ${item.active ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
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

const Header = ({ setSidebarOpen }) => (
  <header className="flex h-20 items-center justify-between px-8 py-4 bg-white border-b border-border-light z-30 shadow-sm">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-background-secondary rounded-xl hover:bg-border-light transition-colors"><Menu size={20} /></button>
      <div className="hidden md:flex items-center gap-3 text-xs font-black tracking-widest uppercase text-text-secondary/60">
        <span className="hover:text-primary cursor-pointer transition-colors">Workspace</span>
        <ChevronRight size={12} />
        <span className="text-text-primary">Operational Intelligence</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light bg-white text-text-secondary hover:bg-background-secondary hover:text-primary transition-all shadow-sm">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
      </button>
    </div>
  </header>
)

const ContentArea = ({ analytics, timeRange, setTimeRange }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
      <div className="max-w-[1800px] mx-auto space-y-10">
        {/* Header */}
        <motion.header initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Strategic <span className="text-primary italic">Insights</span></h2>
            <p className="text-text-secondary text-lg mt-1 font-medium">Multidimensional analysis of fleet performance and user acquisition.</p>
          </div>
          <div className="flex gap-1.5 p-1.5 bg-white border border-border-light rounded-2xl shadow-xl shadow-black/5">
            {['week', 'month', 'year'].map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'}`}>
                {range}
              </button>
            ))}
          </div>
        </motion.header>

        {/* Global Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Gross Dividend', value: `₹${analytics.totalRevenue.toLocaleString()}`, growth: analytics.revenueGrowth, icon: <IndianRupee size={20} />, color: 'primary' },
            { label: 'Active Contracts', value: analytics.totalBookings, growth: analytics.bookingsGrowth, icon: <CalendarDays size={20} />, color: 'blue-500' },
            { label: 'Node Expansion', value: analytics.totalUsers, growth: analytics.usersGrowth, icon: <Users size={20} />, color: 'indigo-500' },
            { label: 'Fleet Density', value: analytics.totalVehicles, growth: analytics.vehiclesGrowth, icon: <CarFront size={20} />, color: 'orange-500' }
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-7 border border-border-light shadow-xl shadow-black/5 group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-background-secondary text-primary rounded-2xl group-hover:bg-primary/10 transition-colors uppercase">{stat.icon}</div>
                <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black flex items-center gap-1 group-hover:scale-110 transition-transform">
                  <TrendingUp size={12} /> {stat.growth}%
                </div>
              </div>
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{stat.label}</p>
              <h3 className="text-3xl font-black text-text-primary tracking-tight">{stat.value}</h3>
              <p className="text-[9px] text-text-secondary font-bold opacity-30 mt-3 uppercase tracking-widest">Calculated against last {timeRange}</p>
            </motion.div>
          ))}
        </div>

        {/* Intelligence Charts Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-[40px] p-10 border border-border-light shadow-2xl shadow-black/5">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl"><BarChart3 size={24} /></div>
                <div><h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Revenue <span className="text-primary italic">Drilldown</span></h3><p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">6-Month cyclical performance audit</p></div>
              </div>
            </div>
            <div className="space-y-8">
              {analytics.monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue))
                const percentage = (item.revenue / maxRevenue) * 100
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{item.month}</span>
                      <span className="text-base font-black text-text-primary">₹{item.revenue.toLocaleString()} <span className="text-[9px] opacity-30 font-bold ml-2">({item.bookings} Books)</span></span>
                    </div>
                    <div className="h-3 w-full bg-background-secondary rounded-full overflow-hidden border border-border-light">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: 0.8 + (index * 0.1), duration: 1 }} className="h-full bg-primary" />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-[40px] p-10 border border-border-light shadow-2xl shadow-black/5">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl"><CarFront size={24} /></div>
                <div><h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Vehicle <span className="text-primary italic">Power</span></h3><p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">Top assets by reservation volume</p></div>
              </div>
            </div>
            <div className="space-y-8">
              {analytics.popularVehicles.map((item, index) => {
                const maxBooks = 50
                const percentage = (item.bookings / maxBooks) * 100
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2"><span className="text-primary">0{index + 1}</span> {item.name}</span>
                      <span className="text-base font-black text-text-primary">{item.bookings} <span className="text-[9px] opacity-30 font-bold ml-2">Contracts</span></span>
                    </div>
                    <div className="h-3 w-full bg-background-secondary rounded-full overflow-hidden border border-border-light">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: 1 + (index * 0.1), duration: 1 }} className="h-full bg-indigo-500" />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Section B: Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white rounded-[40px] p-8 border border-border-light shadow-2xl shadow-black/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-background-secondary text-primary rounded-xl"><PieChart size={20} /></div>
              <p className="text-sm font-black text-text-primary uppercase tracking-widest">Status Vectors</p>
            </div>
            <div className="space-y-5">
              {analytics.statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background-secondary border border-border-light group hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">{item.status}</span>
                  </div>
                  <span className="text-xs font-black text-text-primary">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-border-light shadow-2xl shadow-black/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-background-secondary text-primary rounded-xl"><Star size={20} /></div>
              <p className="text-sm font-black text-text-primary uppercase tracking-widest">High-Net Clusters</p>
            </div>
            <div className="space-y-4">
              {analytics.topCustomers.map((c, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:bg-primary group-hover:text-white transition-all">{c.name.charAt(0)}</div>
                    <div><p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{c.name}</p><p className="text-[9px] font-bold text-text-secondary opacity-50 uppercase">{c.bookings} BOOKS</p></div>
                  </div>
                  <span className="text-xs font-black text-primary">₹{c.spent.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-border-light shadow-2xl shadow-black/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-background-secondary text-primary rounded-xl"><Wallet size={20} /></div>
              <p className="text-sm font-black text-text-primary uppercase tracking-widest">Channel Mix</p>
            </div>
            <div className="space-y-6 pt-2">
              {analytics.paymentMethods.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2">{m.icon} {m.method}</span>
                    <span>{m.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-background-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.percentage}%` }} transition={{ delay: 1.2 + i * 0.1 }} className={`h-full ${m.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Operations Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-white rounded-[48px] p-10 border border-border-light shadow-2xl shadow-black/5 mb-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl"><History size={24} /></div>
              <div><h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">System <span className="text-primary italic">Live Log</span></h3><p className="text-[10px] font-bold text-text-secondary opacity-50 uppercase tracking-widest">Latest 6 cryptographic operations verified</p></div>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-background-secondary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-border-light">Full History</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.recentActivity.map((a, i) => (
              <div key={i} className="p-6 rounded-3xl bg-background-secondary border border-border-light flex gap-5 group hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white border border-border-light flex items-center justify-center text-primary shadow-sm uppercase group-hover:scale-110 transition-transform">
                  {a.type === 'booking' ? <CalendarDays size={20} /> : a.type === 'payment' ? <IndianRupee size={20} /> : a.type === 'user' ? <UserPlus size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-text-primary uppercase tracking-tight truncate">{a.user}</p>
                  <p className="text-[10px] font-bold text-text-secondary opacity-60 uppercase mb-3 truncate">{a.action}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border-light/50">
                    <span className="text-[10px] font-black text-primary">{a.amount > 0 ? `₹${a.amount.toLocaleString()}` : 'VERIFIED'}</span>
                    <span className="text-[9px] font-bold text-text-secondary opacity-30 flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
