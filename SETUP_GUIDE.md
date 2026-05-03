# 🚀 Complete Setup Guide

Follow this step-by-step guide to set up and run the full-stack authentication application.

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** (optional) - For cloning repositories
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

> Windows users: if you rely on the in-memory MongoDB fallback, install the latest supported Visual C++ Redistributable for Visual Studio:
> https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist

## Step 1: MongoDB Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition:
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB:
   ```bash
   # Windows (in Command Prompt)
   net start MongoDB
   
   # macOS/Linux (in Terminal)
   mongod
   ```

3. Verify connection:
   ```bash
   mongo
   # Should show MongoDB shell prompt
   ```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator
- nodemon (for development)

### 2.3 Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your editor (VS Code, Notepad, etc.)
```

### 2.4 Configure Environment Variables

Edit `backend/.env`:

```env
# Server Port
PORT=5000

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/auth-app

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 2.5 Start Backend Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# You should see:
# ✓ Server is running on port 5000
# ✓ MongoDB Connected: localhost
```

**Keep this terminal running!** The backend server should stay active.

## Step 3: Frontend Setup

### 3.1 Open New Terminal/Command Prompt

Open a new terminal window (keep the backend terminal open).

### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- postcss
- autoprefixer
- react-scripts

### 3.4 Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

### 3.5 Configure Environment Variables

The default `.env` should work:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.6 Start Frontend Development Server

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

You should see:
- 🔐 Auth App landing page
- Navigation bar
- Welcome message

## Step 4: Verify Everything Works

### 4.1 Test Backend API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{"success": true, "message": "Server is running"}
```

### 4.2 Test Registration

On the frontend:
1. Click "Register"
2. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Register"
4. You should be redirected to Dashboard

### 4.3 Test Login

1. Click "Logout"
2. Click "Login"
3. Enter credentials:
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Login"
5. You should see your dashboard

## Step 5: Create Admin User (Optional)

To test admin features, you need to create an admin account:

### Option 1: Using MongoDB Shell

```bash
# Open MongoDB shell
mongo

# Use your database
use auth-app

# Update a user to admin
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "john@example.com" })
```

### Option 2: Update via Admin API

First create a user, then log in and update the first user's role to admin using the admin panel.

## Project File Structure Reference

```
loginsignup/
├── backend/
│   ├── config/db.js                 ← MongoDB connection
│   ├── models/User.js               ← User schema
│   ├── controllers/
│   │   ├── authController.js        ← Auth logic
│   │   └── adminController.js       ← Admin logic
│   ├── middleware/
│   │   ├── authMiddleware.js        ← JWT verification
│   │   ├── adminMiddleware.js       ← Admin check
│   │   └── errorHandler.js          ← Error handling
│   ├── routes/
│   │   ├── authRoutes.js            ← Auth endpoints
│   │   └── adminRoutes.js           ← Admin endpoints
│   ├── server.js                    ← Main server
│   ├── package.json
│   └── .env                         ← Environment config
│
└── frontend/
    ├── public/index.html            ← HTML entry
    ├── src/
    │   ├── components/              ← Reusable components
    │   ├── context/AuthContext.js   ← Auth state
    │   ├── pages/                   ← Page components
    │   ├── App.js                   ← Main app
    │   └── index.js                 ← React entry
    ├── package.json
    └── .env                         ← Environment config
```

## Common Issues & Solutions

### Issue: Backend won't start

**Error:** `Cannot find module 'express'`
**Solution:**
```bash
cd backend
npm install
```

**Error:** `MongoDB connection failed`
**Solution:**
- Check MongoDB is running: `mongod` or verify MongoDB Atlas connection
- Verify `MONGODB_URI` in `.env`

### Issue: Frontend won't start

**Error:** `Port 3000 already in use`
**Solution:**
```bash
# Use different port
PORT=3001 npm start
```

### Issue: API calls failing

**Error:** `Cannot POST /api/auth/login`
**Solution:**
- Ensure backend server is running
- Check `REACT_APP_API_URL` in frontend `.env`
- Open browser DevTools → Network tab to see failed requests

### Issue: CORS errors

**Error:** `Access to XMLHttpRequest blocked by CORS`
**Solution:**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Restart backend server after changing `.env`

### Issue: JWT token invalid

**Error:** `Invalid token`
**Solution:**
- Check if JWT_SECRET is the same in backend
- Clear localStorage: Open DevTools → Application → LocalStorage → Delete token
- Log in again

## Usage Tips

### Clear Browser Cache
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh page
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, register, etc.)
4. Click request to see details

### View Browser Logs
1. Open DevTools (F12)
2. Go to Console tab
3. See error/info messages

### MongoDB Atlas Connection
Get connection string:
1. Go to MongoDB Atlas
2. Database → Connect
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` and `<dbname>`

## Security Notes

⚠️ **Before Production:**

1. Change `JWT_SECRET` to a long random string
2. Use HTTPS for all communications
3. Enable rate limiting on API
4. Add request logging
5. Use environment-specific configs
6. Never commit `.env` file
7. Keep dependencies updated

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can access home page
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can view dashboard
- [ ] Can logout
- [ ] Protected routes redirect to login
- [ ] Admin can access admin panel
- [ ] Admin can manage users

## Next Steps

1. **Customize**
   - Change app name in Navbar
   - Modify colors in tailwind.config.js
   - Add more pages as needed

2. **Add Features**
   - Password reset functionality
   - Email verification
   - Two-factor authentication
   - Profile picture upload
   - User search/filtering

3. **Deployment**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Update API URLs for production

## Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT Guide](https://jwt.io/introduction)

## Support

If you encounter issues:

1. Check the error message in console
2. Review the README files in backend/ and frontend/
3. Check environment variables
4. Verify all services are running (MongoDB, backend, frontend)

---

**You're all set! 🎉**

Start coding and building amazing features!
