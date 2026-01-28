import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Menu, X, Bell } from 'lucide-react'
import logo from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {/* Desktop Sidebar - Always visible on md and up */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden bg-white p-4 flex justify-between items-center border-b shadow-sm z-20">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Page Content Rendered Here */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-2xl"
            >
              {/* Mobile Sidebar Header */}
              <div className="p-6 flex items-center justify-between border-b border-gray-200">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <MobileSidebarContent 
                navigate={navigate} 
                closeSidebar={() => setSidebarOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mobile Sidebar Content Component
const MobileSidebarContent = ({ navigate, closeSidebar }) => {
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Vehicles', path: '/admin/vehicles' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Payments', path: '/admin/payments' },
    { label: 'Promotions', path: '/admin/promotions' },
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Damage Reports', path: '/admin/damage' },
  ]

  const handleNavigate = (path) => {
    navigate(path)
    closeSidebar()
  }

  return (
    <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleNavigate(item.path)}
          className="block w-full text-left p-3 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
        >
          {item.label}
        </button>
      ))}
      
      {/* Mobile Logout */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={() => {
            if (window.confirm('Logout?')) {
              localStorage.removeItem('adminToken')
              localStorage.removeItem('adminUser')
              navigate('/admin/login')
            }
          }}
          className="block w-full text-left p-3 font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminLayout
