import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

/**
 * Main App Component
 * Sets up routing and authentication context
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Navigation Bar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          {/* Dashboard - requires authentication */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={DashboardPage} />}
          />

          {/* Admin Panel - requires authentication and admin role */}
          <Route
            path="/admin"
            element={<ProtectedRoute component={AdminPage} adminOnly={true} />}
          />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
