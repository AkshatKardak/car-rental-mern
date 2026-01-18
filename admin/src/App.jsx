import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import PaymentRevenue from './pages/PaymentRevenue'
import VehicleManagement from './pages/VehicleManagement'
import DamageManagement from './pages/DamageManagement'
import PricingPromotions from './pages/PricingPromotions'
import BookingManagement from './pages/BookingManagement'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/payments" element={<PaymentRevenue />} />
        <Route path="/admin/vehicles" element={<VehicleManagement />} />
        <Route path="/admin/damage" element={<DamageManagement />} />
        <Route path="/admin/promotions" element={<PricingPromotions />} />
        <Route path="/admin/bookings" element={<BookingManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  )
}

export default App
