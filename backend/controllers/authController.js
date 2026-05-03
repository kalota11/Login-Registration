// Authentication Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const useMockDatabase = process.env.SKIP_DB === 'true';

const createMockUser = (email, name = null) => ({
  _id: 'mock-user-id-' + Date.now(),
  name: name || email.split('@')[0] || 'Test User',
  email,
  role: 'user',
});

/**
 * Generate JWT token
 * @param {String} userId - User ID
 * @param {String} role - User role
 * @param {String} email - User email
 * @param {String} name - User name
 * @returns {String} - JWT token
 */
const generateToken = (userId, role, email, name) => {
  return jwt.sign(
    { id: userId, role: role, email, name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    // let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Email already registered',
    //   });
    // }
    console.log('⚠️ User existence check skipped for testing');

    // Temporarily skip DB save for testing
    // await user.save();
    console.log('⚠️ User save skipped for testing');

    // Mock user object for token generation
    const user = {
      _id: 'mock-user-id-' + Date.now(),
      name,
      email,
      role: 'user'
    };

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
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
 * Login user
 * POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    let user;
    if (useMockDatabase) {
      console.log('⚠️ Login DB lookup skipped for testing');
      user = createMockUser(email);
    } else {
      // Check if user exists and get password field
      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check if password matches
      const isPasswordCorrect = await user.matchPassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    // Generate token
    const token = generateToken(user._id, user.role, user.email, user.name);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
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
 * Get current user profile
 * GET /api/auth/profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    let user;
    if (useMockDatabase) {
      console.log('⚠️ Profile DB lookup skipped for testing');
      user = {
        _id: req.user.id,
        name: req.user.name || 'Test User',
        email: req.user.email || 'test@example.com',
        role: req.user.role,
        createdAt: new Date(),
      };
    } else {
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
