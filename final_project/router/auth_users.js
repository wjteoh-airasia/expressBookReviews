const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'testuser', password: 'testpass' },
  { username: 'anotheruser', password: 'anotherpass' }
];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }

    const username = decoded.username;
    const { isbn } = req.params;
    const { review } = req.body;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review added/updated successfully." });
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token.' });
    }

    const username = decoded.username;
    const { isbn } = req.params;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully." });
    } else {
      res.status(404).json({ message: "Review not found for this user." });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
