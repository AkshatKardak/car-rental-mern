import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import VehicleManagement from './pages/VehicleManagement'
import BookingManagement from './pages/BookingManagement'
import Analytics from './pages/Analytics'
import DamageManagement from './pages/DamageManagement'
import AdminLayout from './layouts/AdminLayout'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<VehicleManagement />} />
          <Route path="/admin/bookings" element={<BookingManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/damage" element={<DamageManagement />} />

          {/* If user hits an unknown admin route, keep them in admin (don’t send to login) */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
