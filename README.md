# 🔐 Full-Stack Authentication System

A complete full-stack application with React frontend, Node.js/Express backend, MongoDB database, and JWT authentication.

## 🎯 Project Overview

This project implements a modern authentication system with:
- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Password hashing with bcrypt
- **Authorization**: Role-based access control (user/admin)

## 📁 Project Structure

```
loginsignup/
├── backend/                 # Node.js + Express server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── adminController.js    # Admin logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── adminMiddleware.js    # Admin check
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── authRoutes.js   # Auth endpoints
│   │   └── adminRoutes.js  # Admin endpoints
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── README.md           # Backend documentation
│
├── frontend/                # React + Tailwind CSS
│   ├── public/
│   │   └── index.html      # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js              # Navigation bar
│   │   │   ├── ProtectedRoute.js      # Route protection
│   │   │   └── FormComponents.js      # Reusable form components
│   │   ├── context/
│   │   │   └── AuthContext.js         # Auth state management
│   │   ├── pages/
│   │   │   ├── HomePage.js            # Landing page
│   │   │   ├── LoginPage.js           # Login page
│   │   │   ├── RegisterPage.js        # Registration page
│   │   │   ├── DashboardPage.js       # User dashboard
│   │   │   └── AdminPage.js           # Admin panel
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── README.md           # Frontend documentation
│
└── README.md               # This file
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-app
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the server:
   ```bash
   npm run dev  # Development mode with auto-reload
   # or
   npm start    # Production mode
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password, confirmPassword }`
- **Response**: `{ success, token, user }`

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, token, user }`

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success, user }`

### Admin Routes (Requires Admin Role)

#### Get Admin Dashboard
- **GET** `/api/admin/dashboard`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success, data: { totalUsers, adminUsers, regularUsers, users } }`

#### Update User Role
- **PUT** `/api/admin/user/:userId`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ role: 'user' | 'admin' }`
- **Response**: `{ success, user }`

#### Delete User
- **DELETE** `/api/admin/user/:userId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success, message }`

## 🔐 Security Features

### Password Security
- Passwords are hashed using bcrypt before storage
- Never stored in plain text
- Salting with 10 rounds

### JWT Authentication
- Tokens expire after 7 days (configurable)
- Tokens verified on every protected request
- Invalid/expired tokens return 401 error

### Authorization
- Role-based access control
- Admin middleware checks user role
- Protected routes redirect unauthorized users

### Input Validation
- Express-validator for input validation
- Email format validation
- Password strength requirements
- Sanitized and trimmed inputs

### CORS
- Configured for frontend domain
- Credentials allowed
- Limited to specific origins

## 📋 Database Schema

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    hashed: true  // Using bcrypt
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Features

### Pages

1. **Home Page** - Landing page with features overview
2. **Login Page** - User authentication with validation
3. **Register Page** - New user registration with password confirmation
4. **Dashboard** - User profile and welcome message
5. **Admin Panel** - User management and statistics

### Components

- **Navbar** - Navigation with conditional rendering
- **ProtectedRoute** - Route protection wrapper
- **FormComponents** - Reusable form inputs and buttons
- **AuthContext** - Global authentication state

### Styling

- Tailwind CSS for utility-first styling
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and animations
- Dark/light compatible colors

## 🔄 Authentication Flow

```
1. User registers/logs in
2. Backend validates credentials
3. Backend generates JWT token
4. Token returned to frontend
5. Frontend stores token in localStorage
6. Token added to axios headers automatically
7. Protected routes check token validity
8. Token verified by authMiddleware
9. User role checked by adminMiddleware if needed
10. Response sent with user data or error
```

## 🧪 Testing

### Demo Account
- Email: `admin@example.com`
- Password: `password123`

### Test Scenarios

1. **Registration**
   - Create new account with valid credentials
   - Test password confirmation
   - Verify email uniqueness

2. **Login**
   - Login with correct credentials
   - Test invalid credentials
   - Verify token generation

3. **Dashboard**
   - View user profile
   - Check role display
   - See available features

4. **Admin Features**
   - View all users
   - Change user roles
   - Delete users
   - View statistics

## 🛠️ Development

### Backend Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT generation
- **express-validator**: Input validation
- **cors**: Cross-origin support
- **dotenv**: Environment variables

### Frontend Dependencies

- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework

## 📖 Clean Code Practices

### Backend
- Separated concerns (controllers, routes, middleware, models)
- Descriptive function and variable names
- Comments explaining complex logic
- Error handling with try/catch
- Async/await for asynchronous operations
- Reusable middleware for cross-cutting concerns

### Frontend
- Component-based architecture
- Reusable components
- Context API for state management
- Proper prop validation
- Loading states and error boundaries
- Comments explaining complex logic

## 🐛 Error Handling

### Backend
- Validation errors with field-level messages
- Authentication errors (401)
- Authorization errors (403)
- Server errors (500)
- Mongoose validation and cast errors

### Frontend
- Try/catch for API calls
- User-friendly error messages
- Form validation before submission
- Network error handling
- Loading states for async operations

## 🔒 Security Best Practices

✅ Never store plain text passwords
✅ Use JWT for stateless authentication
✅ Validate and sanitize all inputs
✅ Use HTTPS in production
✅ Implement CORS properly
✅ Hash passwords with salt
✅ Verify tokens on protected routes
✅ Use environment variables for secrets
✅ Implement request rate limiting (recommended)
✅ Log security events (recommended)

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Connect to MongoDB Atlas or production database
4. Set correct `FRONTEND_URL`
5. Use process manager (PM2)
6. Enable HTTPS

### Frontend
1. Run `npm run build`
2. Deploy `build/` folder to static hosting
3. Configure environment for production
4. Set correct API URL
5. Enable caching headers

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT.io](https://jwt.io)
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Happy coding! 🚀**
