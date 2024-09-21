const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "subhan",
        "password": "43215"
    }
];

const jwtSecret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';

const isValid = (username) => {
    // Check if the username is already taken
    return !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    // Check if username and password match an existing user
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const username = decoded.username;

        if (books[isbn]) {
            books[isbn].reviews[username] = { reviewText: review, timestamp: new Date().toISOString() };
            return res.status(200).json({ message: "Review added/updated successfully" });
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const username = decoded.username;

        if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
