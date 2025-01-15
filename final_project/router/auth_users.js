const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to validate if the username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate username and password
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
};

// Task 7: Login Route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: '1h' });
    req.session.token = token;

    res.status(200).json({ message: "Login successful", token });
});

// Task 8: Add or Modify a Book Review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.query;
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Task 9: Delete a Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
