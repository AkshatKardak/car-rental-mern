import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Aboutx />} />
      <Route path="/browsecars" element={<BrowseCars />} />
      <Route path="/car/:id" element={<CarDetails />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/aiassistant" element={<AIAssistant />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}