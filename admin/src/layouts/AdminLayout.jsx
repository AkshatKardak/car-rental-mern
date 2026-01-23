// File: admin/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden text-gray-800">
      
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden bg-white p-4 flex justify-between items-center border-b shadow-sm z-20">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu size={24} />
            </button>
        </div>

        {/* Page Content Rendered Here */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
            <Outlet />
        </div>
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
               <div className="p-6 flex items-center justify-between border-b">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
              </div>
              <div className="p-4 space-y-2">
                  <button onClick={() => {navigate('/admin/dashboard'); setSidebarOpen(false)}} className="block w-full text-left p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</button>
                  <button onClick={() => {navigate('/admin/vehicles'); setSidebarOpen(false)}} className="block w-full text-left p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Vehicles</button>
                  <button onClick={() => {navigate('/admin/bookings'); setSidebarOpen(false)}} className="block w-full text-left p-3 font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Bookings</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
