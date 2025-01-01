const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Initialize session middleware for /customer route
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    const accessToken = req.session.accessToken; // Retrieve the token from session
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing or invalid." });
    }
    try {
        const decoded = jwt.verify(accessToken, "fingerprint_customer"); // Verify the token with the secret key
        req.user = decoded; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized access. Token verification failed." });
    }
});

const PORT = 5000;

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running"));
