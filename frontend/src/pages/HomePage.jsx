import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Home Page
 * Landing page for the application
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔐 Modern Auth System
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Secure authentication with JWT, React, and Node.js
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">JWT Authentication</h3>
            <p className="text-gray-600">
              Secure token-based authentication with JSON Web Tokens
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Security</h3>
            <p className="text-gray-600">
              Passwords hashed with bcrypt for maximum security
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Admin and user roles with different access levels
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚛️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">React Frontend</h3>
            <p className="text-gray-600">
              Modern React UI with Tailwind CSS styling
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Express Backend</h3>
            <p className="text-gray-600">
              RESTful APIs built with Node.js and Express.js
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🗄️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">MongoDB Database</h3>
            <p className="text-gray-600">
              NoSQL database with Mongoose ODM
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-semibold text-gray-800">React 18</p>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-semibold text-gray-800">Tailwind CSS</p>
              <p className="text-sm text-gray-600">UI Styling</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <p className="font-semibold text-gray-800">Node.js</p>
              <p className="text-sm text-gray-600">Backend Runtime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <p className="font-semibold text-gray-800">Express.js</p>
              <p className="text-sm text-gray-600">Web Framework</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🗄️</div>
              <p className="font-semibold text-gray-800">MongoDB</p>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔗</div>
              <p className="font-semibold text-gray-800">Mongoose</p>
              <p className="text-sm text-gray-600">ODM</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔐</div>
              <p className="font-semibold text-gray-800">JWT</p>
              <p className="text-sm text-gray-600">Authentication</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="font-semibold text-gray-800">Bcrypt</p>
              <p className="text-sm text-gray-600">Password Hashing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
