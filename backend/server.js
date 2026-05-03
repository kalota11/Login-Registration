// Main Express Server File
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Middleware
// Enable CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3005',
  'http://localhost:3000', // Alternative frontend URL
  'http://localhost:3003', // Additional frontend URL
  'http://localhost:3007', // Vite dev server default
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Handle preflight OPTIONS requests
app.options('*', cors()); // Enable preflight for all routes

// Parse incoming JSON requests
app.use(express.json());

// Parse incoming URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Debug endpoint to check registered users
app.get('/api/debug/users', (req, res) => {
  // Import the users array from authController
  const authController = require('./controllers/authController');
  const userCount = authController.users ? authController.users.length : 0;
  const userEmails = authController.users ? authController.users.map(u => u.email) : [];
  res.json({
    success: true,
    userCount,
    userEmails,
    message: 'Debug info for registered users'
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server after the database is connected
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    // Using in-memory storage - no DB connection needed
    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on port ${PORT}`);
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3005'}`);
      console.log('✓ Using in-memory user storage\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

module.exports = app;
