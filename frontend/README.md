# Frontend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- Backend server running on http://localhost:5000

## Installation

1. Navigate to frontend folder:
   ```
   cd frontend
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
   - `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Running the Development Server

```
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

```
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── FormComponents.js
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── context/         # React Context for state management
│   │   └── AuthContext.js
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   └── AdminPage.js
│   ├── App.js           # Main app component with routing
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
└── package.json         # Dependencies

```

## Features

### 🔐 Authentication
- JWT-based authentication
- Login and registration pages
- Protected routes
- Token stored in localStorage
- Auto-configured axios for API calls

### 🎨 UI/UX
- Modern responsive design with Tailwind CSS
- Form validation with error messages
- Loading states and animations
- Alert messages for success/error
- Mobile-friendly layout

### 👤 User Dashboard
- View user profile information
- Display user role and account status
- Show available features based on user role

### 👨‍💼 Admin Panel
- View all users in a table
- User statistics (total, admin, regular)
- Change user roles
- Delete users
- Admin-only access control

### 🛣️ Routing
- Public routes: Home, Login, Register
- Protected routes: Dashboard, Admin
- Automatic redirect to login for unauthenticated users
- Automatic redirect to dashboard for admin-restricted routes

## Components

### AuthContext
- Manages authentication state
- Provides auth functions: register, login, logout
- Stores JWT token
- Auto-restores session on page reload

### ProtectedRoute
- Wraps routes that require authentication
- Checks user role for admin-only routes
- Shows loading state while checking auth
- Redirects unauthorized users

### Navbar
- Shows different UI based on auth status
- Displays user name when logged in
- Shows admin link for admin users
- Logout button

### FormComponents
- `InputField`: Reusable input with validation
- `SubmitButton`: Button with loading state
- `AlertMessage`: Success/error message display

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling. Key utilities:
- Responsive classes: `md:`, `lg:`, etc.
- Flexbox and Grid layouts
- Color utilities: `bg-blue-600`, `text-gray-800`, etc.
- Spacing utilities: `px-4`, `py-2`, `mb-4`, etc.
- Transition utilities: `transition-colors`, `hover:`, `active:`

## API Integration

All API calls use axios and automatically include the JWT token in headers:

```javascript
Authorization: Bearer {token}
```

## Testing

### Demo Credentials
- Email: admin@example.com
- Password: password123

### Test Scenarios
1. Register a new account
2. Login with credentials
3. View dashboard
4. Logout
5. Login as admin
6. Access admin panel
7. Manage users

## Troubleshooting

### Port 3000 already in use
```
PORT=3001 npm start
```

### Styles not loading
```
npm run build
rm -rf node_modules
npm install
npm start
```

### API calls failing
- Ensure backend server is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for error messages

## Clean Code Practices

- Components are well-organized in folders
- Each component has a single responsibility
- Reusable components in `components/`
- Context for state management
- Comments explaining complex logic
- Descriptive variable and function names
- Error handling with try/catch
- Loading states for async operations
