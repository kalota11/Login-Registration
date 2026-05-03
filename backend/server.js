// Main Express Server File
require('dotenv').config();
process.env.SKIP_DB = 'true';
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Middleware
// Enable CORS
const allowedOrigins = [
  'http://localhost:3005', // Frontend URL
  'http://localhost:3000', // Alternative frontend URL
  'http://localhost:3003', // Additional frontend URL
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
    // Temporarily skip DB connection for testing
    // await connectDB();
    console.log('⚠️ Database connection skipped for testing');
    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on port ${PORT}`);
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3005'}`);
      console.log(`✓ MongoDB: Skipped for testing\n`);
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
