// Authorization Middleware

/**
 * Check if user is admin
 * Must be used after authMiddleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Authorization failed',
      error: error.message,
    });
  }
};

module.exports = adminMiddleware;
