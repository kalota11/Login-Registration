import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Manages authentication state and provides auth functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Configure axios instance to include token in headers
  const configureAxios = (authToken) => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      localStorage.setItem('token', authToken);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        configureAxios(storedToken);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Register new user
   * @param {String} name - User's name
   * @param {String} email - User's email
   * @param {String} password - User's password
   * @param {String} confirmPassword - Confirm password
   * @returns {Promise} - Response data
   */
  const register = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      const { token: authToken, user: userData } = response.data;

      // Save token and user
      setToken(authToken);
      setUser(userData);
      configureAxios(authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Login user
   * @param {String} email - User's email
   * @param {String} password - User's password
   * @returns {Promise} - Response data
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data;

      // Save token and user
      setToken(authToken);
      setUser(userData);
      configureAxios(authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    configureAxios(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  /**
   * Get user profile
   * @returns {Promise} - User profile data
   */
  const getProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return response.data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
