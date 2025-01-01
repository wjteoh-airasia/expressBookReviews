const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username); // Check if username exists
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password; // Check if username and password match
}

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' }); // Sign JWT with user data
    req.session.accessToken = token; // Save the token in session for authentication

    res.status(200).json({ message: "Login successful", token });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = req.user; // Get the username from session
    const { review } = req.query; // Get review from query parameter
    const isbn = req.params.isbn;

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    let existingReview = book.reviews.find(r => r.username === username);
    if (existingReview) {
        existingReview.review = review; // Modify existing review
    } else {
        book.reviews.push({ username, review }); // Add new review
    }

    res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.user; // Get the username from session
    const isbn = req.params.isbn;

    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
    }

    book.reviews.splice(reviewIndex, 1); // Delete the review posted by the user
    res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
