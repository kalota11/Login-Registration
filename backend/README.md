# Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally, or MongoDB Atlas account
- Windows users: if you rely on the in-memory MongoDB fallback, install the latest supported Visual C++ Redistributable for Visual Studio

## Installation

1. Navigate to backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Change to a strong secret key
   - `PORT`: Server port (default: 5000)
   - `FRONTEND_URL`: Frontend URL (default: http://localhost:3000)

## Running the Server

### Development mode (with auto-reload):
```
npm run dev
```

### Production mode:
```
npm start
```

## API Endpoints

### Authentication
- **POST /api/auth/register** - Register new user
  - Body: `{ name, email, password, confirmPassword }`

- **POST /api/auth/login** - Login user
  - Body: `{ email, password }`
  - Returns: JWT token

- **GET /api/auth/profile** - Get user profile (requires auth)
  - Header: `Authorization: Bearer {token}`

### Admin
- **GET /api/admin/dashboard** - Get admin dashboard (requires admin role)
  - Header: `Authorization: Bearer {token}`

- **PUT /api/admin/user/:userId** - Update user role
  - Header: `Authorization: Bearer {token}`
  - Body: `{ role: 'user' | 'admin' }`

- **DELETE /api/admin/user/:userId** - Delete user
  - Header: `Authorization: Bearer {token}`

## Project Structure
```
backend/
├── config/           # Database configuration
├── controllers/      # Business logic for routes
├── middleware/       # Custom middleware functions
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Security Features
- ✓ JWT authentication
- ✓ Password hashing with bcrypt
- ✓ Input validation with express-validator
- ✓ CORS enabled
- ✓ Error handling middleware
- ✓ Role-based authorization
