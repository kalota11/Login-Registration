import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * @param {Component} component - Component to render if authenticated
 * @param {Boolean} adminOnly - If true, only admins can access
 * @returns {JSX} - Protected route component
 */
const ProtectedRoute = ({ component: Component, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the component if all checks pass
  return <Component />;
};

export default ProtectedRoute;
