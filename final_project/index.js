const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');
const { Session } = require('selenium-webdriver');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Enhanced JSON and URL-encoded parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Session configuration
app.use("/customer", session({
    secret: process.env.SESSION_SECRET || "fingerprint_customer",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    console.log('=== Authentication Middleware ===');
    console.log('Request path:', req.originalUrl);
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Session data:', req.session);
    
    // Check for authorization header (JWT token)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Auth header:', authHeader);
    
    // First check if user is already authenticated in session
    if (req.session && req.session.user && req.session.user.username) {
        console.log('User already authenticated in session:', req.session.user.username);
        req.user = { username: req.session.user.username };
        return next();
    }
    
    // If no session, try JWT authentication
    if (!authHeader) {
        console.log('No Authorization header found');
        // For the review endpoint, we'll allow anonymous users
        if (req.originalUrl.includes('/review/')) {
            console.log('Review endpoint accessed without authentication, proceeding as anonymous');
            req.user = { username: 'anonymous' };
            return next();
        }
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required. Please provide a valid token." 
        });
    }
    
    // Extract token from Authorization header
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.log('Invalid Authorization header format');
        return res.status(401).json({ 
            success: false, 
            message: "Invalid Authorization header format. Use 'Bearer [token]'" 
        });
    }
    
    const token = parts[1];
    if (!token) {
        console.log('No token found in Authorization header');
        return res.status(401).json({ 
            success: false, 
            message: "No token provided in Authorization header" 
        });
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-security-key';
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token", 
                error: err.message 
            });
        }
        
        // Token is valid, attach user info to request
        console.log('JWT verification successful:', decoded);
        req.user = decoded;
        
        // Store user in session for future requests
        req.session.user = { 
            username: decoded.username,
            authenticated: true,
            authTime: new Date().toISOString()
        };
        
        console.log('User session created:', req.session.user);
        next();
    });
});

// Role-based authorization middleware (can be used on specific routes)
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
}

const PORT = process.env.PORT || 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Enhanced request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    console.log('Response Headers:', JSON.stringify(res.getHeaders(), null, 2));
  });
  
  next();
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=== SERVER STARTED ===`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Current time:', new Date().toISOString());
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform, process.arch);
  console.log('Memory usage:', JSON.stringify(process.memoryUsage(), null, 2));
  console.log('========================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});