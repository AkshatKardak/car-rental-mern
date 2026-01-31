import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DashboardNavbar from "./components/layout/DashboardNavbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import BrowseCars from "./pages/BrowseCars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import Offers from "./pages/OffersCode";
import AIAssistant from "./pages/AIAssistant";
import Dashboard from "./pages/AppDashboard";
import Aboutx from "./pages/Aboutx";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  // Landing pages: Show landing Navbar & Footer (for non-logged users)
  const landingRoutes = ["/", "/signin", "/signup"];
  const isLandingPage = landingRoutes.includes(location.pathname);

  // Dashboard routes: Show DashboardNavbar (for logged-in users)
  const dashboardRoutes = [
    "/dashboard", 
    "/browsecars", 
    "/mybookings", 
    "/payment", 
    "/offers", 
    "/aiassistant",
    "/booking-confirmation",
    "/payment-success"
  ];
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
      {/* Show Landing Navbar only on landing pages for non-logged users */}
      {isLandingPage && !isLoggedIn && <Navbar />}
      
      {/* Show Dashboard Navbar for logged-in users on dashboard pages */}
      {isLoggedIn && isDashboardPage && <DashboardNavbar />}

      <main>
        <Routes>
          {/* Public Routes - Redirect to dashboard if logged in */}
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />} 
          />
          <Route 
            path="/signin" 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />} 
          />
          <Route 
            path="/signup" 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />} 
          />

          {/* Browse Cars - accessible to all */}
          <Route path="/browsecars" element={<BrowseCars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/aiassistant" element={<AIAssistant />} />

          {/* Payment Success - accessible to all (callback from Razorpay) */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
        </Routes>
      </main>

      {/* Show Footer only on landing pages for non-logged users */}
      {isLandingPage && !isLoggedIn && <Footer />}
    </div>
  );
}
