// components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Fixed import path

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isTokenValid, logout, loading = false } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check token validity on route change if authenticated
    if (isAuthenticated && !isTokenValid()) {
      logout();
    }
  }, [isAuthenticated, isTokenValid, logout, location]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;