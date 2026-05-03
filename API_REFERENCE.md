# 🔍 API Quick Reference & Testing Guide

## Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. Get User Profile
```
GET /api/auth/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Admin Endpoints

#### 4. Get Admin Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Admin dashboard data retrieved",
  "data": {
    "totalUsers": 5,
    "adminUsers": 1,
    "regularUsers": 4,
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      ...
    ]
  }
}
```

#### 5. Update User Role
```
PUT /api/admin/user/:userId
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "role": "admin"  // or "user"
}

Response:
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

#### 6. Delete User
```
DELETE /api/admin/user/:userId
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🧪 Testing with cURL

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get Profile (replace TOKEN with actual token)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### 5. Get Admin Dashboard (needs admin token)
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Update User Role (needs admin token and user ID)
```bash
curl -X PUT http://localhost:5000/api/admin/user/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### 7. Delete User (needs admin token and user ID)
```bash
curl -X DELETE http://localhost:5000/api/admin/user/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste the following JSON or create manually

### Collection Template

```json
{
  "info": {
    "name": "Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"email\": \"john@example.com\", \"password\": \"password123\", \"confirmPassword\": \"password123\"}"
        }
      }
    }
  ]
}
```

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 JWT Token Format

JWT tokens consist of 3 parts separated by dots: `header.payload.signature`

### Example Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjQzODAxMDAwLCJleHAiOjE2NDQzOTQwMDB9.abcdefg...
```

### Decode JWT
```
// Use jwt.io to decode without verification
// Just paste token to see payload
```

---

## ✅ Testing Checklist

### User Registration
- [ ] Valid registration data → Success with token
- [ ] Invalid email format → Error message
- [ ] Password < 6 characters → Error message
- [ ] Passwords don't match → Error message
- [ ] Email already exists → Error message
- [ ] Missing required fields → Error message

### User Login
- [ ] Correct email & password → Success with token
- [ ] Wrong password → Error message
- [ ] Non-existent email → Error message
- [ ] Missing email or password → Error message

### Authentication
- [ ] Valid token → Can access protected routes
- [ ] Invalid token → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] No token → 401 Unauthorized
- [ ] Token in header format: `Bearer {token}` ✓

### Authorization
- [ ] Regular user access dashboard → Success
- [ ] Regular user access admin → 403 Forbidden
- [ ] Admin access admin panel → Success
- [ ] Admin can view users → Success
- [ ] Admin can change roles → Success
- [ ] Admin can delete users → Success

---

## 🐛 Debugging Tips

### View Request Details
Browser DevTools → Network tab → Click request → See full details

### View Response
Browser DevTools → Network tab → Click request → Response tab

### View Stored Token
Browser DevTools → Application → LocalStorage → Find `token` key

### Clear Token
```javascript
// In browser console:
localStorage.removeItem('token')
```

### View JWT Payload
```javascript
// In browser console:
const token = localStorage.getItem('token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log(payload)
```

### Check Backend Logs
Terminal where backend runs → See console output with request details

---

## 📊 Error Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful |
| 201 | Created | User registered |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Not admin |
| 404 | Not Found | User not found |
| 500 | Server Error | Database error |

---

## 🔄 Complete Flow Example

```bash
# 1. Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "secure123",
    "confirmPassword": "secure123"
  }'

# Response includes token - save it
TOKEN="eyJhbGc..."

# 2. Get user profile
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Logout by clearing token on frontend
# localStorage.removeItem('token')

# 4. Login again
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secure123"
  }'
```

---

## 🚀 Performance Tips

1. **Minimize API Calls**: Cache user data when possible
2. **Token Refresh**: Implement token refresh before expiry
3. **Lazy Load**: Load admin features only when needed
4. **Compress Images**: Optimize profile pictures
5. **Database Indexes**: Index email field for faster lookups

---

## 📚 Additional Resources

- [JWT Debugger](https://jwt.io)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [REST API Best Practices](https://restfulapi.net)
- [Express.js Error Handling](https://expressjs.com/en/guide/error-handling.html)

---

**Happy testing! 🎉**
