import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import PaymentRevenue from './pages/PaymentRevenue'
import VehicleManagement from './pages/VehicleManagement'
import DamageManagement from './pages/DamageManagement'
import PricingPromotions from './pages/PricingPromotions'
import BookingManagement from './pages/BookingManagement'
import Analytics from './pages/Analytics'
import AdminLogin from './pages/AdminLogin'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><PaymentRevenue /></ProtectedRoute>} />
        <Route path="/admin/vehicles" element={<ProtectedRoute><VehicleManagement /></ProtectedRoute>} />
        <Route path="/admin/damage" element={<ProtectedRoute><DamageManagement /></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute><PricingPromotions /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
