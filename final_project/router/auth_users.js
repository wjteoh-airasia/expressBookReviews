const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (e.g., not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// User login (JWT issued)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

  req.session.authorization = {
    token,
    username
  };

  return res.status(200).json({ message: "User logged in successfully." });
});

// Add or update a book review (auth required)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review successfully added/updated." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
