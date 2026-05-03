# 📝 Code Style & Documentation Guide

This document outlines the coding standards and documentation practices used throughout the project.

## Table of Contents

1. [General Principles](#general-principles)
2. [File Organization](#file-organization)
3. [Naming Conventions](#naming-conventions)
4. [Code Comments](#code-comments)
5. [Error Handling](#error-handling)
6. [Async/Await Pattern](#asyncawait-pattern)
7. [Frontend Components](#frontend-components)
8. [Backend Routes](#backend-routes)

---

## General Principles

### Clean Code Practices

- ✅ **Single Responsibility**: Each function does one thing
- ✅ **DRY (Don't Repeat Yourself)**: Extract reusable logic
- ✅ **Descriptive Names**: Use clear, self-documenting names
- ✅ **Small Functions**: Keep functions focused and manageable
- ✅ **Comments for Why**: Explain the "why", not the "what"
- ✅ **Consistent Formatting**: Use consistent indentation and spacing
- ✅ **Error Handling**: Always handle errors gracefully

### Code Formatting

```javascript
// ✅ GOOD: Clear, consistent formatting
const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ BAD: Inconsistent spacing, unclear
const getUser=(id)=>{const u=await User.findById(id);return u;};
```

---

## File Organization

### Backend File Structure

```
backend/
├── config/
│   └── db.js              # Database configuration only
├── models/
│   └── User.js            # Data schemas only
├── controllers/
│   └── authController.js  # Business logic only
├── middleware/
│   └── authMiddleware.js  # Middleware functions only
├── routes/
│   └── authRoutes.js      # Route definitions only
└── server.js              # Server setup only
```

### Frontend File Structure

```
frontend/src/
├── components/
│   ├── Navbar.js          # Shared components
│   └── FormComponents.js  # Reusable form elements
├── context/
│   └── AuthContext.js     # Global state management
├── pages/
│   ├── HomePage.js        # Page-specific components
│   └── LoginPage.js
└── App.js                 # Main routing
```

### Keep Responsibilities Separated

```javascript
// ✅ GOOD: Separate concerns
// controllers/authController.js - only business logic
const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  const isValid = await user.matchPassword(password);
  return isValid;
};

// middleware/authMiddleware.js - only authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

// ❌ BAD: Mixed responsibilities
const authMiddleware = (req, res, next) => {
  // Should not have database logic here
  const user = await User.findById(id);
  const token = jwt.sign(user);
  // ...
};
```

---

## Naming Conventions

### Variables and Functions

```javascript
// ✅ GOOD: Clear, descriptive names
const isUserAuthenticated = true;
const fetchUserProfile = async () => {};
const calculateTotalPrice = (items) => {};
const MAX_RETRY_ATTEMPTS = 3;
const userRegistrationForm = {};

// ❌ BAD: Vague, unclear names
const flag = true;
const get = async () => {};
const calc = (x) => {};
const max = 3;
const form = {};
```

### File Names

```javascript
// ✅ GOOD: Clear, descriptive file names
authController.js      // Contains auth business logic
authMiddleware.js      // Contains auth middleware
LoginPage.js          // React login page component
FormComponents.js     // Reusable form components

// ❌ BAD: Generic or unclear
auth.js               // Too vague - what's it for?
utils.js              // Everything goes here
page.js               // Which page?
helper.js             // What does it help with?
```

### Class and Component Names

```javascript
// ✅ GOOD: PascalCase for classes and components
class UserService {}
const LoginPage = () => {};
const ProtectedRoute = () => {};

// ❌ BAD: Wrong casing
class userService {}
const loginPage = () => {};
const protectedRoute = () => {};
```

---

## Code Comments

### Comment Structure

```javascript
/**
 * Brief description of what the function does
 * @param {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 */
const functionName = (paramName) => {
  // Implementation
};
```

### Good Comments

```javascript
// ✅ GOOD: Explains the WHY and complex logic

/**
 * Verify if user's password matches the hashed password
 * Uses bcrypt comparison for security
 * @param {String} enteredPassword - Plain text password from user
 * @returns {Promise<Boolean>} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare is async and returns boolean
  return await bcrypt.compare(enteredPassword, this.password);
};

// We use findByIdAndUpdate with new:true to return updated document
// This prevents an extra database query
const user = await User.findByIdAndUpdate(
  userId,
  { role },
  { new: true, runValidators: true }
);

// Check admin role - admins have full access
if (req.user.role === 'admin') {
  next();
}
```

### Bad Comments

```javascript
// ❌ BAD: Obvious, stating the code

// Set user to admin
user.role = 'admin';

// Loop through users
for (let i = 0; i < users.length; i++) {
  // ...
}

// Check if user exists
if (user) {
  // ...
}

// This gets the user
const user = await User.findById(id);
```

### Comment Standards

- Use `//` for single-line comments
- Use `/** */` for function documentation
- Use comments to explain complex logic
- Keep comments updated with code
- Remove commented-out code (use git history instead)

```javascript
// ✅ GOOD: Comments explain non-obvious logic
// Use lean() to exclude password field and improve query performance
const user = await User.findById(id).lean();

// ❌ BAD: Remove commented-out code
// const user = await User.find();
// const admin = await Admin.find();
// const profile = await Profile.find();
```

---

## Error Handling

### Try/Catch Pattern

```javascript
// ✅ GOOD: Proper error handling with try/catch
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isValid = await user.matchPassword(password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

// ❌ BAD: No error handling
const login = (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const token = jwt.sign(user);
  res.json({ token }); // Crashes if user not found
};
```

### Error Messages

```javascript
// ✅ GOOD: User-friendly, specific error messages
return res.status(400).json({
  success: false,
  message: 'Email already registered',
});

return res.status(401).json({
  success: false,
  message: 'Invalid token',
});

// ❌ BAD: Vague or technical error messages
return res.status(400).json({ error: 'Failed' });
return res.status(500).json({ error: 'Server error' });
```

---

## Async/Await Pattern

```javascript
// ✅ GOOD: Use async/await for readability
const getUser = async (id) => {
  try {
    const user = await User.findById(id);
    const profile = await Profile.findOne({ userId: id });
    return { user, profile };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ✅ GOOD: Parallel requests with Promise.all
const getData = async (userId) => {
  try {
    const [user, posts, comments] = await Promise.all([
      User.findById(userId),
      Post.find({ userId }),
      Comment.find({ userId }),
    ]);
    return { user, posts, comments };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ❌ BAD: Unnecessary callback hell
const getUser = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) return callback(err);
    Profile.find({ userId: id }, (err, profile) => {
      if (err) return callback(err);
      callback(null, { user, profile });
    });
  });
};

// ❌ BAD: Sequential requests that could be parallel
const getData = async (userId) => {
  const user = await User.findById(userId); // Waits
  const posts = await Post.find({ userId }); // Then waits
  const comments = await Comment.find({ userId }); // Then waits
};
```

---

## Frontend Components

### Component Structure

```javascript
// ✅ GOOD: Well-organized component

import React, { useState } from 'react';
import axios from 'axios';

/**
 * LoginPage Component
 * Handles user authentication with email and password
 */
const LoginPage = () => {
  // State declarations
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper functions
  const validateForm = () => {
    if (!formData.email) return false;
    if (!formData.password) return false;
    return true;
  };

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // JSX
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginPage;
```

### Component Documentation

```javascript
/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * 
 * @param {React.Component} component - Component to render if authenticated
 * @param {Boolean} adminOnly - If true, only admins can access (default: false)
 * 
 * @returns {JSX} Protected route component or redirect to login
 * 
 * @example
 * <Route
 *   path="/dashboard"
 *   element={<ProtectedRoute component={Dashboard} />}
 * />
 */
const ProtectedRoute = ({ component: Component, adminOnly = false }) => {
  // Implementation
};
```

---

## Backend Routes

### Route Documentation

```javascript
/**
 * POST /api/auth/login
 * Login user and return JWT token
 * 
 * @route POST /api/auth/login
 * @param {String} email - User's email (required, must be valid email)
 * @param {String} password - User's password (required, min 6 chars)
 * 
 * @returns {Object} - Token and user data
 * @returns {201} - User created
 * @returns {400} - Validation error
 * @returns {401} - Invalid credentials
 * 
 * @example
 * POST /api/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);
```

### Route Naming

```javascript
// ✅ GOOD: Clear, consistent route names
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', authMiddleware, getProfile);
app.get('/api/admin/dashboard', authMiddleware, adminMiddleware, getDashboard);
app.put('/api/admin/user/:userId', authMiddleware, adminMiddleware, updateUser);
app.delete('/api/admin/user/:userId', authMiddleware, adminMiddleware, deleteUser);

// ❌ BAD: Inconsistent naming
app.post('/auth/reg', register);
app.post('/auth/signin', login);
app.get('/profile', getProfile);
app.get('/admin', getDashboard);
app.post('/admin/update/:id', updateUser);
app.get('/admin/del/:id', deleteUser); // GET for delete? Wrong HTTP method
```

---

## Summary Checklist

### Before Submitting Code

- [ ] Single responsibility principle followed
- [ ] Descriptive names used throughout
- [ ] Comments explain the "why"
- [ ] Error handling implemented
- [ ] Async/await used properly
- [ ] No commented-out code
- [ ] Consistent formatting
- [ ] No console logs in production code
- [ ] All dependencies documented
- [ ] Code is DRY (not repeated)

### Code Review Checklist

- [ ] Does each function do one thing?
- [ ] Are variable names clear?
- [ ] Is error handling proper?
- [ ] Are there memory leaks (useEffect cleanup)?
- [ ] Are API calls optimized?
- [ ] Is sensitive data protected?
- [ ] Are comments helpful?
- [ ] Is the code maintainable?

---

**Remember: Code is read much more often than it's written. Write for future maintainers! 💡**
