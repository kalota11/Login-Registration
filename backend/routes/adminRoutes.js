// Admin Routes
const express = require('express');
const { body, param } = require('express-validator');
const {
  getDashboard,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role

/**
 * GET /api/admin/dashboard
 * Get admin dashboard data (requires admin role)
 */
router.get(
  '/dashboard',
  authMiddleware,
  adminMiddleware,
  getDashboard
);

/**
 * PUT /api/admin/user/:userId
 * Update user role (requires admin role)
 * @param {String} userId - User ID
 * @body {String} role - New role (user or admin)
 */
router.put(
  '/user/:userId',
  authMiddleware,
  adminMiddleware,
  [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('role')
      .isIn(['user', 'admin'])
      .withMessage('Role must be "user" or "admin"'),
  ],
  updateUserRole
);

/**
 * DELETE /api/admin/user/:userId
 * Delete user (requires admin role)
 * @param {String} userId - User ID
 */
router.delete(
  '/user/:userId',
  authMiddleware,
  adminMiddleware,
  [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
  ],
  deleteUser
);

module.exports = router;
