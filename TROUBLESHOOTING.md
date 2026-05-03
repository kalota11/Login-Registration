# 🆘 Troubleshooting Guide

Quick solutions for common issues and error messages.

## Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Database Issues](#database-issues)
4. [Authentication Issues](#authentication-issues)
5. [Deployment Issues](#deployment-issues)

---

## Backend Issues

### Issue: "Cannot find module 'express'"

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solutions:**
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

3. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Issue: Port 5000 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F

# Or use different port
set PORT=5001 && npm run dev
```

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 12345

# Or use different port
PORT=5001 npm run dev
```

---

### Issue: Node Modules Not Updating

**Error Message:**
```
npm ERR! Could not install from "..." as it does not contain a package.json file
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Delete lock files
rm package-lock.json

# Reinstall
npm install
```

---

## Frontend Issues

### Issue: "Port 3000 Already in Use"

**Error Message:**
```
Something is already running on port 3000.
Would you like to run the app on another port instead? (Y/n)
```

**Solutions:**

**Option 1: Use Different Port**
```bash
# Windows
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

**Option 2: Kill Process on Port 3000**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID 12345 /F

# macOS/Linux
lsof -i :3000
kill -9 12345
```

---

### Issue: Styles Not Loading (Tailwind CSS)

**Problem:** Pages look unstyled, Tailwind CSS not working

**Solutions:**

1. Rebuild Tailwind:
   ```bash
   cd frontend
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Check `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: ['./src/**/*.{js,jsx}'],
     theme: { extend: {} },
     plugins: [],
   };
   ```

3. Check `index.css` has Tailwind imports:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. Clear cache and restart:
   ```bash
   rm -rf node_modules .cache
   npm install
   npm start
   ```

---

### Issue: "Invalid Hook Call"

**Error Message:**
```
Invalid hook call. Hooks can only be called inside of a function component.
```

**Solutions:**

1. **Using hooks in wrong place:**
   ```javascript
   // ❌ WRONG: Hook outside component
   const token = useAuth(); // Wrong!
   
   const MyComponent = () => {
     return <div>Component</div>;
   };

   // ✅ RIGHT: Hook inside component
   const MyComponent = () => {
     const token = useAuth();
     return <div>{token}</div>;
   };
   ```

2. **Hook in event handler:**
   ```javascript
   // ❌ WRONG
   const handleClick = () => {
     const user = useAuth(); // Wrong!
   };

   // ✅ RIGHT
   const MyComponent = () => {
     const user = useAuth(); // Correct
     
     const handleClick = () => {
       // Use user from outer scope
     };
   };
   ```

---

### Issue: Infinite Loop in useEffect

**Error Message:**
```
Maximum update depth exceeded
```

**Solutions:**

```javascript
// ❌ WRONG: No dependency array - runs every render
useEffect(() => {
  fetchData();
}); // This causes infinite loop

// ✅ RIGHT: Empty dependency array - runs once on mount
useEffect(() => {
  fetchData();
}, []);

// ✅ RIGHT: With dependencies - runs when deps change
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## Database Issues

### Issue: MongoDB Connection Failed

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Start MongoDB (local):**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongo
   # Should show MongoDB shell
   ```

3. **Check MongoDB Atlas connection string:**
   - Go to MongoDB Atlas dashboard
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Update `MONGODB_URI` in `.env`

---

### Issue: "Cannot Connect to MongoDB Atlas"

**Error Message:**
```
MongoServerError: connect ECONNREFUSED
```

**Solutions:**

1. Check connection string in `.env`:
   ```
   # Format should be:
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

2. Verify credentials:
   - Username and password are correct
   - No special characters in password (or URL encoded)

3. Check IP whitelist:
   - MongoDB Atlas → Network Access
   - Add your IP address: 0.0.0.0/0 (for development only!)

4. Test connection:
   ```bash
   # Install mongo client
   npm install -g mongodb-shell
   
   # Test connection
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
   ```

---

### Issue: Duplicate Key Error

**Error Message:**
```
E11000 duplicate key error collection: auth-app.users index: email_1
```

**Solutions:**

1. **Drop unique indexes and recreate:**
   ```javascript
   // In MongoDB shell
   use auth-app
   db.users.dropIndex("email_1")
   ```

2. **Clear and recreate collection:**
   ```javascript
   use auth-app
   db.users.deleteMany({})
   ```

3. **Check Mongoose schema:**
   ```javascript
   // Make sure unique is set correctly
   email: {
     type: String,
     unique: true, // This creates index
   }
   ```

---

## Authentication Issues

### Issue: "Invalid Token"

**Error Message:**
```
{
  "success": false,
  "message": "Invalid token"
}
```

**Solutions:**

1. **Token not sent in header:**
   ```javascript
   // ✅ RIGHT: Include Bearer prefix
   Authorization: Bearer eyJhbGc...
   
   // ❌ WRONG: Missing Bearer
   Authorization: eyJhbGc...
   ```

2. **Token expired:**
   ```javascript
   // Clear and login again
   localStorage.removeItem('token')
   // Then login
   ```

3. **JWT_SECRET changed:**
   ```
   # Verify JWT_SECRET in backend .env matches
   # If changed, all tokens become invalid
   ```

4. **Token corrupted:**
   ```javascript
   // Check in console
   const token = localStorage.getItem('token')
   console.log(token) // Should be long string with dots
   ```

---

### Issue: "Unauthorized" (401) on Protected Route

**Error Message:**
```
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

**Solutions:**

1. **Not logged in:**
   - Register or login first
   - Token should be stored in localStorage

2. **Token not in request header:**
   ```javascript
   // Check axios configuration
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
   ```

3. **Expired session:**
   ```javascript
   // Check token expiry
   const payload = JSON.parse(atob(token.split('.')[1]))
   console.log(new Date(payload.exp * 1000))
   ```

---

### Issue: "Forbidden" (403) - Not Admin

**Error Message:**
```
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**Solutions:**

1. **User not admin:**
   ```bash
   # Make user admin in MongoDB
   use auth-app
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Token not refreshed after role change:**
   ```javascript
   // Logout and login again to get new token
   localStorage.removeItem('token')
   // Then login
   ```

---

## API Issues

### Issue: CORS Error

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**

1. **Check backend CORS config:**
   ```javascript
   // In server.js
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   }));
   ```

2. **Verify FRONTEND_URL in backend .env:**
   ```
   FRONTEND_URL=http://localhost:3000
   ```

3. **Restart backend server:**
   ```bash
   # Stop and restart
   npm run dev
   ```

4. **Clear browser cache:**
   ```javascript
   // In console
   localStorage.clear()
   sessionStorage.clear()
   // Then refresh
   ```

---

### Issue: 404 - Route Not Found

**Error Message:**
```
{
  "success": false,
  "message": "Route not found"
}
```

**Solutions:**

1. **Check API endpoint URL:**
   ```javascript
   // Should match exactly
   POST /api/auth/login // ✅ Correct
   POST /api/Auth/login  // ❌ Wrong (capital A)
   POST /auth/login      // ❌ Wrong (missing /api)
   ```

2. **Verify routes are registered in server.js:**
   ```javascript
   app.use('/api/auth', authRoutes);
   app.use('/api/admin', adminRoutes);
   ```

3. **Check request method:**
   ```javascript
   // GET vs POST matters
   POST /api/auth/login   // ✅ Correct
   GET /api/auth/login    // ❌ Wrong
   ```

---

### Issue: Validation Error

**Error Message:**
```
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "param": "email", "msg": "Invalid value" }
  ]
}
```

**Solutions:**

1. **Check required fields:**
   ```javascript
   // All these fields are required
   name, email, password, confirmPassword
   ```

2. **Email format:**
   ```
   ✅ valid@example.com
   ❌ validexample.com (missing @)
   ❌ valid@example (missing TLD)
   ```

3. **Password requirements:**
   ```
   ✅ password123 (6+ characters)
   ❌ pass (less than 6)
   ```

4. **Passwords must match:**
   ```javascript
   password: "password123"
   confirmPassword: "password123" // Must match
   ```

---

## Development Server Issues

### Issue: Hot Reload Not Working

**Problem:** Changes don't reflect without manual refresh

**Solutions:**

1. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev  # Backend
   npm start    # Frontend
   ```

2. **Check file watcher:**
   ```bash
   # Increase watcher limit (macOS/Linux)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Clear cache:**
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

### Issue: Too Many Open Files

**Error Message:**
```
Error: EMFILE: too many open files
```

**Solutions:**

```bash
# Increase file descriptor limit
# macOS/Linux
ulimit -n 4096

# Windows
# Restart Node or restart computer
```

---

## Memory Issues

### Issue: "JavaScript Heap Out of Memory"

**Error Message:**
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Solutions:**

1. **Increase memory:**
   ```bash
   # macOS/Linux
   node --max-old-space-size=4096 server.js
   
   # Windows
   set NODE_OPTIONS=--max-old-space-size=4096 && npm start
   ```

2. **Check for memory leaks:**
   - Verify useEffect cleanup functions
   - Cancel axios requests in cleanup
   - Remove event listeners

3. **Fix potential memory leak:**
   ```javascript
   useEffect(() => {
     const controller = new AbortController();
     
     fetchData().catch(err => {
       if (err.name !== 'AbortError') {
         console.error(err);
       }
     });

     return () => controller.abort(); // Cleanup
   }, []);
   ```

---

## Quick Fixes Checklist

### When things break:

- [ ] Restart both backend and frontend servers
- [ ] Clear browser cache and localStorage
- [ ] Delete node_modules and reinstall
- [ ] Check .env files are correct
- [ ] Verify MongoDB is running
- [ ] Check browser console for errors
- [ ] Check terminal/console for backend errors
- [ ] Verify API endpoints match exactly
- [ ] Check JWT token exists in localStorage
- [ ] Clear browser DevTools cache (Ctrl+Shift+Delete)

---

## Getting Help

### Debug Steps:

1. **Read the error message carefully**
   - It usually contains the real problem

2. **Check browser console (F12)**
   - Network tab for API errors
   - Console tab for JavaScript errors

3. **Check backend terminal**
   - Logs show what's happening on server

4. **Search error message**
   - Google the exact error message
   - Check Stack Overflow
   - Check GitHub issues

5. **Use DevTools**
   - Inspect network requests
   - Check request/response data
   - Monitor console for errors

### Useful Tools:

- [JWT Debugger](https://jwt.io) - Decode JWT tokens
- [JSON Formatter](https://jsonformatter.org) - Validate JSON
- [Postman](https://www.postman.com) - Test API endpoints
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB

---

**Remember: Most issues are simple - restart the server first! 🔄**
