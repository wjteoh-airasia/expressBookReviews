const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    // Extract the token from the request headers
    const token = req.headers['authorization'];

    if (!token) {
        // If token is missing, return an error response
        return res.status(403).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
        if (err) {
            // If token is invalid, return an error response
            return res.status(401).json({ message: "Failed to authenticate token" });
        }

        // If token is valid, store the decoded information and proceed
        req.user = decoded;
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
