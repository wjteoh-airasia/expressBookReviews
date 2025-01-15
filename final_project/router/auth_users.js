const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Get username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create a JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });

    // Save the token in session
    req.session.authorization = { username, accessToken }; // Store username in session too

    return res.status(200).json({ message: "Login successful", accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get ISBN from request parameters
    const { review } = req.query; // Get review from request query

    // Check if user is logged in
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.username; // Get username from session

    // Validate that review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    // Find the book by ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);
    
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or modify the review for the specific user
    book.reviews[username] = review; // Add or update the review

    return res.status(200).json({ message: "Review added/modified successfully.", reviews: book.reviews });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
