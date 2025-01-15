const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Initialize session for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    // Verify the token
    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user = decoded;  // Attach decoded user info to request object
        next();  // Proceed to the next middleware or route handler
    });
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
