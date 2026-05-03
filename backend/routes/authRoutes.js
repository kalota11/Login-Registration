// Authentication Routes
const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * @body {String} name - User's full name
 * @body {String} email - User's email
 * @body {String} password - User's password
 * @body {String} confirmPassword - Confirm password
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is required'),
  ],
  register
);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 * @body {String} email - User's email
 * @body {String} password - User's password
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  login
);

/**
 * GET /api/auth/profile
 * Get current user's profile (requires authentication)
 */
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
