import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/communication/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, authLoading } = useAuth();

  // 1. Show a loading state while we check for a session
  if (authLoading) {
    return <div>Loading session...</div>; // Or a spinner component
  }

  // 2. Redirect to homepage if user is not authenticated OR if their role is not 'admin'
  if (!isAuthenticated || user?.role !== 'admin') {
    // You can add a console warning for easier debugging
    console.warn("Admin route access denied. User not authenticated or not an admin.");
    return <Navigate to="/" replace />;
  }

  // 3. If everything is fine, render the requested component (e.g., AdminMainLayout)
  return children ? children : <Outlet />;
};

export default AdminRoute;