import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertMessage } from '../components/FormComponents.jsx';

/**
 * Dashboard Page
 * Shows user profile information and welcome message
 */
const DashboardPage = () => {
  const { user, getProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        await getProfile();
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="container mx-auto">
        {/* Error Message */}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
          <p className="text-blue-100">
            You are currently logged in as a <strong>{user?.role.toUpperCase()}</strong> user
          </p>
          {isAdmin && (
            <p className="text-blue-100 mt-2">
              🔐 You have admin access. Visit the{' '}
              <a href="/admin" className="font-semibold hover:text-blue-50">
                Admin Panel
              </a>{' '}
              to manage users.
            </p>
          )}
        </div>

        {/* Profile Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Profile Information</h2>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="text-gray-600 text-sm font-semibold">Full Name</label>
                <p className="text-gray-800 text-lg">{user?.name}</p>
              </div>
              <div className="border-b pb-3">
                <label className="text-gray-600 text-sm font-semibold">Email Address</label>
                <p className="text-gray-800 text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm font-semibold">User Role</label>
                <p className="text-gray-800 text-lg">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isAdmin
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user?.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Account Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Account Stats</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold">Account Status</p>
                <p className="text-gray-800 text-lg font-bold">✅ Active</p>
              </div>
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-semibold">Authentication</p>
                <p className="text-gray-800 text-lg font-bold">🔐 Verified</p>
              </div>
              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm font-semibold">Access Level</p>
                <p className="text-gray-800 text-lg font-bold">
                  {isAdmin ? '🔑 Full Admin Access' : '📖 Standard User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start p-4 bg-blue-50 rounded">
              <span className="text-2xl mr-4">📝</span>
              <div>
                <h3 className="font-semibold text-gray-800">Profile Management</h3>
                <p className="text-gray-600 text-sm">View and manage your profile information</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-green-50 rounded">
              <span className="text-2xl mr-4">🔐</span>
              <div>
                <h3 className="font-semibold text-gray-800">Secure Authentication</h3>
                <p className="text-gray-600 text-sm">JWT-based secure session management</p>
              </div>
            </div>
            {isAdmin && (
              <>
                <div className="flex items-start p-4 bg-purple-50 rounded">
                  <span className="text-2xl mr-4">👨‍💼</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Admin Panel</h3>
                    <p className="text-gray-600 text-sm">Manage users and their roles</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-orange-50 rounded">
                  <span className="text-2xl mr-4">🛡️</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">User Management</h3>
                    <p className="text-gray-600 text-sm">View all users and control permissions</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <p className="text-yellow-800">
            <strong>💡 Tip:</strong> Your session is secured with JWT tokens. The token is stored
            securely in your browser and automatically included with every API request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
