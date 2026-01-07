import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to sign in if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
