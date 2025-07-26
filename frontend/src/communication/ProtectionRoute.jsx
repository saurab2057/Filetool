import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/communication/AuthContext'; // Adjust path as needed

const  ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading session...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Better to redirect to login
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;