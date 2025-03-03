const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "my_secret_key"; 

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists. Please login." });
    }

    // Add user to the database
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully!" });
});



//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    // Return token in response
    return res.status(200).json({ 
        message: "Login successful!", 
        token: token  // Ensure 'token' property is in response
    });
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader); // Debugging Log

    if (!authHeader) {
        return res.status(403).json({ message: "User not logged in - No Authorization Header" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    console.log("Extracted Token:", token); // Debugging Log

    if (!token) {
        return res.status(403).json({ message: "User not logged in - No Token Found" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log("Token Verification Failed:", err.message); // Debugging Log
            return res.status(403).json({ message: "Invalid token" });
        }
        req.username = decoded.username; // Store username in request object
        console.log("Decoded Token Username:", decoded.username); // Debugging Log
        next();
    });
};



// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.username; // Extracted from JWT token

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review for the user
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
        message: "Review added/updated successfully!", 
        reviews: books[isbn].reviews 
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
