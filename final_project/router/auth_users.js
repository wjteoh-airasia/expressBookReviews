const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "my_secret_key"; 

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
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
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });

    // Store token in session
    req.session.authorization = { accessToken: token };

    return res.status(200).json({ 
        message: "Login successful!", 
        token: token  // Also return token for debugging
    });
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(403).json({ message: "User not logged in - No Authorization Header" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            console.log("Token Verification Failed:", err.message);
            return res.status(403).json({ message: "Invalid token" });
        }
        req.username = decoded.username;
        next();
    });
};




// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const {isbn} = req.params;
    const {review} = req.body;
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

// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.username; // Extracted from JWT token

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if reviews exist for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user." });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ 
        message: "Review deleted successfully!", 
        reviews: books[isbn].reviews // Return remaining reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
