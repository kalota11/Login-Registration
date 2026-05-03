import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Navbar Component
 * Displays navigation menu with links based on user role
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-100">
            🔐 Auth App
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* User Name */}
                <span className="text-sm font-semibold">
                  Welcome, <span className="text-blue-100">{user?.name}</span>
                </span>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="hover:text-blue-100 transition-colors"
                >
                  Dashboard
                </Link>

                {/* Admin Panel Link (only for admins) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hover:text-blue-100 transition-colors font-semibold"
                  >
                    👨‍💼 Admin
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link
                  to="/login"
                  className="hover:text-blue-100 transition-colors"
                >
                  Login
                </Link>

                {/* Register Link */}
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
