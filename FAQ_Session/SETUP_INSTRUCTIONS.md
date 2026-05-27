# Complete Setup Instructions

## ✅ All Files Created Successfully!

### 📁 File Structure:
```
FAQ_Session/
├── backend/
│   ├── config/
│   │   └── passport.js          (✅ Passport strategies)
│   ├── middleware/
│   │   └── auth.js              (✅ JWT verification & role middleware)
│   ├── models/
│   │   └── User.js              (✅ User schema with password hashing)
│   └── routes/
│       └── auth.js              (✅ All auth endpoints)
├── server.js                     (✅ Main server file)
├── .env.example                  (✅ Environment template)
└── package.json
```

---

## 🚀 Step 1: Install Dependencies

```bash
npm install express passport passport-local passport-google-oauth20 bcryptjs jsonwebtoken mongoose cors express-session dotenv
```

**Or install individually:**
```bash
npm install express
npm install mongoose
npm install passport passport-local passport-google-oauth20
npm install bcryptjs
npm install jsonwebtoken
npm install cors
npm install express-session
npm install dotenv
```

---

## 🔧 Step 2: Setup Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/faq_session

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# JWT & Session
JWT_SECRET=change-this-to-a-random-secret-in-production
SESSION_SECRET=change-this-to-a-random-secret-in-production

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🔑 Step 3: Google OAuth Setup

### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Go to **Credentials** → Create **OAuth 2.0 Client IDs**
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
7. Copy Client ID and Client Secret to `.env`

---

## 🗄️ Step 4: Setup MongoDB

### Option A: Local MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 🎯 Step 5: Start the Server

```bash
node server.js
```

**Expected Output:**
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📝 Auth endpoints available at http://localhost:5000/auth
```

---

## 📝 Step 6: Test the API Endpoints

### 1️⃣ Register New User (Email/Password)

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Errors:**
- `400` - Missing fields or password < 6 characters
- `409` - Email already registered

---

### 2️⃣ Login with Email/Password

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Errors:**
- `401` - "User not found. Please check your email or sign up."
- `401` - "Wrong password. Please try again or reset your password."

---

### 3️⃣ Google OAuth Login

In your browser or frontend:
```
GET http://localhost:5000/auth/google
```

User will be redirected to Google login, then back to:
```
http://localhost:3000/dashboard?token=...&user=...
```

---

### 4️⃣ Get Current User (Protected Route)

```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

**Errors:**
- `401` - "Not authenticated. Please login."

---

### 5️⃣ Logout

```bash
curl -X POST http://localhost:5000/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful!"
}
```

---

## 🛡️ Error Messages Reference

| Scenario | Error Message |
|----------|---------------|
| Email not found | "User not found. Please check your email or sign up." |
| Wrong password | "Wrong password. Please try again or reset your password." |
| Email already exists | "Email already registered. Please login or use a different email." |
| Google-only account | "This account uses Google login. Please use Google Sign-In instead." |
| Weak password | "Password must be at least 6 characters long" |
| Missing fields | "Please provide email, password, and name" |
| Invalid token | "Invalid token. Please login again." |
| Token expired | "Token expired. Please login again." |
| Not authenticated | "Not authenticated. Please login." |

---

## 🔐 Using Protected Routes in Your App

### Backend (Node.js):
```javascript
const { authMiddleware, roleMiddleware } = require('./backend/middleware/auth');

// Protect a route
app.get('/api/user-profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Teacher-only route
app.post('/api/create-course', 
  authMiddleware, 
  roleMiddleware(['teacher', 'admin']), 
  (req, res) => {
    // Only teachers and admins can access
  }
);
```

### Frontend (React/Vue/Angular):
```javascript
// Login
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);

// Use protected route
const userResponse = await fetch('http://localhost:5000/auth/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});
```

---

## 📦 package.json Scripts

Add these to your `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

Then run:
```bash
npm run dev    # For development with auto-reload
npm start      # For production
```

---

## ✨ Done!

Your authentication system is now ready with:
- ✅ Email/Password registration & login
- ✅ Google OAuth integration
- ✅ JWT token management
- ✅ Role-based access control
- ✅ Password hashing with bcryptjs
- ✅ Comprehensive error handling
- ✅ Protected routes

Start building! 🚀
