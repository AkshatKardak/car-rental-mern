import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import VehicleManagement from './pages/VehicleManagement'
import BookingManagement from './pages/BookingManagement'
import AdminLayout from './layouts/AdminLayout' // Import the new layout

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/admin/vehicles" replace />} />

        {/* Wrap pages in AdminLayout */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/vehicles" element={<VehicleManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            {/* Add other routes here */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
