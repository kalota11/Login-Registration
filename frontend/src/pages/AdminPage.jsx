import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertMessage } from '../components/FormComponents.jsx';

/**
 * Admin Page
 * Allows admins to manage users, view dashboard stats, and control user roles
 */
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch admin dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      const { data } = response.data;

      setStats({
        totalUsers: data.totalUsers,
        adminUsers: data.adminUsers,
        regularUsers: data.regularUsers,
      });
      setUsers(data.users);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user role
   */
  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_URL}/admin/user/${userId}`, {
        role: newRole,
      });

      setSuccessMessage(`User role updated to ${newRole}`);
      setSelectedUser(null);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh data
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/admin/user/${userId}`);

      setSuccessMessage('User deleted successfully');
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh data
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👨‍💼 Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and view system statistics</p>
        </div>

        {/* Messages */}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        {successMessage && (
          <AlertMessage
            type="success"
            message={successMessage}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          {/* Admin Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Admin Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.adminUsers}</p>
              </div>
              <span className="text-4xl">🔑</span>
            </div>
          </div>

          {/* Regular Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Regular Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.regularUsers}</p>
              </div>
              <span className="text-4xl">👤</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">📋 All Users</h2>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role === 'admin' ? '🔑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Edit User: {selectedUser.name}
              </h3>

              <p className="text-gray-600 mb-4">
                Current Role: <strong>{selectedUser.role}</strong>
              </p>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    updateUserRole(
                      selectedUser._id,
                      selectedUser.role === 'admin' ? 'user' : 'admin'
                    )
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Change to {selectedUser.role === 'admin' ? 'User' : 'Admin'}
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-2xl font-bold text-red-600 mb-4">Delete User?</h3>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
                <br />
                This action cannot be undone.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => deleteUser(deleteConfirm._id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Yes, Delete User
                </button>

                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
