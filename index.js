const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Example user database
const users = {
    user1: { password: 'password123' },
    user2: { password: 'password456' },
};

// Authenticated user check function
function authenticatedUser(username, password) {
    const user = users[username];
    return user && user.password === password;
}

// Session middleware
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Login route
app.post("/customer/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate user credentials
    if (authenticatedUser(username, password)) { 
        // Generate JWT access token
        let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });

        // Store access token and username in session
        req.session.authorization = { accessToken, username };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

const PORT = 5000;

// Use customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
