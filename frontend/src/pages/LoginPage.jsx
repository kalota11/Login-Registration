import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InputField, SubmitButton, AlertMessage } from '../components/FormComponents.jsx';

/**
 * Login Page
 * Allows users to login with email and password
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setErrorMessage('Please fix the errors below');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await login(formData.email, formData.password);

      setSuccessMessage('Login successful! Redirecting...');

      // Clear form
      setFormData({
        email: '',
        password: '',
      });

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <AlertMessage
            type="success"
            message={successMessage}
          />
        )}

        {/* Error Message */}
        {errorMessage && (
          <AlertMessage
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          {/* Submit Button */}
          <div className="pt-4">
            <SubmitButton
              text={loading ? 'Logging in...' : 'Login'}
              loading={loading}
            />
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Register here
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">
            <strong>Email:</strong> admin@example.com
          </p>
          <p className="text-xs text-gray-600 mb-2">
            <strong>Password:</strong> password123
          </p>
          <p className="text-xs text-gray-500 italic">
            (Create a new account to test registration)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
