import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import VehicleManagement from './pages/VehicleManagement'
import BookingManagement from './pages/BookingManagement'
import Analytics from './pages/Analytics'
import DamageManagement from './pages/DamageManagement'
import UserManagement from './pages/UserManagement'
import PaymentRevenue from './pages/PaymentRevenue'
import PricingPromotions from './pages/PricingPromotions'
import AdminLayout from './layouts/AdminLayout'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  
  useEffect(() => {
    console.log('🔒 ProtectedRoute Check:', {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    })
  }, [token])
  
  if (!token) {
    console.warn('❌ No token found - Redirecting to login')
    return <Navigate to="/admin/login" replace />
  }
  
  console.log('✅ Token verified - Rendering protected content')
  return children
}

function App() {
  // Monitor token changes globally
  useEffect(() => {
    const checkToken = setInterval(() => {
      const token = localStorage.getItem('adminToken')
      const currentPath = window.location.pathname
      
      if (!token && currentPath.startsWith('/admin/') && currentPath !== '/admin/login') {
        console.error('⚠️ Token disappeared! Current path:', currentPath)
      }
    }, 2000)

    return () => clearInterval(checkToken)
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Default Route - Redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected Routes - All admin pages */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="payments" element={<PaymentRevenue />} />
          <Route path="promotions" element={<PricingPromotions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="damage" element={<DamageManagement />} />
          
          {/* Catch-all for unknown admin routes */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Global fallback - redirect to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
