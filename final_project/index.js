const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const jwtSecret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up session management
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Use routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Define the port
const PORT = 5000;

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
