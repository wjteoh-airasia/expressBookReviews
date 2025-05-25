const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');
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

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
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
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(`[${new Date().toISOString()}] Auth check for:`, req.originalUrl);
    
    // Check for authorization header (JWT token)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    // Check if user is already authenticated in session
    if (req.session?.user?.username) {
        req.user = { username: req.session.user.username };
        return next();
    }
    
    // Allow anonymous access to review endpoints
    if (req.originalUrl.includes('/review/')) {
        req.user = { username: 'anonymous' };
        return next();
    }
    
    // Require token for other endpoints
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required" 
        });
    }
    
    // Extract and verify token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token format. Use 'Bearer [token]'" 
        });
    }
    
    const token = parts[1];
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "No token provided" 
        });
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-security-key';
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token"
            });
        }
        
        req.user = decoded;
        req.session.user = { 
            username: decoded.username,
            authenticated: true,
            authTime: new Date().toISOString()
        };
        
        next();
    });
});

const PORT = process.env.PORT || 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});