import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BrowseCars from "./pages/BrowseCars";
import CarDetails from "./pages/CarDetails"; // <-- file is CarDetails.jsx
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import AIAssistant from "./pages/AIAssistant";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse-cars"
          element={
            <ProtectedRoute>
              <BrowseCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/car/:id"
          element={
            <ProtectedRoute>
              <CarDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
