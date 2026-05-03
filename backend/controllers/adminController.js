// Admin Controller
const User = require('../models/User');

/**
 * Get admin dashboard data
 * GET /api/admin/dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboard = async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get admin users count
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Get regular users count
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Get all users (excluding passwords)
    const users = await User.find().select('-password');

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved',
      data: {
        totalUsers,
        adminUsers,
        regularUsers,
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 * PUT /api/admin/user/:userId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"',
      });
    }

    // Find user and update role
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * DELETE /api/admin/user/:userId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  updateUserRole,
  deleteUser,
};
