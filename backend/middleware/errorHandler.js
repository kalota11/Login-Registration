// CORS and Error Handling Middleware

/**
 * Error handling middleware
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  const response = {
    success: false,
    message: err.message || 'Server error',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    response.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json(response);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    response.message = `${Object.keys(err.keyValue)[0]} already exists`;
    return res.status(400).json(response);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    response.message = 'Invalid token';
    return res.status(401).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    response.message = 'Token expired';
    return res.status(401).json(response);
  }

  // Default server error
  res
    .status(err.statusCode || 500)
    .json(response);
};

module.exports = errorHandler;
